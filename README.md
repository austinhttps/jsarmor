# JS Armor

Fast, client-side JavaScript obfuscation service. Runs entirely in your browser using Web Workers so sensitive code and proprietary logic never touch a remote server.

Live instance: [jsarmor.vercel.app](https://jsarmor.vercel.app)

---

## Features

- **Client-Side Processing:** All AST transformations execute locally in isolated Web Workers via `javascript-obfuscator`. Zero network requests for your code.
- **Three Protection Tiers:**
  - `Tier 1 (Light)`: Minification and identifier mangling with 0% runtime CPU penalty.
  - `Tier 2 (Balanced)`: String array extraction, base64 encryption, and rotated object property lookups.
  - `Tier 3 (Stealth)`: Control-flow flattening, dead code injection, and RC4 string encoding.
- **Interactive Dual Editor:** Side-by-side Monaco code editor with inline diff mode, syntax validation, and instant file export.
- **Batch ZIP Archive Protection:** Drag-and-drop a project `.zip` archive. Obfuscates all `.js`, `.mjs`, and `.cjs` files while keeping directory structures, HTML, CSS, and media assets untouched.
- **Security Boundaries:**
  - *Domain Lock*: Halts execution if the script runs on unauthorized hostnames.
  - *Self-Defending*: Injects recursion traps against code beautification or formatting.
  - *Debug Protection*: Halts execution with continuous debugger triggers when DevTools are opened.
- **Isolated Sandbox Test:** Runs obfuscated code in a sandboxed iframe to capture console logs and verify runtime behavior before deployment.
- **Configuration & CLI Export:** Download `obfuscator.config.json`, generate `npx javascript-obfuscator` build commands, or share snippets via URL hash state.

---

## Architecture

```
[ Monaco Editor / ZIP Dropzone ]
               │
               ▼
   [ Worker Controller Bridge ]
               │ (postMessage)
               ▼
    [ Dedicated Web Worker ]
   javascript-obfuscator AST
   Metrics & Syntax Validation
               │
               ▼
[ Monaco Output / JSZip Repacker ]
```

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run test suite
npm test

# Build for production
npm run build
```

## License

MIT
