import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import { useRestaurant } from './RestaurantContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { activeRestaurant } = useRestaurant();

  // Read table number from query param ?table= or localStorage
  const getInitialTable = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        localStorage.setItem('devi_selected_table', tableParam);
        return tableParam;
      }
      const saved = localStorage.getItem('devi_selected_table');
      if (saved) return saved;
    } catch (e) {
      console.error('Error reading table number', e);
    }
    return '';
  };

  const [tableNumber, setTableNumberState] = useState(getInitialTable);
  const [cartItems, setCartItems] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isOrderPlacedModalOpen, setIsOrderPlacedModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastServiceRequestTime, setLastServiceRequestTime] = useState(0);

  // Set table number, persist in localStorage and sync with URL query ?table=
  const setTableNumber = (table) => {
    setTableNumberState(table);
    try {
      if (table) {
        localStorage.setItem('devi_selected_table', table);
        const url = new URL(window.location.href);
        url.searchParams.set('table', table);
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {
      console.error('Error saving table number', e);
    }
  };



  // Show Toast
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id ? null : prev));
    }, 3000);
  };

  // Add Item to Cart
  const addToCart = (item, quantity = 1, selectedCustomizations = [], specialNotes = '') => {
    if (!item.isAvailable || item.isSoldOut) {
      showToast(`${item.name} is currently sold out`, 'warning');
      return;
    }

    // Calculate customization total
    const customTotal = selectedCustomizations.reduce((sum, c) => sum + (c.price || 0), 0);
    const itemUnitPrice = (item.price || 0) + customTotal;

    // Create unique key for item + customized configuration
    const custKey = selectedCustomizations.map(c => c.id).sort().join('_');
    const cartItemId = `${item.id}-${custKey}`;

    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          totalPrice: (updated[existingIndex].quantity + quantity) * itemUnitPrice,
          specialNotes: specialNotes || updated[existingIndex].specialNotes,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            ...item,
            cartItemId,
            quantity,
            selectedCustomizations,
            unitPrice: itemUnitPrice,
            basePrice: item.price,
            totalPrice: quantity * itemUnitPrice,
            specialNotes,
          },
        ];
      }
    });

    showToast(`Added ${item.name} to cart`, 'success');
  };

  // Update Quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  // Update Item Note
  const updateItemNote = (cartItemId, note) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, specialNotes: note };
        }
        return item;
      })
    );
  };

  // Remove Item
  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setOrderNotes('');
  };

  // Totals Calculation
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxRate = activeRestaurant?.settings?.taxRate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const serviceChargeRate = activeRestaurant?.settings?.serviceChargeRate || 0;
  const serviceChargeAmount = (subtotal * serviceChargeRate) / 100;
  const grandTotal = subtotal + taxAmount + serviceChargeAmount;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Helper to get sanitized WhatsApp phone number
  const getCleanWhatsAppNumber = () => {
    const raw = activeRestaurant?.contact?.whatsapp || activeRestaurant?.contact?.phone || '';
    return raw.replace(/[^0-9]/g, '');
  };

  // Place Order / Send to Kitchen via WhatsApp & Local State
  const placeOrder = () => {
    if (cartItems.length === 0) return false;

    // 1. Force table selection if missing
    if (!tableNumber || !tableNumber.trim()) {
      showToast('Please select your Table number before ordering', 'warning');
      setIsTableModalOpen(true);
      return false;
    }

    // 2. Validate WhatsApp number
    const cleanWa = getCleanWhatsAppNumber();
    if (!cleanWa) {
      showToast('Restaurant WhatsApp number is not configured in settings', 'error');
      return false;
    }

    const isSubsequentRound = activeOrder && activeOrder.tableNumber === tableNumber;
    const orderRound = isSubsequentRound ? (activeOrder.round || 1) + 1 : 1;
    const orderId = isSubsequentRound ? activeOrder.orderId : `ORD-#${Math.floor(1000 + Math.random() * 9000)}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const curr = activeRestaurant?.currency || '₹';

    const mergedItems = isSubsequentRound ? [...activeOrder.items, ...cartItems] : [...cartItems];
    const combinedSubtotal = (isSubsequentRound ? activeOrder.subtotal : 0) + subtotal;
    const combinedTax = (isSubsequentRound ? activeOrder.taxAmount : 0) + taxAmount;
    const combinedService = (isSubsequentRound ? activeOrder.serviceChargeAmount : 0) + serviceChargeAmount;
    const combinedGrandTotal = (isSubsequentRound ? activeOrder.grandTotal : 0) + grandTotal;

    const newOrder = {
      orderId,
      round: orderRound,
      tableNumber,
      restaurantName: activeRestaurant?.name || 'Devi Fast Food',
      items: mergedItems,
      subtotal: combinedSubtotal,
      taxAmount: combinedTax,
      serviceChargeAmount: combinedService,
      grandTotal: combinedGrandTotal,
      orderNotes: orderNotes || activeOrder?.orderNotes || '',
      status: 'Sent to Kitchen',
      createdAt: timeStr,
      latestRoundItems: [...cartItems],
    };

    // Construct clean, beautiful pre-filled WhatsApp message
    let waMsg = isSubsequentRound
      ? `🍽️ *ADDITIONAL ORDER (ROUND ${orderRound})*\n`
      : `🍽️ *NEW DINE-IN TABLE ORDER*\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `📍 *Restaurant:* ${activeRestaurant?.name || 'Devi Fast Food'}\n`;
    waMsg += `🪑 *Table:* Table ${tableNumber}\n`;
    waMsg += `🆔 *Order ID:* ${orderId}${isSubsequentRound ? ` (Round ${orderRound})` : ''}\n`;
    waMsg += `🕒 *Time:* ${timeStr}\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    waMsg += isSubsequentRound ? `*NEW ITEMS ADDED (THIS ROUND):*\n` : `*ITEMS ORDERED:*\n`;

    cartItems.forEach((item, idx) => {
      waMsg += `${idx + 1}. *${item.quantity}x ${item.name}* — ${curr}${item.totalPrice.toFixed(2)}\n`;
      if (item.selectedCustomizations && item.selectedCustomizations.length > 0) {
        const custNames = item.selectedCustomizations.map(c => c.name).join(', ');
        waMsg += `   └ Extras: ${custNames}\n`;
      }
      if (item.specialNotes && item.specialNotes.trim()) {
        waMsg += `   └ Cooking Note: "${item.specialNotes.trim()}"\n`;
      }
    });

    if (orderNotes && orderNotes.trim()) {
      waMsg += `\n📝 *Kitchen Cooking Instructions:*\n"${orderNotes.trim()}"\n`;
    }

    waMsg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    if (isSubsequentRound) {
      waMsg += `*This Round Total:* ${curr}${grandTotal.toFixed(2)}\n`;
      waMsg += `*CUMULATIVE TABLE TOTAL:* ${curr}${combinedGrandTotal.toFixed(2)}\n`;
    } else {
      waMsg += `*Item Subtotal:* ${curr}${subtotal.toFixed(2)}\n`;
      if (taxAmount > 0) {
        waMsg += `*GST/Tax:* ${curr}${taxAmount.toFixed(2)}\n`;
      }
      if (serviceChargeAmount > 0) {
        waMsg += `*Service Charge:* ${curr}${serviceChargeAmount.toFixed(2)}\n`;
      }
      waMsg += `*GRAND TOTAL:* ${curr}${grandTotal.toFixed(2)}\n`;
    }
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `_Sent via Devi QR Digital Table Ordering_`;

    // Open WhatsApp pre-filled link
    const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');

    // Update active order and orders history
    setActiveOrder(newOrder);
    setOrdersHistory(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    setIsOrderPlacedModalOpen(true);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c99738', '#ffffff', '#e5a951', '#f43f5e', '#c4161c'],
      });
    } catch (e) {
      console.log('Confetti effect', e);
    }

    // Simulate Kitchen progress updates
    setTimeout(() => {
      setActiveOrder(prev => (prev ? { ...prev, status: 'Preparing in Kitchen 🔥' } : null));
    }, 12000);

    setTimeout(() => {
      setActiveOrder(prev => (prev ? { ...prev, status: 'Food Served to Table 🍽️' } : null));
    }, 28000);

    return true;
  };

  // Call Waiter / Service Request via WhatsApp with 30s Cooldown
  const callWaiter = (serviceType = 'General Assistance') => {
    // 1. Force table selection if missing
    if (!tableNumber || !tableNumber.trim()) {
      showToast('Please select your Table number first', 'warning');
      setIsTableModalOpen(true);
      return false;
    }

    // 2. 30-second cooldown check to prevent spam
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastServiceRequestTime) / 1000);
    const COOLDOWN = 30;
    if (elapsedSeconds < COOLDOWN) {
      const remaining = COOLDOWN - elapsedSeconds;
      showToast(`Please wait ${remaining}s before sending another request`, 'warning');
      return false;
    }

    // 3. Validate WhatsApp number
    const cleanWa = getCleanWhatsAppNumber();
    if (!cleanWa) {
      showToast('Restaurant WhatsApp number is not configured in settings', 'error');
      return false;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let waMsg = `🔔 *TABLE SERVICE REQUEST*\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `📍 *Restaurant:* ${activeRestaurant?.name || 'Devi Fast Food'}\n`;
    waMsg += `🪑 *Table:* Table ${tableNumber}\n`;
    waMsg += `🛎️ *Request:* ${serviceType}\n`;
    waMsg += `🕒 *Time:* ${timeStr}\n`;
    waMsg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    waMsg += `_Customer at Table ${tableNumber} requires staff assistance._`;

    const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');

    setLastServiceRequestTime(now);
    showToast(`🔔 Waiter request sent for Table ${tableNumber} (${serviceType})`, 'success');
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        tableNumber,
        setTableNumber,
        addToCart,
        updateQuantity,
        updateItemNote,
        removeFromCart,
        clearCart,
        subtotal,
        taxAmount,
        serviceChargeAmount,
        grandTotal,
        totalItemsCount,
        orderNotes,
        setOrderNotes,
        placeOrder,
        activeOrder,
        ordersHistory,
        isOrderPlacedModalOpen,
        setIsOrderPlacedModalOpen,
        isCartOpen,
        setIsCartOpen,
        isTableModalOpen,
        setIsTableModalOpen,
        callWaiter,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
