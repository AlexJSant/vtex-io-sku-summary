# Blocks and props (`sunhouse.sku-summary`)

**Available blocks:** `sunhouse.sku-summary-list` · `sku-summary.shelf` (alias: `sku-summary`) · `sku-summary-image` · `sku-summary-name` · `sku-summary-sku-name` · `sku-summary-price` · `sku-summary-buy-button` · `sku-summary-attachment-list` · `sku-summary-column` · `sku-summary-space`

---

## Full theme example

```json
{
  "sku-summary-list#variations": {
    "props": {
      "productId": "456",
      "listName": "Product variations",
      "itemsFilter": "ALL_AVAILABLE",
      "maxItems": 6
    },
    "blocks": ["sku-summary.shelf"]
  },

  "sku-summary-list#manual-picks": {
    "props": {
      "listName": "Curated variations",
      "skus": [
        { "skuId": "76907" },
        { "skuId": "76908" }
      ]
    },
    "blocks": ["sku-summary.shelf"]
  },

  "sku-summary.shelf": {
    "props": {
      "priceBehavior": "asyncOnly1P",
      "trackListName": true
    },
    "children": [
      "sku-summary-image",
      "sku-summary-name",
      "sku-summary-sku-name",
      "sku-summary-attachment-list",
      "sku-summary-space",
      "sku-summary-column#1"
    ]
  },

  "sku-summary-column#1": {
    "children": [
      "sku-summary-price",
      "sku-summary-buy-button"
    ]
  },

  "sku-summary-image": {
    "props": {
      "showBadge": true,
      "badgeText": "store/discount-badge",
      "showCollections": false,
      "displayMode": "normal",
      "fetchpriority": "byPosition",
      "mainImageLabel": "",
      "hoverImageLabel": "",
      "hoverImage": {
        "criteria": "label",
        "label": "hover",
        "labelMatchCriteria": "exact"
      },
      "placeholder": "",
      "width": 300,
      "height": 300,
      "aspectRatio": "1:1",
      "maxHeight": "300px"
    }
  },

  "sku-summary-name": {
    "props": {
      "showFieldsProps": {
        "showProductName": true,
        "showBrandName": false,
        "showSku": false,
        "showProductReference": false
      },
      "tag": "h3"
    }
  },

  "sku-summary-sku-name": {},

  "sku-summary-attachment-list": {},

  "sku-summary-space": {},

  "sku-summary-price": {
    "props": {
      "showListPrice": true,
      "showSellingPriceRange": false,
      "showListPriceRange": false,
      "showLabels": true,
      "showInstallments": true,
      "showDiscountValue": false,
      "showBorders": false,
      "labelSellingPrice": "store/pricing.to",
      "labelListPrice": "store/pricing.from"
    }
  },

  "sku-summary-buy-button": {
    "props": {
      "displayBuyButton": "displayButtonAlways",
      "isOneClickBuy": false,
      "buyButtonText": "store/button-label",
      "buyButtonBehavior": "default",
      "customToastURL": ""
    }
  }
}
```

### Accepted values

**`itemsFilter`** — `ALL` · `FIRST_AVAILABLE` · `ALL_AVAILABLE`

**`priceBehavior`** — `default` · `async` · `asyncOnly1P`

**`displayMode`** — `normal` · `inline`

**`fetchpriority`** — `high` · `low` · `auto` · `byPosition`

**`hoverImage.criteria`** — `label` (with `label` + `labelMatchCriteria`: `exact` | `contains`) · `index` (with `index`: number)

**`tag`** — `div` · `h1` · `h2` · `h3`

**`displayBuyButton`** — `displayButtonAlways` · `displayButtonHover` · `displayButtonNone`

**`buyButtonBehavior`** — `default` · `alwaysGoToProduct` · `alwaysAddToCart`

> `sku-summary-name`: all `showFieldsProps` flags default to `false`. The block renders nothing unless at least one flag is `true` and the corresponding data exists (or a sponsored badge applies).

> `sku-summary-sku-name`, `sku-summary-attachment-list`, `sku-summary-space`, and `sku-summary-column` have no props — they are only used in `children`.
