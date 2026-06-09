import { defineMessages } from 'react-intl'

export const storeMessages = defineMessages({
  pricingFrom: {
    id: 'store/pricing.from',
    defaultMessage: 'From',
  },
  pricingTo: {
    id: 'store/pricing.to',
    defaultMessage: 'To',
  },
  buttonLabel: {
    id: 'store/button-label',
    defaultMessage: 'Buy',
  },
  sponsoredBadgeLabel: {
    id: 'store/sponsored-badge.label',
    defaultMessage: 'Sponsored',
  },
  shelfAriaLabel: {
    id: 'store/product-summary.shelf.aria-label',
    defaultMessage: 'Product {productName}',
  },
  nameAriaLabel: {
    id: 'store/product-summary.name.aria-label',
    defaultMessage: 'Name for product {productName}',
  },
  imageAriaLabel: {
    id: 'store/product-summary.image.aria-label',
    defaultMessage: 'Image from product {productName}',
  },
  attachmentName: {
    id: 'store/productSummary.attachmentName',
    defaultMessage: '{sign} {quantity}x {name}',
  },
  missingOptionName: {
    id: 'store/productSummary.missingOptionName',
    defaultMessage: 'No {name}',
  },
})

export const adminMessages = defineMessages({
  productSummaryTitle: {
    id: 'admin/editor.productSummary.title',
    defaultMessage: 'Product Summary',
  },
  productSummaryDescription: {
    id: 'admin/editor.productSummary.description',
    defaultMessage:
      'Product summary showing the main product information',
  },
  productSummaryIsOneClickBuyTitle: {
    id: 'admin/editor.productSummary.isOneClickBuy.title',
    defaultMessage: 'Redirect to checkout after clicking buy',
  },
  productSummaryShowBadgeTitle: {
    id: 'admin/editor.productSummary.showBadge.title',
    defaultMessage: 'Show discount badge',
  },
  productSummaryBadgeTextTitle: {
    id: 'admin/editor.productSummary.badgeText.title',
    defaultMessage: 'Badge text',
  },
  productSummaryBuyButtonTextTitle: {
    id: 'admin/editor.productSummary.buyButtonText.title',
    defaultMessage: 'Text for the custom purchase button',
  },
  productSummaryShowCollectionsTitle: {
    id: 'admin/editor.productSummary.showCollections.title',
    defaultMessage: 'Show the collection badges',
  },
  productSummaryDisplayModeTitle: {
    id: 'admin/editor.productSummary.displayMode.title',
    defaultMessage: 'Display mode',
  },
  productSummaryDisplayBuyButtonTitle: {
    id: 'admin/editor.productSummary.displayBuyButton.title',
    defaultMessage: 'Buy button display mode',
  },
  productSummaryDisplayBuyButtonOptionNone: {
    id: 'admin/editor.productSummary.displayBuyButton.option.none',
    defaultMessage: 'Never Show',
  },
  productSummaryDisplayBuyButtonOptionAlways: {
    id: 'admin/editor.productSummary.displayBuyButton.option.always',
    defaultMessage: 'Always Show',
  },
  productSummaryDisplayBuyButtonOptionHover: {
    id: 'admin/editor.productSummary.displayBuyButton.option.hover',
    defaultMessage: 'Show on hover (web)',
  },
  productSummaryTrackListNameTitle: {
    id: 'admin/editor.productSummary.trackListName.title',
    defaultMessage: 'Track list name',
  },
  productSummaryPriceTitle: {
    id: 'admin/editor.productSummaryPrice.title',
    defaultMessage: 'Product Summary Price',
  },
  productSummaryPriceDescription: {
    id: 'admin/editor.productSummaryPrice.description',
    defaultMessage:
      'Component that shows product price inside the product summary',
  },
  productSummaryPriceShowListPriceTitle: {
    id: 'admin/editor.productSummaryPrice.showListPrice.title',
    defaultMessage: 'Show list price',
  },
  productSummaryPriceShowSellingPriceRangeTitle: {
    id: 'admin/editor.productSummaryPrice.showSellingPriceRange.title',
    defaultMessage: 'Show selling price range',
  },
  productSummaryPriceShowListPriceRangeTitle: {
    id: 'admin/editor.productSummaryPrice.showListPriceRange.title',
    defaultMessage: 'Show list-price range',
  },
  productSummaryPriceShowInstallmentsTitle: {
    id: 'admin/editor.productSummaryPrice.showInstallments.title',
    defaultMessage: 'Show installments',
  },
  productSummaryPriceShowDiscountValueTitle: {
    id: 'admin/editor.productSummaryPrice.showDiscountValue.title',
    defaultMessage: 'Show discount',
  },
  productSummaryPriceShowLabelsTitle: {
    id: 'admin/editor.productSummaryPrice.showLabels.title',
    defaultMessage: 'Show labels',
  },
  productSummaryPriceLabelSellingPriceTitle: {
    id: 'admin/editor.productSummaryPrice.labelSellingPrice.title',
    defaultMessage: 'Selling price label',
  },
  productSummaryPriceLabelListPriceTitle: {
    id: 'admin/editor.productSummaryPrice.labelListPrice.title',
    defaultMessage: 'List price label',
  },
  productSummaryPriceShowBordersTitle: {
    id: 'admin/editor.productSummaryPrice.showBorders.title',
    defaultMessage: 'Show borders',
  },
  productSummaryImageTitle: {
    id: 'admin/editor.productSummaryImage.title',
    defaultMessage: 'Product Summary Image',
  },
  productSummaryImageDescription: {
    id: 'admin/editor.productSummaryImage.description',
    defaultMessage: 'Component that displays the product image',
  },
  productSummaryImageHoverImageLabelTitle: {
    id: 'admin/editor.productSummaryImage.hoverImageLabel.title',
    defaultMessage: 'Hover image label',
  },
  productSummaryImageHoverImageLabelDescription: {
    id: 'admin/editor.productSummaryImage.hoverImageLabel.description',
    defaultMessage:
      'This property is deprecated. Please use the criteria property instead',
  },
  productSummaryImageHoverImageCriteriaTitle: {
    id: 'admin/editor.productSummaryImage.hoverImage.criteria.title',
    defaultMessage: 'Criteria for hover image selection',
  },
  productSummaryImageHoverImageCriteriaIndex: {
    id: 'admin/editor.productSummaryImage.hoverImage.criteria.index',
    defaultMessage: 'Hover Image Index',
  },
  productSummaryImageHoverImageCriteriaLabel: {
    id: 'admin/editor.productSummaryImage.hoverImage.criteria.label',
    defaultMessage: 'Hover image label',
  },
  productSummaryImageHoverImageCriteriaMatchCriteria: {
    id: 'admin/editor.productSummaryImage.hoverImage.criteria.matchCriteria',
    defaultMessage:
      "Hover image label search criteria (exact: finds the image that is an exact match of the name in the 'Hover image label' field | contains: finds the first image that contains the text in the 'Hover image label' field).",
  },
  productSummaryImageFetchpriorityTitle: {
    id: 'admin/editor.productSummaryImage.fetchpriority.title',
    defaultMessage: 'Fetch priority hint',
  },
  productSummaryImageFetchpriorityHigh: {
    id: 'admin/editor.productSummaryImage.fetchpriority.high',
    defaultMessage: 'High priority',
  },
  productSummaryImageFetchpriorityLow: {
    id: 'admin/editor.productSummaryImage.fetchpriority.low',
    defaultMessage: 'Low priority',
  },
  productSummaryImageFetchpriorityAuto: {
    id: 'admin/editor.productSummaryImage.fetchpriority.auto',
    defaultMessage: 'Let the browser decide the priority.',
  },
  productSummaryImageFetchpriorityByPosition: {
    id: 'admin/editor.productSummaryImage.fetchpriority.byPosition',
    defaultMessage: 'Prioritize based on its position',
  },
  productSummaryBuyButtonTitle: {
    id: 'admin/editor.productSummaryBuyButton.title',
    defaultMessage: 'Product Summary Buy Button',
  },
  productSummaryNameTitle: {
    id: 'admin/editor.productSummaryName.title',
    defaultMessage: 'Product Summary Name',
  },
  skuSummaryListTitle: {
    id: 'admin/editor.skuSummaryList.title',
    defaultMessage: 'SKU Summary List',
  },
  skuSummaryListDescription: {
    id: 'admin/editor.skuSummaryList.description',
    defaultMessage: 'Lists all SKUs of a product as individual cards',
  },
  skuSummaryListProductIdTitle: {
    id: 'admin/editor.skuSummaryList.productId.title',
    defaultMessage: 'Product ID',
  },
  skuSummaryListProductIdDescription: {
    id: 'admin/editor.skuSummaryList.productId.description',
    defaultMessage: 'Catalog product ID whose SKUs will be listed',
  },
  skuSummaryListListNameTitle: {
    id: 'admin/editor.skuSummaryList.listName.title',
    defaultMessage: 'List name (analytics)',
  },
  skuSummaryListItemsFilterTitle: {
    id: 'admin/editor.skuSummaryList.itemsFilter.title',
    defaultMessage: 'SKU filter',
  },
  skuSummaryListItemsFilterAll: {
    id: 'admin/editor.skuSummaryList.itemsFilter.all',
    defaultMessage: 'All SKUs',
  },
  skuSummaryListItemsFilterFirstAvailable: {
    id: 'admin/editor.skuSummaryList.itemsFilter.firstAvailable',
    defaultMessage: 'First available SKU only',
  },
  skuSummaryListItemsFilterAllAvailable: {
    id: 'admin/editor.skuSummaryList.itemsFilter.allAvailable',
    defaultMessage: 'All available SKUs',
  },
  skuSummaryListMaxItemsTitle: {
    id: 'admin/editor.skuSummaryList.maxItems.title',
    defaultMessage: 'Max Items',
  },
  skuSummaryListMaxItemsDescription: {
    id: 'admin/editor.skuSummaryList.maxItems.description',
    defaultMessage:
      "Limits how many SKU cards appear on the shelf, regardless of the product's total SKU count",
  },
})
