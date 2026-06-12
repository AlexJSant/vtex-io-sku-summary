# Development Log - SKU Summary

This document records the customizations, fixes, and improvements implemented in the `{appVendor}.sku-summary` app during development.

---

## 📅 Date: 09/06/2026

### 🎯 Session Objectives
- Transform a `vtex.product-summary` fork into a lean custom VTEX IO app that lists **SKUs as individual shelf cards**
- Accept a `productId` prop and render one card per SKU while preserving the original product-summary visual pattern
- Remove all non-essential code to keep the app performant and maintainable
- Fix build/runtime issues encountered during `vtex link` with the store theme
- Ensure each card links directly to the PDP with the correct `skuId` query parameter

---

## 📋 Development Summary

The app was built around a single architectural pattern:

```
productId → GraphQL (productsByIdentifier) → product.items[]
  → expandSkusToProductCards() → SkuSummaryListWithoutQuery
  → sku-summary.shelf + child blocks (image, name, price, buy button, etc.)
```

**Key outcome:** A product with N SKUs renders N independent cards, each behaving like a native product-summary shelf item but locked to a single SKU.

**App identity:** `{appVendor}.sku-summary` v0.1.0

**Main block:** `sku-summary-list` (theme usage: `{appVendor}.sku-summary-list`)

---

## ✅ Implemented Changes (09/06/2026)

### 1. App Scaffolding and Core Component

**Goal:** Create the MVP that fetches a product by ID and expands its SKUs into virtual product cards.

**Files created:**

| File | Purpose |
|------|---------|
| `react/SkuSummaryList.tsx` | Main list component — GraphQL fetch, SKU expansion, list rendering |
| `react/SkuSummaryListWithoutQuery.tsx` | Static list renderer (no product search query) |
| `react/utils/expandSkusToProducts.ts` | Maps each SKU to a virtual product with `items: [sku]` and unique `cacheId` |
| `react/types.ts` | Shared `ProductClickParams` type |
| `react/queries/productById.gql` | GraphQL query via `vtex.search-graphql` |

**Props exposed (Site Editor):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `productId` | `string` | — | Catalog product ID |
| `listName` | `string` | `"SKU list"` | Optional analytics list name |
| `itemsFilter` | `ALL` \| `FIRST_AVAILABLE` \| `ALL_AVAILABLE` | `ALL_AVAILABLE` | SKU filter for GraphQL |
| `maxItems` | `number` | — | Optional cap on displayed SKU cards |

**Performance choices:**
- Single GraphQL request per list (`productsByIdentifier`)
- `useMemo` for SKU → card expansion
- `fetchPolicy: 'cache-first'` on Apollo query
- `ssr: false` on query to avoid SSR/client mismatch
- Default `itemsFilter: ALL_AVAILABLE` to avoid loading unavailable SKUs

**Status:** ✅ Implemented

---

### 2. Manifest, Store Interfaces, and Block Composition

**Goal:** Register the app as a standalone VTEX IO app with its own block namespace.

**Files modified:**

| File | Change |
|------|--------|
| `manifest.json` | Vendor `{appVendor}`, name `sku-summary`, v0.1.0; lean dependency set |
| `store/interfaces.json` | `sku-summary-list`, `sku-summary`, `sku-summary.shelf`, and child blocks |
| `store/blocks.json` | Default shelf composition (image, name, attachments, price, buy button) |
| `store/contentSchemas.json` | Site Editor schema for `SkuSummaryList` and shelf blocks |
| `react/messages.ts` + `messages/en.json`, `messages/pt-BR.json`, `messages/context.json` | i18n keys for Site Editor (see section 11) |

**Block namespace:** All shelf blocks use the `sku-summary-*` prefix (e.g. `sku-summary-image`, `sku-summary-name`) to avoid interface conflicts with `vtex.product-summary` in the theme.

**Example theme usage:**

```json
{
  "{appVendor}.sku-summary-list#example": {
    "props": {
      "productId": "123",
      "itemsFilter": "ALL_AVAILABLE",
      "maxItems": 4
    },
    "blocks": ["sku-summary.shelf"]
  },
  "sku-summary.shelf#example": {
    "children": [
      "sku-summary-image",
      "sku-summary-name",
      "sku-summary-price",
      "sku-summary-buy-button"
    ]
  }
}
```

**Status:** ✅ Implemented

---

### 3. Codebase Cleanup (Fork → Lean App)

