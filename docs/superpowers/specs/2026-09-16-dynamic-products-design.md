# Dynamic Products Design

## Goal
Make the existing Products catalog fully manageable from the current Admin panel without changing the public visual design.

## Scope
- Preserve the current Products and Product Details layouts.
- Manage Education, Travel, Technology, and Media products from Admin.
- Support create, edit, delete, search, visibility, ordering, multiple images, feature bullets, detail rows, recommendation lists, requirement lists, badge, pricing label, CTA labels/links, and descriptive detail sections.
- Public Products and Product Details pages read from the API instead of hard-coded arrays.
- Seed the dynamic store with the current static products so the site looks the same after the update.

## Architecture
Use the existing Node/TypeScript API. Product content is stored in `server/data/products.json` via a focused `productStore.ts` module, avoiding PostgreSQL configuration for this CMS phase. Public read endpoints are unauthenticated; create/update/delete/upload endpoints require the existing admin session.

Images can be supplied as URLs or uploaded in Admin. The browser converts an uploaded image to a data URL; the API decodes it into `public/uploads/products/` and returns a public path. Product records store only the resulting path/URL.

## API
- `GET /api/products` returns visible products ordered by `sortOrder`.
- `GET /api/products/:id` returns one visible product.
- `GET /api/admin/products` returns all products including hidden products.
- `POST /api/admin/products` creates a product.
- `PUT /api/admin/products/:id` updates a product.
- `DELETE /api/admin/products/:id` deletes a product.
- `POST /api/admin/uploads/product-image` accepts `{ fileName, dataUrl }` and returns `{ url }`.

## Validation
Products require a unique slug-style id, valid category, title, subtitle, description, at least one image, and non-empty CTA label. Arrays are normalized and blank list entries removed.

## Compatibility
No new runtime dependency is required. Admin authentication remains the simplified configured-admin flow. Customer authentication and PostgreSQL behavior remain untouched.

## Verification
- Unit-test file-store CRUD and validation.
- TypeScript build for frontend and server.
- Confirm static seed is served, Admin compiles, and public pages consume the new API types.
