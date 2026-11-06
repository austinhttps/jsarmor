const fs = require('fs');
const filePath = 'node_modules/javascript-obfuscator/dist/index.browser.js';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Chance check in bundled javascript-obfuscator uses `chance=new l` without `var` when inside worker without window
  // In modern ES module workers, strict mode is active, causing `ReferenceError: chance is not defined`
  const target = '"undefined"!=typeof importScripts&&(chance=new l,self.Chance=l)';
  const replacement = '"undefined"!=typeof self&&(self.chance=new l,self.Chance=l)';
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched javascript-obfuscator/dist/index.browser.js successfully!');
  } else {
    console.log('Target string not found or already patched.');
  }
}
