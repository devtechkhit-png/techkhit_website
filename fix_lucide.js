const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Add Lucide script back if it's missing
  if (!content.includes('unpkg.com/lucide')) {
    content = content.replace('<link rel="stylesheet" href="output.css">', 
      '<link rel="stylesheet" href="output.css">\n  <!-- Lucide Icons -->\n  <script src="https://unpkg.com/lucide@latest"></script>'
    );
  }

  // Change let mobileMenuOpen to var mobileMenuOpen to fix hoisting issues
  content = content.replace(/let mobileMenuOpen = false;/g, 'var mobileMenuOpen = false;');

  fs.writeFileSync(file, content);
});

console.log("Restored Lucide and fixed mobileMenuOpen hoisting");
