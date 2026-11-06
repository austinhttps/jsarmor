# JS Armor | In-Browser JavaScript Obfuscation Web Service

A zero-trust, client-side web application and developer service for protecting JavaScript source code and distribution bundles.

![JS Armor Interface](public/vite.svg)

---

## Key Highlights

- **100% Client-Side Privacy (Zero-Trust):** Transformations occur entirely inside your browser via dedicated Web Workers. No proprietary intellectual property or scripts ever leave your machine or hit remote servers.
- **Dedicated Web Worker Engine:** Offloads AST scrambling, identifier mangling, and string array generation off the main UI thread. Full cancel/abort and timeout resilience.
- **Curated Outcome Presets:**
  - **Light (Performance):** Variable mangling, minification, and zero runtime performance impact.
  - **Balanced (Recommended):** Base64/string array extraction, index rotation, and object key obfuscation.
  - **Stealth (Maximum Security):** Control flow flattening, dead code injection, and RC4 string encryption.
- **Fine-Grained AST Control:** Expandable knobs for fine-tuning threshold percentages, string chunks, number transformations, and console silencing.
- **Enterprise Security Features:**
  - **Domain Locking:** Restricts script execution to approved domains and ports (redirects unauthorized execution to `about:blank`).
  - **Self-Defending Anti-Tamper:** Detects code beautification or formatting and halts with defensive recursion traps.
  - **Debug Protection:** Fires continuous `debugger;` triggers if DevTools are opened.
- **Dual Monaco Editor & Diff View:** Syntax highlighted side-by-side editing, diff inspector, instant copy, and single `.js` file export.
- **Multi-File & ZIP Batch Processor:** Drag-and-drop `.zip` projects or distribution packages. Obfuscates all `.js`, `.mjs`, and `.cjs` files while retaining directory structures, HTML, CSS, and media assets untouched.
- **Diagnostics Bar:** Real-time feedback on original vs. obfuscated byte size, expansion percentage, compute time (ms), and syntax validation.
- **CLI Exporter & URL Sharing:** Export `obfuscator.config.json`, generate copyable `npx javascript-obfuscator` commands, and share snippets with URL hash state.
- **Sandboxed Test Runner:** Execute transformed scripts inside an isolated iframe sandbox to verify runtime console logs and confirm no syntax/scoping breakages occurred.

---

## Getting Started

### Prerequisites
- Node.js >= 18 (Tested on Node 20 & Node 26)
- npm or pnpm

### Installation
```bash
git clone <repo-url>
cd JSObfuscation
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Running Unit Tests
```bash
npm test
```
All unit test suites run via [Vitest](https://vitest.dev).

### Production Build
```bash
npm run build
```
Generates production-optimized chunks in `dist/` ready to host on GitHub Pages, Vercel, Netlify, or any static file server.

---

## Architecture & Worker Pipeline

```
[ Monaco Code Editor / ZIP Dropzone ]
                 │
                 ▼
    [ Worker Controller Bridge ]
                 │ (postMessage)
                 ▼
     [ Dedicated Web Worker ]
   ┌───────────────────────────┐
   │ javascript-obfuscator AST │
   │ Metric & Timing Computer  │
   │ Pre/Post Syntax Checker   │
   └───────────────────────────┘
                 │
                 ▼
 [ Monaco Output / JSZip Repacker ]
```

---

## License
MIT
