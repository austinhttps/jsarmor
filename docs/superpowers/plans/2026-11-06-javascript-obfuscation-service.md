# JavaScript Obfuscation Web Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-trust, in-browser JavaScript obfuscation web application with dual Monaco editors, preset & fine-grained controls, Web Worker offloading, diagnostics, anti-tamper utilities, and batch ZIP archive processing.

**Architecture:** A client-side React 19 application built with Vite and Tailwind CSS. The obfuscation pipeline and AST analysis run in a dedicated Web Worker via `javascript-obfuscator` with cancellation tokens. Multi-file archive processing unpacks and repacks projects client-side using `jszip`.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, `@monaco-editor/react`, `javascript-obfuscator`, `jszip`, `file-saver`, `lucide-react`, Vitest.

**Spec:** [`docs/superpowers/specs/2026-11-06-javascript-obfuscation-service-design.md`](../specs/2026-11-06-javascript-obfuscation-service-design.md)

## Global Constraints
- Target platform: Modern Evergreen Browsers (Chrome, Firefox, Safari, Edge).
- 100% client-side: Zero external server API calls for code transformation or file storage.
- Syntax safety: Must preserve valid JavaScript semantics across standard ES6+ syntax.
- Thread safety: Heavy AST processing must run inside a Web Worker to avoid freezing the main UI thread.

## Review Focus
1. **Large code payload freezing the worker:** Must implement a cancel mechanism and graceful error handling if execution exceeds worker limits.
2. **Invalid JavaScript input syntax:** Worker must capture and cleanly report AST parse errors without crashing the worker or editor state.
3. **Non-JS assets in batch ZIP uploads:** Archive pipeline must preserve images, HTML, CSS, JSON, and directories completely untouched, transforming only `.js`, `.mjs`, and `.cjs` files.
4. **Domain lock syntax errors:** Domain lock validator must reject malformed hostnames before injecting into obfuscation options.
5. **URL state corruption:** Large or malformed URL hashes must gracefully fallback to default sample code without breaking page hydration.

---

### Task 1: Project Scaffolding & Test Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`
- Create: `vitest.config.ts`
- Test: `src/tests/setup.test.ts`

**Interfaces:**
- Consumes: Node.js & npm environment
- Produces: Runnable development server (`npm run dev`) and test runner (`npm run test`)

- [ ] **Step 1: Initialize Vite React TypeScript project with Tailwind CSS & Vitest**
  Configure Vite, React 19, TypeScript, Tailwind CSS, Lucide icons, `javascript-obfuscator`, `@monaco-editor/react`, `jszip`, and `file-saver`.
- [ ] **Step 2: Write basic sanity test in `src/tests/setup.test.ts`**
  Verify Vitest runs and asserts successfully.
- [ ] **Step 3: Run test to verify it passes**
  Run: `npm test`
  Expected: PASS
- [ ] **Step 4: Verify build works**
  Run: `npm run build`
  Expected: Clean build without TypeScript or bundling errors.

---

### Task 2: Obfuscation Configuration & Preset System

**Files:**
- Create: `src/types/obfuscator.ts`
- Create: `src/config/presets.ts`
- Create: `src/config/sampleCodes.ts`
- Test: `src/tests/presets.test.ts`

**Interfaces:**
- Consumes: `javascript-obfuscator` option types
- Produces: `PresetType`, `ObfuscatorConfig`, `PRESETS` mapping, `SAMPLE_CODES`

- [ ] **Step 1: Define TypeScript interfaces in `src/types/obfuscator.ts`**
  Define `PresetTier` ('light' | 'balanced' | 'stealth'), `ObfuscationResult`, `MetricsData`, and `SecurityOptions` (domainLock, selfDefending, debugProtection).
- [ ] **Step 2: Write failing test in `src/tests/presets.test.ts`**
  Verify preset builders produce valid options matching the spec tiers (e.g. `stealth` sets `controlFlowFlattening: true`, `deadCodeInjection: true`).
