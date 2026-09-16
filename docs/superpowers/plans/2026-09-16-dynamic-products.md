# Dynamic Products Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing hard-coded Products catalog into an Admin-managed dynamic catalog while preserving the current public UI.

**Architecture:** Add a JSON-backed server product store and REST API protected by the existing admin session for mutations. Add a shared frontend API/type module, replace hard-coded public arrays with fetched records, and replace the Products Admin placeholder with CRUD UI and image upload.

**Tech Stack:** React 18, TypeScript, Vite, Node HTTP server, filesystem JSON persistence, existing admin auth.

**Spec:** `docs/superpowers/specs/2026-09-16-dynamic-products-design.md`

## Global Constraints
- Preserve the current public Products and Product Details visual design.
- Do not require PostgreSQL for product management.
- Do not add runtime dependencies.
- Preserve existing admin authentication and customer authentication behavior.
- Seed dynamic storage with the current static catalog.

---

### Task 1: Product store and seed

**Files:**
- Create: `server/products.ts`
- Create: `server/products.test.ts`
- Create: `server/data/products.json`

**Interfaces:**
- Produces: `ProductRecord`, `ProductInput`, `listProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`.

- [ ] Write tests covering list, create, duplicate-id rejection, update, delete, and validation.
- [ ] Run the product-store test and verify RED.
- [ ] Implement the minimal JSON-backed product store.
- [ ] Run the test and verify GREEN.
- [ ] Seed `server/data/products.json` with the current catalog and detail data.

### Task 2: Product API and uploads

**Files:**
- Modify: `server/index.ts`

**Interfaces:**
- Consumes: product store functions from Task 1.
- Produces: public GET endpoints, authenticated Admin CRUD endpoints, authenticated image upload endpoint.

- [ ] Add public list/detail routes.
- [ ] Add admin-authenticated list/create/update/delete routes.
- [ ] Add safe image upload handling to `public/uploads/products`.
- [ ] Type-check server code.

### Task 3: Frontend product API and public catalog

**Files:**
- Create: `src/productsApi.ts`
- Modify: `src/Products.tsx`
- Modify: `src/ProductDetails.tsx`

**Interfaces:**
- Produces: `ProductRecord` frontend type, `productsApi.list()`, `productsApi.get(id)`.

- [ ] Create typed frontend API client.
- [ ] Replace Products hard-coded source with API loading while retaining filter/search UI.
- [ ] Replace Product Details hard-coded source with API loading and API-backed related products.
- [ ] Add loading/error/empty handling using existing visual language.
- [ ] Type-check frontend.

### Task 4: Admin Products CRUD

**Files:**
- Modify: `src/adminApi.ts`
- Modify: `src/AdminApp.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: Admin product CRUD/upload endpoints.
- Produces: full Products Management UI.

- [ ] Extend `adminApi` with product CRUD and image upload methods.
- [ ] Add Products Manager list/search/category/visibility controls.
- [ ] Add create/edit form with all public/detail fields and repeatable list inputs.
- [ ] Add image URL and local file upload support.
- [ ] Add delete confirmation and refresh behavior.
- [ ] Add responsive Admin product styles.

### Task 5: Verification and package

**Files:**
- Modify as required only for fixes found by verification.
- Create final ZIP in `/mnt/data`.

- [ ] Run `npm install` if needed.
- [ ] Run `npm run test:products`.
- [ ] Run `npm run build`.
- [ ] Inspect ZIP contents and exclude `node_modules`, build artifacts, and `.git`.
- [ ] Package the complete updated project.
