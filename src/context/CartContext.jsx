import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useRestaurant } from './RestaurantContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { activeRestaurant } = useRestaurant();

  // Read table number from query param ?table=04 or restaurant settings
  const getInitialTable = () => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) return tableParam;
    return activeRestaurant?.settings?.defaultTable || '04';
  };

  const [tableNumber, setTableNumber] = useState(getInitialTable);
  const [cartItems, setCartItems] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isOrderPlacedModalOpen, setIsOrderPlacedModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Update table number if query changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, []);

  // Show Toast
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id ? null : prev));
    }, 3000);
  };

  // Add Item to Cart
  const addToCart = (item, quantity = 1, selectedCustomizations = [], specialNotes = '') => {
    if (!item.isAvailable) {
      showToast(`${item.name} is currently unavailable`, 'warning');
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

  // Place Order / Send to Kitchen
  const placeOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = {
      orderId: `ORD-#${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber,
      restaurantName: activeRestaurant.name,
      items: [...cartItems],
      subtotal,
      taxAmount,
      serviceChargeAmount,
      grandTotal,
      orderNotes,
      status: 'Sent to Kitchen', // 'Sent to Kitchen' -> 'Preparing' -> 'Served'
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

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
        colors: ['#c99738', '#ffffff', '#e5a951', '#f43f5e'],
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
  };

  // Call Waiter / Service Request
  const callWaiter = (serviceType = 'General Assistance') => {
    showToast(`🔔 Waiter alerted for Table ${tableNumber} (${serviceType})`, 'success');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        tableNumber,
        setTableNumber,
        addToCart,
        updateQuantity,
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
