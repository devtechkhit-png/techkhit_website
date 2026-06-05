const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const svgInsta = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>';
const svgFb = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
const svgLi = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>';

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace Tailwind CDN with local CSS link
  const cdnRegex = /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>[\s\S]*?<script>\s*tailwind\.config = \{[\s\S]*?\}\s*<\/script>/m;
  if (cdnRegex.test(content)) {
    content = content.replace(cdnRegex, '<link rel="stylesheet" href="output.css">');
  } else {
    content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, '<link rel="stylesheet" href="output.css">');
    content = content.replace(/<script>\s*tailwind\.config = \{[\s\S]*?\}\s*<\/script>/g, '');
  }

  // Replace lucide icons with inline SVGs
  content = content.replace(/<i data-lucide="instagram"[^>]*><\/i>/g, svgInsta);
  content = content.replace(/<i data-lucide="facebook"[^>]*><\/i>/g, svgFb);
  content = content.replace(/<i data-lucide="linkedin"[^>]*><\/i>/g, svgLi);

  fs.writeFileSync(file, content);
});

console.log("Processed all HTML files");