**Goal:** Remove everything not required for SKU listing functionality.

**Removed:**

| Category | Items |
|----------|-------|
| Product listing | `ProductSummaryList.tsx`, `list-context.product-list`, `list-context.product-list-static` |
| Legacy | `ProductSummaryLegacy`, `react/legacy/` |
| Unused blocks | SKU selector, specification badges, add-to-list, brand, description |
| Tests/mocks | `__tests__/`, `__mocks__/` |
| Docs | `CHANGELOG.md`, per-component docs, `crowdin.yml` |
| Locales | 14 unused language files (kept: `en`, `pt-BR`, `context.json`) |
| Dependencies | `vtex.search-page-context`, `vtex.structured-data`, `vtex.product-specification-badges` |
| Utilities | `compose.ts` (unreferenced) |

**Renamed/refactored:** Core shelf components prefixed with `SkuSummary*` (e.g. `SkuSummaryCustom`, `SkuSummaryImage`, `SkuSummaryName`).

**Status:** ✅ Implemented

---

### 4. GraphQL Builder Error Fix

**Problem:** `vtex link` failed with:
```
You must provide a GraphQL Schema in graphql/schema.graphql
```

**Cause:** The `graphql` builder was declared in `manifest.json`, but the app does not expose its own GraphQL API — it only **consumes** `vtex.search-graphql`.

**Solution:**
- Removed `graphql` builder from `manifest.json`
- Moved query from `graphql/productById.graphql` to `react/queries/productById.gql`
- Updated import in `SkuSummaryList.tsx`

**Status:** ✅ Resolved

---

### 5. Store Interface and TypeScript Build Errors

**Problems encountered during `vtex link`:**

1. `I couldn't find an interface "product-summary"`
2. `Property 'ProductSummary' is missing` in `SkuSummaryListWithoutQuery`
3. `Cannot find type definition file for 'node'`

**Solutions:**

| Issue | Fix |
|-------|-----|
| Missing `product-summary` interface | Migrated to dedicated `sku-summary` namespace; `sku-summary-list` allows `sku-summary` child blocks |
| Required `ProductSummary` prop | Made `ProductSummary` optional in `SkuSummaryListWithoutQuery` — runtime injects via blocks or `ExtensionPoint` fallback |
| Missing `@types/node` | Added `@types/node@12.12.0` to `react/package.json` (required transitively by `ts-invariant` via `react-apollo`) |
| Stale `jest` types in tsconfig | Removed `jest` from `react/tsconfig.json` types array |

> **Note:** A separate `builder-hub` error occurred when the fork still exported `product-summary.*` interfaces while the theme also depended on `vtex.product-summary` — see section 10.

**Status:** ✅ Resolved

---

### 6. Runtime Error — `condition-layout` / `productClusters`

**Problem:** Each card rendered `Error rendering extension point` with:
```
TypeError: Cannot read properties of undefined (reading 'find')
    at productClusters ({appVendor}.condition-layout)
```

**Cause:** The GraphQL query returned a minimal product payload. Virtual SKU cards spread the parent product but lacked fields expected by theme blocks (`productClusters`, `clusterHighlights`, etc.).

**Solution:**

1. **Enriched `react/queries/productById.gql`** with:
   - `productClusters`, `clusterHighlights`, `categories`
   - `priceRange`, `specificationGroups`, `skuSpecifications`, `releaseDate`

2. **Defensive defaults in `expandSkusToProducts.ts`:**
   ```ts
   productClusters: product.productClusters ?? [],
   clusterHighlights: product.clusterHighlights ?? [],
   categories: product.categories ?? [],
   // ...
   ```

**Status:** ✅ Resolved — cards render correctly with `{appVendor}.condition-layout` in the theme

---

### 7. SKU-Specific PDP Links on Cards

**Problem:** Card links pointed to the parent product PDP without pre-selecting the SKU.

**Expected URL format:**
```
/{linkText}/p?skuId={itemId}
```
Example:
```
https://dev1--{appVendor}.myvtex.com/rack-abra-ripado-cor-nature-3-gavetas-222cm---76907/p?skuId=76907
```

**Root cause:** `SkuSummaryCustom` used the `query` string from `product-summary-context`, built from `selectedProperties` (absent on virtual SKU cards). The `skuId` was passed to `ProductContextProvider` but not to the `<Link>` component.

**Iterations:**

