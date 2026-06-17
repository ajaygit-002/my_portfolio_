const fs = require('fs');
const path = require('path');

const replacements = {
  '#050816': '#FFFFFF',
  '#00E5FF': '#2563EB',
  '#7C3AED': '#8B5CF6',
  '#0A0F2C': '#F3F4F6',
  '#00FFA3': '#10B981',
  'text-white': 'text-text-primary',
  'border-white/5': 'border-black/5',
  'border-white/10': 'border-black/10',
  'bg-white/5': 'bg-black/5',
  'bg-white/10': 'bg-black/10',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [key, value] of Object.entries(replacements)) {
    if (content.includes(key)) {
      content = content.split(key).join(value);
      changed = true;
    }
  }
  
  // Specific fix for gradient text or buttons where we WANT white text
  // if text-text-primary is used alongside from-secondary
  content = content.replace(/from-secondary to-primary text-text-primary/g, 'from-secondary to-primary text-white');
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
