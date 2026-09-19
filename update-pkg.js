const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.author = "Dammy";
pkg.description = "Aura App";
pkg.build = {
  "appId": "com.aura.app",
  "productName": "Aura",
  "directories": {
    "output": "dist-electron"
  },
  "mac": {
    "target": ["dmg"],
    "icon": "public/gears.jpg"
  },
  "files": [
    "dist/**/*",
    "electron/**/*"
  ]
};
pkg.scripts["build:mac"] = "vite build && electron-builder --mac";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