| Attempt | Result |
|---------|--------|
| `query: { skuId }` (object) | URL became `?[object%20Object]` — VTEX `Link` expects a **string** |
| `query: \`skuId=${skuId}\`` (string) | ✅ Correct URL generated |

**File modified:** `react/SkuSummaryCustom.tsx`

```tsx
const linkQuery = skuId ? `skuId=${skuId}` : query
// ...
query: linkQuery,
```

**Status:** ✅ Implemented

---

### 8. `maxItems` Prop — Shelf Item Limit

**Goal:** Allow themes to cap how many SKU cards appear on a shelf/vitrine, regardless of how many SKUs the target product has in the catalog.

**Motivation:** Unlike `list-context.product-list` (one card per product), this app expands every SKU into its own card. A product with 12 SKUs would render 12 cards unless limited. The theme needed the same `maxItems` ergonomics as native product lists.

**Files modified:**

| File | Change |
|------|--------|
| `react/SkuSummaryList.tsx` | Added `maxItems` prop; applies `slice(0, maxItems)` after `expandSkusToProductCards()` |
| `store/contentSchemas.json` | Site Editor schema for `maxItems` (`number`, `minimum: 1`) |
| `react/messages.ts` + `messages/en.json`, `messages/pt-BR.json`, `messages/context.json` | i18n keys for Site Editor labels (see section 11) |

**Behavior:**
- `maxItems` omitted or invalid → all expanded SKU cards are shown (unchanged default)
- `maxItems: 4` → at most 4 cards, taken in catalog order after `itemsFilter` is applied
- Limit applies to **SKU cards**, not products

**Example (showcase with layout children):**

```json
{
  "{appVendor}.sku-summary-list#ambient-showcase_shelf": {
    "props": {
      "productId": "123",
      "itemsFilter": "ALL_AVAILABLE",
      "maxItems": 4
    },
    "blocks": ["sku-summary.shelf#main-product-new"],
    "children": ["responsive-layout.desktop#ambient-showcase_shelf"]
  }
}
```

**Status:** ✅ Implemented

---

### 9. `sku-summary-name` — Independent Field Visibility

**Problem:** With `showBrandName: false` and `showSku: true`, the shelf still rendered the product title before the SKU name (e.g. `Rack Abra Ripado` + `Rack Abra Ripado Cor Nature 3 Gavetas 222cm`).

**Cause:** `SkuSummaryName` delegated rendering to `ProductName` from `vtex.store-components`. That component **always** renders `productName` in the first `<span>`; `showBrandName` only appends the brand as a suffix (`Product - Brand`) in the same span. There was no way to hide the product title or combine fields independently.

**Solution:** Custom rendering in `react/SkuSummaryName.tsx` (Option B). Each field is a separate `<span>`, controlled by explicit flags in `showFieldsProps`:

| Prop | Controls |
|------|----------|
| `showProductName` | Product title (`product.productName`) |
| `showBrandName` | Brand (`product.brand`) |
| `showSku` | SKU name (`product.sku.name`) |
| `showProductReference` | Reference (`REF: {productReference}`) |

**Behavior:**
- All flags `false` (or no visible data) → block returns `null`
- Any combination of `true` flags is supported (16 boolean combinations)
- Sponsored badge still renders when applicable, independent of name fields
- Site Editor schema is empty — configuration is code/`blocks.json` only

**CSS handles (name block):** `nameContainer`, `nameWrapper`, `productName`, `brandName`, `skuName`, `productReference`, `sponsoredBadge`

**Example — SKU name only (typical shelf use case):**

```json
"sku-summary-name": {
  "props": {
    "showFieldsProps": {
      "showProductName": false,
      "showBrandName": false,
      "showSku": true,
      "showProductReference": false
    }
  }
}
```

**Status:** ✅ Implemented

---

### 10. Store Theme — Interface Name Collision (`product-summary.shelf`)

**Problem:** `vtex link` on the store theme failed with an ambiguity error from `vtex.builder-hub`:

```
You're trying to reference a product-summary.shelf interface, but two or more dependencies declare names that match that and I don't know which one you want. Please specify the app name by writing one of these:
{appVendor}.sku-summary:product-summary.shelf
vtex.product-summary:product-summary.shelf
```

**Cause:** The fork still exported store interfaces with the same names as `vtex.product-summary` (`product-summary`, `product-summary.shelf`, `product-summary-image`, etc.). When the theme depended on both apps, any unqualified reference to `product-summary.shelf` — including in this app's `store/blocks.json` — could not be resolved. Prefixing with `{appVendor}.sku-summary:` would work per reference, but would force the theme to qualify every block and still leave native `product-summary.*` shelves ambiguous.

