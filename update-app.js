const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Insert isWeb definition
if (!code.includes('const isWeb')) {
  code = code.replace(
    'const handleMinimize = () => window.electronAPI?.minimize();',
    'const isWeb = typeof window !== "undefined" && !window.electronAPI;\n  const handleMinimize = () => window.electronAPI?.minimize();'
  );
}

// Insert download button
if (!code.includes('<Download size={18} />')) {
  code = code.replace(
    '<Settings size={18} />\n            </button>',
    `<Settings size={18} />\n            </button>\n            {isWeb && (\n              <a href="https://github.com/your-username/aura-app/releases/latest/download/Aura-1.0.0-arm64.dmg" className={\`absolute -right-10 top-0 p-2 rounded-full hover:bg-white/20 transition \${textColors[bgTheme]}\`} title="Download Mac Widget" target="_blank" rel="noopener noreferrer">\n                <Download size={18} />\n              </a>\n            )}`
  );
}

fs.writeFileSync('src/App.jsx', code);
