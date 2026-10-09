import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (item.name.endsWith('.jsx') || item.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walk('src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("from 'framer-motion'")) {
    let changed = false;

    // Replace import { motion -> import { m
    if (content.includes('import { motion')) {
      content = content.replace(/import\s*\{\s*motion\s*,/g, 'import { m,');
      content = content.replace(/import\s*\{\s*motion\s*\}/g, 'import { m }');
      content = content.replace(/,\s*motion\s*\}/g, ', m }');
      content = content.replace(/,\s*motion\s*,/g, ', m,');
      changed = true;
    }

    // Replace <motion. -> <m.
    if (content.includes('<motion.')) {
      content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<m.$1');
      content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</m.$1>');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${file}`);
    }
  }
}
console.log('Conversion to m.* completed!');