**Goal:** Keep `{appVendor}.sku-summary` standalone so existing theme blocks that use `vtex.product-summary` remain unchanged.

**Solution:** Renamed all exported interfaces to a dedicated `sku-summary-*` namespace.

| File | Change |
|------|--------|
| `store/interfaces.json` | `product-summary` → `sku-summary`; `product-summary.shelf` → `sku-summary.shelf`; child blocks → `sku-summary-image`, `sku-summary-name`, etc.; `sku-summary-list` `allowed` → `["sku-summary"]` |
| `store/blocks.json` | Default composition updated to `sku-summary.*` block names |
| `react/ProductSummaryListWithoutQuery.tsx` | `ExtensionPoint` `id` changed from `product-summary` to `sku-summary` |

**Theme impact:** Only blocks that compose `{appVendor}.sku-summary-list` need `sku-summary.*` names. Shelves, search, and other areas that use `product-summary.shelf` continue resolving to `vtex.product-summary` without changes.

**Status:** ✅ Resolved

---

### 11. i18n — Static Message Extraction and Fork Key Trim

**Problem:** `vtex link` emitted React builder warnings:

- `React builder could not extract messages` — ~90 keys declared only as string literals in schemas and helpers; builder could not parse them statically, risking slower storefront pages
- `Missing the following keys in "en"` — `admin/editor.productSummaryName.sponsoredBadge.title` present only in `pt-BR`

**Cause:** The fork inherited a large `messages/*.json` set from `vtex.product-summary` (including unused `productSummaryList.*`, `sponsoredBadge.*`, etc.). Schemas and runtime calls referenced message IDs as plain strings instead of `defineMessages` from `react-intl`.

**Solution:**

| File | Change |
|------|--------|
| `react/messages.ts` | Central `defineMessages` for all store and Site Editor keys still in use |
| `react/SkuSummary*.tsx`, `react/utils/displayButtonTypes.ts`, attachment list components, `SponsoredBadge.tsx` | Schemas, `formatMessage`, and `FormattedMessage` now reference `adminMessages.*.id` / `storeMessages.*.id` |
| `messages/en.json`, `messages/pt-BR.json`, `messages/context.json` | Trimmed to ~58 keys referenced by current schemas; added `admin/editor.productSummary.displayMode.title`; synced `en` / `pt-BR` |
| `react/components/SponsoredBadge.tsx` | Default label fixed from non-existent `store/sponsoredBadge.title` to `store/sponsored-badge.label` |

**Outcome:** Build completes without i18n warnings; message set matches the lean app scope.

**Status:** ✅ Resolved

---

## 📝 Technical Notes

### Virtual SKU Card Pattern

Each SKU is expanded into a product-shaped object:

```ts
{
  ...parentProduct,
  items: [singleSku],
  cacheId: `${productId}-${itemId}`,
  productClusters: product.productClusters ?? [],
  // other defensive defaults
}
```

Then normalized via `mapCatalogProductToProductSummary(product, 'FIRST_AVAILABLE')`, which sets `product.sku` to the single item.

### GraphQL Query

- Provider: `vtex.search-graphql`
- Operation: `productsByIdentifier(field: id, values: [$productId])`
- Items filter: controlled by `itemsFilter` prop (`ALL_AVAILABLE` by default)

### List Rendering

- Uses `vtex.list-context` + `vtex.product-list-context` for shelf layout and analytics
- `ExtensionPoint` fallback targets `sku-summary` block when no `ProductSummary` component is injected
- `ProductListEventCaller` fires impression events on view

### VTEX Link Component

- `query` prop must be a **query string** (e.g. `"skuId=76907"`), not a plain object
- `page: 'store.product'` + `params.slug` (linkText) builds the PDP path

### Intentionally Omitted

- `sku-summary-sku-selector` — each card represents a single SKU; selector is redundant
- `priceBehavior: async` by default — avoids N simultaneous price simulations on large SKU lists

### Block Namespace

All exported interfaces use the `sku-summary-*` prefix to coexist with `vtex.product-summary` in the same theme. This avoids both the indirect-dependency error ("interface not found") and the `builder-hub` ambiguity error when two apps declare the same interface name (e.g. `product-summary.shelf`). See section 10.

### i18n / Site Editor Messages

