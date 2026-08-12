const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walk(path.join(__dirname, 'src'));

let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove all dark mode variants
  content = content.replace(/dark:[a-zA-Z0-9\-\/\[\]#]+/g, '');

  // 2. Map standard background colors
  content = content.replace(/\bbg-(slate|gray|zinc|neutral|stone)-[0-9]{2,3}(\/[0-9]+)?\b/g, 'bg-white/60');
  content = content.replace(/\bbg-white\b/g, 'bg-white/60');

  // 3. Map standard border colors
  content = content.replace(/\bborder-(slate|gray|zinc|neutral|stone)-[0-9]{2,3}(\/[0-9]+)?\b/g, 'border-[#b0ba99]');
  
  // 4. Map text colors
  content = content.replace(/\btext-(slate|gray|zinc|neutral|stone)-[0-9]{2,3}(\/[0-9]+)?\b/g, 'text-[#4e220f]');
  
  // 5. Map accent colors (purple, pink, rose, amber)
  content = content.replace(/\bbg-(purple|pink|rose|amber|indigo|blue)-[0-9]{2,3}(\/[0-9]+)?\b/g, 'bg-[#b0ba99]');
  content = content.replace(/\btext-(purple|pink|rose|amber|indigo|blue)-[0-9]{2,3}(\/[0-9]+)?\b/g, 'text-[#9d6638]');
  content = content.replace(/\bborder-(purple|pink|rose|amber|indigo|blue)-[0-9]{2,3}(\/[0-9]+)?\b/g, 'border-[#b0ba99]');

  // 6. Map existing hardcoded colors
  content = content.replace(/bg-\[\#7C3AED\]/gi, 'bg-[#9d6638]');
  content = content.replace(/text-\[\#7C3AED\]/gi, 'text-[#9d6638]');

  // 7. Clean up multiple spaces that might have resulted from removing dark: classes
  content = content.replace(/\s{2,}/g, ' ');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  }
}

console.log(`Updated ${updatedCount} files.`);