- [ ] **Step 3: Implement `src/config/presets.ts` & `src/config/sampleCodes.ts`**
  Implement light, balanced, and stealth preset configs and high-quality sample snippets.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npm test src/tests/presets.test.ts`
  Expected: PASS

---

### Task 3: Obfuscator Web Worker & Task Bridge

**Files:**
- Create: `src/workers/obfuscator.worker.ts`
- Create: `src/workers/workerBridge.ts`
- Test: `src/tests/workerBridge.test.ts`

**Interfaces:**
- Consumes: `src/types/obfuscator.ts`, `javascript-obfuscator`
- Produces: `obfuscateCode(code: string, options: ObfuscatorConfig): Promise<ObfuscationResult>` with cancel/abort capability.

- [ ] **Step 1: Write failing test for worker bridge logic and message parsing in `src/tests/workerBridge.test.ts`**
  Test validation of input code, error catching on invalid syntax, and metrics calculation.
- [ ] **Step 2: Implement `src/workers/obfuscator.worker.ts`**
  Listen for `postMessage`, execute `JavaScriptObfuscator.obfuscate()`, compute duration and byte metrics, and reply with success or error payload.
- [ ] **Step 3: Implement `src/workers/workerBridge.ts`**
  Provide promise wrapper with timeout handling and worker termination logic.
- [ ] **Step 4: Run test to verify it passes**
  Run: `npm test src/tests/workerBridge.test.ts`
  Expected: PASS

---

### Task 4: Diagnostics, Metrics & Security Formatters

**Files:**
- Create: `src/utils/metrics.ts`
- Create: `src/utils/security.ts`
- Test: `src/tests/metrics.test.ts`
- Test: `src/tests/security.test.ts`

**Interfaces:**
- Consumes: Code strings and options
- Produces: `calculateMetrics(original: string, obfuscated: string, durationMs: number): MetricsData` and `buildSecurityOptions(config: SecurityOptions): Partial<ObfuscatorOptions>`

- [ ] **Step 1: Write tests for metric calculations (size delta, compression/expansion ratio, formatting) in `src/tests/metrics.test.ts`**
- [ ] **Step 2: Implement `src/utils/metrics.ts`**
- [ ] **Step 3: Write tests for domain lock sanitization and anti-tamper option synthesis in `src/tests/security.test.ts`**
- [ ] **Step 4: Implement `src/utils/security.ts`**
- [ ] **Step 5: Run tests to verify they pass**
  Run: `npm test src/tests/metrics.test.ts src/tests/security.test.ts`
  Expected: PASS

---

### Task 5: Interactive Monaco Editor Playground UI

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/EditorPlayground.tsx`
- Create: `src/components/MetricsBar.tsx`
- Create: `src/components/PresetSelector.tsx`
- Create: `src/components/AdvancedOptionsDrawer.tsx`
- Modify: `src/App.tsx`
- Test: `src/tests/EditorPlayground.test.tsx`

**Interfaces:**
- Consumes: `workerBridge.ts`, `presets.ts`, `metrics.ts`
- Produces: Full interactive dual-editor UI with live code editing, preset switching, manual/auto obfuscation, diff viewer toggle, and metric status.

- [ ] **Step 1: Write UI unit test verifying preset selection and action triggers in `src/tests/EditorPlayground.test.tsx`**
- [ ] **Step 2: Implement `Header.tsx`, `PresetSelector.tsx`, and `MetricsBar.tsx`**
- [ ] **Step 3: Implement `EditorPlayground.tsx` with Monaco dual-editor and Diff Editor support**
- [ ] **Step 4: Implement `AdvancedOptionsDrawer.tsx` for granular toggle controls**
- [ ] **Step 5: Wire components together in `src/App.tsx`**
- [ ] **Step 6: Run tests to verify they pass**
  Run: `npm test src/tests/EditorPlayground.test.tsx`
  Expected: PASS

---

### Task 6: Multi-File & ZIP Batch Processor

**Files:**
- Create: `src/utils/zipHandler.ts`
- Create: `src/components/BatchProcessor.tsx`
- Test: `src/tests/zipHandler.test.ts`

**Interfaces:**
- Consumes: `jszip`, `file-saver`, `workerBridge.ts`
- Produces: Batch processing workflow for multi-file and `.zip` archives with real-time progress and download packaging.

- [ ] **Step 1: Write failing test in `src/tests/zipHandler.test.ts` for ZIP extraction, JS file filtering, and archive reconstruction**
- [ ] **Step 2: Implement `src/utils/zipHandler.ts` with `jszip`**
- [ ] **Step 3: Implement `src/components/BatchProcessor.tsx` with drag-and-drop zone, file list table, progress bar, and download trigger**
- [ ] **Step 4: Add tab navigation in `src/App.tsx` to toggle between "Playground Mode" and "Batch / Project Mode"**
- [ ] **Step 5: Run test to verify it passes**
  Run: `npm test src/tests/zipHandler.test.ts`
  Expected: PASS

---

### Task 7: Config Export, CLI Command Generator & URL Sharing

**Files:**
- Create: `src/utils/urlState.ts`
- Create: `src/components/ConfigExportModal.tsx`
- Create: `src/components/SandboxRunnerModal.tsx`
- Test: `src/tests/urlState.test.ts`

**Interfaces:**
- Consumes: Current editor code and `ObfuscatorConfig`
- Produces: JSON config download, CLI command string copying, encoded share URL, and sandboxed test execution.

- [ ] **Step 1: Write test for URL hash compression/decompression and state restoration in `src/tests/urlState.test.ts`**
- [ ] **Step 2: Implement `src/utils/urlState.ts`**
- [ ] **Step 3: Implement `src/components/ConfigExportModal.tsx` (JSON download + CLI snippet generator)**
- [ ] **Step 4: Implement `src/components/SandboxRunnerModal.tsx` (isolated sandbox preview iframe for quick validation)**
- [ ] **Step 5: Run tests and verify end-to-end functionality**
  Run: `npm test`
  Expected: All test suites PASS

---

### Task 8: End-to-End Verification & Production Build

**Files:**
- Modify: `README.md`
- Test: `npm run build`, `npm test`

- [ ] **Step 1: Run comprehensive test suite across all modules**
  Run: `npm test`
  Expected: PASS
- [ ] **Step 2: Build production bundle and verify asset generation**
  Run: `npm run build`
  Expected: Clean build in `dist/` with valid Web Worker and Monaco chunks.
- [ ] **Step 3: Write comprehensive project documentation in `README.md`**