- Runtime and schema message IDs live in `react/messages.ts` via `defineMessages` (required for VTEX React builder static extraction)
- Translations: `messages/en.json`, `messages/pt-BR.json`; developer context: `messages/context.json`
- When adding a new Site Editor label, declare the key in `react/messages.ts` and add entries to all three JSON files

---

## 🐛 Bugs Fixed

| # | Bug | Cause | Fix | Status |
|---|-----|-------|-----|--------|
| 1 | GraphQL schema required on build | `graphql` builder without `schema.graphql` | Removed builder; query lives in `react/queries/` | ✅ |
| 2 | Interface `product-summary` not found | VTEX indirect dependency rule | Dedicated `sku-summary` block namespace | ✅ |
| 3 | `ProductSummary` prop required | Strict TypeScript interface | Made prop optional | ✅ |
| 4 | `@types/node` not found | Transitive dep from `react-apollo` | Added `@types/node@12.12.0` | ✅ |
| 5 | Extension point crash on every card | `productClusters` undefined | Enriched GraphQL + defensive defaults | ✅ |
| 6 | Card link without SKU | `query` from context ignored `skuId` | Pass `skuId=${skuId}` string to `Link` | ✅ |
| 7 | URL `?[object Object]` | `query` passed as object | Changed to template string | ✅ |
| 8 | Product title always shown on shelf name | `ProductName` always renders `productName` in first span | Custom rendering with `showProductName` / `showFieldsProps` | ✅ |
| 9 | Ambiguous `product-summary.shelf` on theme link | Fork and `vtex.product-summary` both exported identical interface names | Renamed all interfaces to `sku-summary-*`; `ExtensionPoint` → `sku-summary` | ✅ |
| 10 | React builder i18n warnings on link | Fork message keys + string literals in schemas | `react/messages.ts` with `defineMessages`; trimmed `messages/*.json` | ✅ |

---

## 📅 Date: 12/06/2026

### Manual SKU selection (`skus` array)

**Goal:** Allow merchants to pick SKUs one by one in the Site Editor (array UI like `list-context.image-list`), overriding automatic listing by `productId`.

**Behavior:**

| Mode | Trigger | `productId` | `itemsFilter` | `maxItems` |
|------|---------|-------------|---------------|------------|
| Manual | `skus` has ≥1 valid `skuId` | Ignored | Ignored | Ignored |
| Automatic | `skus` empty + `productId` set | Used | Used | Used |

**Multiple SKUs from the same product:** `expandManualSkusToProductCards()` builds an `itemId → product` lookup from the batch GraphQL response, then walks the editor array in order — each `skuId` produces its own card even when the API returns a single product entry.

**Files changed:**

| File | Change |
|------|--------|
| `store/contentSchemas.json` | `ManualSkus` array definition + `skus` on `SkuSummaryList` |
| `react/queries/productsBySkuIds.gql` | `productsByIdentifier(field: sku, values: $skuIds)` |
| `react/utils/expandSkusToProducts.ts` | `expandManualSkusToProductCards()` + shared `buildVirtualProductCard` |
| `react/SkuSummaryList.tsx` | Dual-mode fetch and schema |
| `store/interfaces.json` | Direct `$ref` to `ManualSkus` in `content.properties` (Site Editor runtime binding) |
| `react/messages.ts` + `messages/*.json` | Site Editor labels (pt-BR / en) |

**Status:** ✅ Implemented — QA in progress (see checklist below)

**Fix (12/06/2026):** Manual SKU list returned empty in Site Editor while GraphQL (`field: sku`) returned data. Cause: `interfaces.json` used a single `$ref` to `SkuSummaryList`, so the nested `skus` array was not bound to runtime props (same pattern as `list-context.image-list` → direct `$ref` to `ManualSkus` in `content.properties`). Also aligned `expandManualSkusToProductCards` to return raw catalog virtual products for single normalization in `SkuSummaryListWithoutQuery`.

---

### Site Editor — `listName` label (optional)

**Goal:** Clarify in the Site Editor that `listName` is optional and used only for analytics.

**Site Editor labels:**

| Locale | Label |
|--------|-------|
| `pt-BR` | Nome da lista (analytics) - opcional |
| `en` | List name (analytics) - optional |

**Files changed:** `messages/en.json`, `messages/pt-BR.json`

**Locales in this app:** `en`, `pt-BR`, plus developer context `messages/context.json` (not a storefront locale). See section 3.

**Status:** ✅ Implemented

---

