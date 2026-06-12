📢 Use this project, contribute to it, or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# SKU Summary

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

SKU Summary (`sunhouse.sku-summary`) is a custom VTEX IO app that lists **SKUs as independent shelf cards**. It is based on [vtex.product-summary](https://github.com/vtex-apps/product-summary), stripped down to the essentials and extended with a flexible data layer driven by **Product ID** or a **manual SKU list** configured in the Site Editor.

Unlike `list-context.product-list`, which renders one card per **product**, this app renders one card per **SKU** — each card locked to a single variation, with its own image, price, and PDP link (`?skuId=`).

## How it works

**Automatic mode** (Product ID):

```
productId → GraphQL (productsByIdentifier, field: id) → product.items[]
  → expandSkusToProductCards() → SkuSummaryListWithoutQuery
  → sku-summary.shelf + child blocks
```

**Manual mode** (Site Editor SKU array — overrides Product ID):

```
skus[].skuId → GraphQL (productsByIdentifier, field: sku) → match items by ID
  → expandManualSkusToProductCards() → SkuSummaryListWithoutQuery
  → sku-summary.shelf + child blocks
```

| Mode | Trigger | `productId` | `itemsFilter` | `maxItems` |
|------|---------|-------------|---------------|------------|
| Manual | `skus` has ≥1 valid `skuId` | Ignored | Ignored | Ignored |
| Automatic | `skus` empty + `productId` set | Used | Used | Used |

- **One GraphQL request** per list (by product ID or batch SKU IDs).
- Each SKU is expanded into a virtual product object (`items: [sku]`) and normalized for `product-summary-context`.
- Cards reuse the same visual composition as product-summary shelves (image, name, price, buy button, etc.).
- Card links point to the PDP with the SKU pre-selected: `/{linkText}/p?skuId={itemId}`.
- Manual lists preserve **editor order** and support multiple SKUs from the same product (one card per `skuId`).

> For implementation history, build fixes, and pending work, see [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md).

---

## Configuring the SKU Summary

### 1. Add the app dependency

Import `sunhouse.sku-summary` in your theme `manifest.json`:

```json
{
  "dependencies": {
    "sunhouse.sku-summary": "0.x"
  }
}
```

### 2. Available blocks

| Block name | Description |
| ---------- | ----------- |
| `sku-summary-list` | **Mandatory** — Fetches SKUs by `productId` or a manual `skus` array, expands them into cards, and provides data to child shelf blocks via list context. |
| `sku-summary.shelf` | **Mandatory** — Logical shelf wrapper. Compose child blocks below to define card layout. Alias: `sku-summary`. |
| `sku-summary-image` | Renders the SKU image (discount badge, collection badges, hover image). |
| `sku-summary-name` | Renders product name, brand, SKU name, and/or reference — each field toggled independently via `showFieldsProps`. |
| `sku-summary-sku-name` | Legacy helper that renders only the SKU name. Prefer `sku-summary-name` with `showSku: true` unless you need a separate block. |
| `sku-summary-price` | Renders price, list price, installments, and savings. |
| `sku-summary-buy-button` | Renders the Buy button. Prefer [Add to Cart button](https://developers.vtex.com/docs/guides/vtex-add-to-cart-button) if using Minicart v2. |
| `sku-summary-attachment-list` | Renders product [attachments](https://help.vtex.com/tutorial/adding-an-attachment--7zHMUpuoQE4cAskqEUWScU). |
| `sku-summary-column` | Column layout helper for grouping child blocks. |
| `sku-summary-space` | Vertical spacer between card sections. |

**Not included (by design):** `sku-summary-sku-selector` — each card represents a single SKU; a selector inside the card is redundant.

### 3. `sku-summary-list` props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `productId` | `string` | — | Catalog product ID whose SKUs will be listed. **Ignored when `skus` has items.** |
| `skus` | `{ skuId: string }[]` | — | Manual SKU list (Site Editor **+ ADICIONAR**). When non-empty, overrides `productId`. |
| `listName` | `string` | `"SKU list"` | Optional. Name sent to analytics events (impressions, clicks, PDP attribution). |
| `itemsFilter` | `ALL` \| `FIRST_AVAILABLE` \| `ALL_AVAILABLE` | `ALL_AVAILABLE` | Controls which SKUs GraphQL returns. **Only used with `productId`.** |
| `maxItems` | `number` | — | Cap on **SKU cards** when using `productId`. **Ignored when `skus` has items.** |

**Site Editor:** The `skus` array uses the same card-array pattern as [`list-context.image-list`](https://developers.vtex.com/docs/apps/vtex.store-image). Each entry has `skuId` (catalog item ID) and an optional editor label (`__editorItemTitle`).

### 4. `sku-summary-name` props

Configure visibility per field via `showFieldsProps`. All flags default to `false`; if every flag is `false` (or no data is available for enabled flags), the block renders nothing.

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `showFieldsProps.showProductName` | `boolean` | `false` | Product title (`product.productName`). |
| `showFieldsProps.showBrandName` | `boolean` | `false` | Brand name (`product.brand`). |
| `showFieldsProps.showSku` | `boolean` | `false` | SKU name (`product.sku.name`). |
| `showFieldsProps.showProductReference` | `boolean` | `false` | Product reference (`REF: …`). |
| `tag` | `div` \| `h1` \| `h2` \| `h3` | `h3` | HTML wrapper tag for the name content. |

**Common configurations:**

```json
// SKU name only (recommended for SKU shelves)
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

// Product title + SKU name
"sku-summary-name": {
  "props": {
    "showFieldsProps": {
      "showProductName": true,
      "showBrandName": false,
      "showSku": true,
      "showProductReference": false
    }
  }
}
```

> Full prop reference and accepted values: [BLOCKS.md](./BLOCKS.md).

### 5. Basic `blocks.json` example

**Automatic mode (Product ID):**

```json
{
  "sunhouse.sku-summary-list#product-skus": {
    "props": {
      "productId": "123",
      "itemsFilter": "ALL_AVAILABLE",
      "listName": "PDP related SKUs",
      "maxItems": 4
    },
    "blocks": ["sku-summary.shelf"]
  },
```

**Manual mode (curated SKUs):**

```json
{
  "sunhouse.sku-summary-list#curated-skus": {
    "props": {
      "listName": "Featured variations",
      "skus": [
        { "skuId": "76907" },
        { "skuId": "76908" }
      ]
    },
    "blocks": ["sku-summary.shelf"]
  },
```

**Shelf composition (shared by both modes):**

```json
{
  "sku-summary.shelf#product-skus": {
    "children": [
      "sku-summary-image",
      "sku-summary-name",
      "sku-summary-space",
      "sku-summary-column#1"
    ]
  },

  "sku-summary-name#product-skus": {
    "props": {
      "showFieldsProps": {
        "showProductName": false,
        "showBrandName": false,
        "showSku": true,
        "showProductReference": false
      }
    }
  },

  "sku-summary-column#1": {
    "children": [
      "sku-summary-price",
      "sku-summary-buy-button"
    ]
  }
}
```

### 6. Default app blocks

The app ships a default composition in `store/blocks.json`:

```json
{
  "sku-summary-list": {
    "blocks": ["sku-summary.shelf"]
  },
  "sku-summary.shelf": {
    "children": [
      "sku-summary-image",
      "sku-summary-name",
      "sku-summary-attachment-list",
      "sku-summary-space",
      "sku-summary-column#1"
    ]
  },
  "sku-summary-column#1": {
    "children": ["sku-summary-price", "sku-summary-buy-button"]
  }
}
```

Override any of these blocks in your theme to customize layout per template.

### 7. Showcase / shelf with layout children

Use `children` to wrap the list in a responsive layout (slider, grid, etc.). `maxItems` limits how many SKU cards are injected into the list context — independent of how many SKUs the product has in the catalog.

```json
{
  "sunhouse.sku-summary-list#ambient-showcase_shelf": {
    "title": "Configurações da Lista de SKUs",
    "props": {
      "productId": "123",
      "itemsFilter": "ALL_AVAILABLE",
      "maxItems": 4
    },
    "blocks": ["sku-summary.shelf#main-product-new"],
    "children": ["responsive-layout.desktop#ambient-showcase_shelf"]
  },

  "sku-summary.shelf#main-product-new": {
    "children": [
      "sku-summary-image",
      "sku-summary-name",
      "sku-summary-price",
      "sku-summary-buy-button"
    ]
  }
}
```

> **Note:** This app uses `sku-summary-list`, not `list-context.product-list`. The `maxItems` prop limits **SKU cards**, not products.

---

## SKU deep links

Each card link is built in `SkuSummaryCustom` and resolves to:

```
https://{store-domain}/{linkText}/p?skuId={itemId}
```

Example:

```
https://dev1--sunhouse.myvtex.com/rack-abra-ripado-cor-nature-3-gavetas-222cm---76907/p?skuId=76907
```

The VTEX `Link` component expects `query` as a **string** (not an object). The app passes `skuId={itemId}` when a selected SKU is available.

---

## Compatibility with theme blocks

Because each card exposes a full product-shaped context, standard theme blocks that read product data (e.g. `sunhouse.condition-layout`) work as child blocks of `sku-summary.shelf`.

The GraphQL query includes fields required by common theme integrations:

- `productClusters`, `clusterHighlights`, `categories`
- `priceRange`, `specificationGroups`, `skuSpecifications`, `properties`

Virtual SKU cards also apply defensive defaults (`[]`) for array fields when the API returns `null`.

---

## Performance notes

| Scenario | Behavior |
| -------- | -------- |
| GraphQL (automatic) | 1 request per list — `productsByIdentifier(field: id)` |
| GraphQL (manual) | 1 batch request — `productsByIdentifier(field: sku)` |
| Caching | `fetchPolicy: 'cache-first'` on Apollo |
| SSR | Query runs client-side only (`ssr: false`) |
| Default filter | `ALL_AVAILABLE` — skips unavailable SKUs (automatic mode only) |
| Manual lists | Typical use ≤10 SKUs; order matches Site Editor |
| Price simulation | `priceBehavior: default` — no async simulation per card unless configured on the shelf |

For products with **30+ SKUs** in automatic mode, use `maxItems` or pagination in the theme.

---

## Customization

To apply CSS customizations, follow [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS handles |
| ----------- |
| `attachmentChildrenContainer` |
| `attachmentItem` |
| `attachmentListContainer` |
| `attachmentName` |
| `attachmentQuantity` |
| `brandName` |
| `buyButton` |
| `buyButtonContainer` |
| `clearLink` |
| `column` |
| `container` |
| `containerNormal` |
| `element` |
| `image` |
| `imageContainer` |
| `imagePlaceholder` |
| `imageWrapper` |
| `installmentContainer` |
| `interestRate` |
| `listPrice` |
| `listPriceContainer` |
| `listPriceLabel` |
| `listPriceRange` |
| `mainImageHovered` |
| `nameContainer` |
| `nameWrapper` |
| `priceContainer` |
| `product` |
| `productName` |
| `productPriceClass` |
| `productReference` |
| `savings` |
| `savingsContainer` |
| `sellingPrice` |
| `sellingPriceContainer` |
| `sellingPriceLabel` |
| `sellingPriceRange` |
| `skuName` |
| `skuNameContainer` |
| `spacer` |
| `sponsoredBadge` |
| `sponsoredBadgeContainer` |
| `sponsoredBadgeText` |

---

## Related documentation

- [BLOCKS.md](./BLOCKS.md) — quick reference for blocks and props
- [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md) — session history, bugs fixed, and TODOs
- [vtex.product-summary](https://github.com/vtex-apps/product-summary) — upstream app this project is based on
- [vtex.search-graphql](https://developers.vtex.com/docs/apps/vtex.search-graphql) — `productsByIdentifier` query provider

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