### ✅ QA checklist — manual SKU selection

Use this list after `vtex link` on a workspace with the store theme.

#### Site Editor

- [x] Block **Lista de SKUs** shows the **SKUs** section with **+ ADICIONAR** button
- [x] Each card exposes **ID do SKU** and optional **Rótulo do card**
- [x] **ID do produto** description states it is ignored when manual SKUs exist
- [x] **Filtro de SKUs** / **Quantidade máxima** descriptions state they apply only with Product ID
- [ ] **Nome da lista (analytics) - opcional** appears for `listName`; leaving it empty uses default `"SKU list"`
- [x] Saving and reopening the block preserves SKU order and values

#### Modo automático (regressão)

- [x] `productId` only (no manual SKUs) — shelf renders as before
- [x] `itemsFilter: ALL_AVAILABLE` hides unavailable SKUs
- [x] `maxItems: 4` caps cards when product has more SKUs
- [x] Empty `productId` and empty `skus` — block does not render (no error)

#### Modo manual

- [ ] 1 SKU — one card with correct image, name, price, buy button
- [x] 2+ SKUs from **different products** — one card per SKU, correct PDP link each (`?skuId=`)
- [x] 2+ SKUs from the **same product** — one card per SKU (not deduplicated)
- [x] Manual order in editor matches shelf left-to-right order
- [ ] Invalid / empty `skuId` entry — skipped without breaking other cards
- [x] `productId` + manual `skus` both filled — manual list wins; product SKUs not shown
- [x] With manual SKUs set, changing `maxItems` or `itemsFilter` has **no effect**

#### Storefront / integração

- [ ] Cards work with theme `condition-layout` (no extension point crash)
- [ ] Analytics list name still fires on impression/click
- [ ] Up to ~10 manual SKUs — acceptable load time on target page

---

## 🔄 Pending / TODO

- [ ] **QA manual SKU selection** — remaining items in checklist above (`listName` label, invalid `skuId`, storefront/integration)
- [ ] **Publish app** — `vtex publish` after full QA sign-off on `dev1`
- [x] **Theme dependency** — `sunhouse.sku-summary` declared in theme `manifest.json` across environments
- [ ] **Large SKU lists (30+)** — `maxItems` covers simple shelf caps; evaluate pagination or virtualization if full lists are needed
- [ ] **Price simulation** — if theme enables `priceBehavior: async` on shelf, monitor N parallel simulation requests
- [ ] **Analytics validation** — confirm product impression/click events report SKU-level data correctly
- [ ] **Merge `property__*` query params** — if PDP deep-linking via variation properties is needed alongside `skuId`, combine both in `linkQuery`
- [ ] **Loading/empty states** — currently returns `null` on loading/error/empty; consider skeleton or fallback UI
- [ ] **Automated tests** — no test suite after cleanup; add unit tests for `expandSkusToProductCards` and link query building

---

## 📊 Development Report (Brief)

| Metric | Value |
|--------|-------|
| Starting point | Full `vtex.product-summary` fork (~142 files) |
| Final scope | Lean SKU-listing app with dedicated block namespace |
| New core files | `SkuSummaryList`, `expandSkusToProducts`, `productById.gql` |
| GraphQL requests | 1 per list (vs. N requests for N products) |
| Build blockers fixed | 5 (graphql builder, interface not found, interface collision, types, node types) |
| Runtime blockers fixed | 3 (condition-layout crash, SKU link, name field visibility) |
| Link format | `/{linkText}/p?skuId={itemId}` |
| Visual parity | Preserved via `sku-summary.shelf` child blocks |
| QA status | ✅ Manual + automatic modes validated on `dev1--sunhouse.myvtex.com` (storefront/integration pending) |

---

## 📚 References

- [VTEX product-summary](https://github.com/vtex-apps/product-summary)
- [VTEX product-summary-context](https://github.com/vtex-apps/product-summary-context)
- [VTEX search-graphql — `productsByIdentifier`](https://developers.vtex.com/docs/apps/vtex.search-graphql)
- [VTEX IO — Declaring blocks from indirect dependencies](https://vtex.io/docs/releases/2019-12-12/declaring-blocks-stemming-from-indirect-dependencies)
- [VTEX IO Messages builder](https://developers.vtex.com/docs/guides/vtex-io-documentation-messages-builder)
- Internal design doc: custom SKU listing feasibility analysis (chat export `cursor_chat_custom_app_for_sku_listing_in_vt.json`)
