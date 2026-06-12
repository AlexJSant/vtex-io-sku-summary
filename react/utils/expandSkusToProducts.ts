import type { ProductTypes } from 'vtex.product-context'

import { mapCatalogProductToProductSummary } from './normalize'

function buildVirtualProductCard(
  product: ProductTypes.Product,
  item: ProductTypes.Item
) {
  const virtualProduct = {
    ...product,
    items: [item],
    cacheId: `${product.cacheId ?? product.productId}-${item.itemId}`,
    productClusters: product.productClusters ?? [],
    clusterHighlights: product.clusterHighlights ?? [],
    categories: product.categories ?? [],
    properties: product.properties ?? [],
    specificationGroups: product.specificationGroups ?? [],
    skuSpecifications: product.skuSpecifications ?? [],
  } as ProductTypes.Product

  return mapCatalogProductToProductSummary(virtualProduct, 'FIRST_AVAILABLE')
}

/**
 * Expands each SKU of a product into a virtual product card
 * with a single item, ready for ProductSummaryListWithoutQuery.
 */
export function expandSkusToProductCards(product: ProductTypes.Product) {
  const items = product?.items ?? []

  if (!items.length) {
    return []
  }

  return items.map((item: ProductTypes.Item) =>
    buildVirtualProductCard(product, item)
  )
}

/**
 * Maps manually selected SKU IDs to virtual product cards, preserving
 * editor order. Supports multiple SKUs from the same product — each ID
 * yields its own card even when the API returns a single product entry.
 */
export function expandManualSkusToProductCards(
  products: ProductTypes.Product[] | undefined,
  skuIds: string[]
) {
  if (!products?.length || !skuIds.length) {
    return []
  }

  const itemLookup = new Map<
    string,
    { product: ProductTypes.Product; item: ProductTypes.Item }
  >()

  for (const product of products) {
    for (const item of product.items ?? []) {
      itemLookup.set(String(item.itemId), { product, item })
    }
  }

  return skuIds.reduce<ProductTypes.Product[]>((cards, skuId) => {
    const match = itemLookup.get(String(skuId))

    if (!match) {
      return cards
    }

    cards.push({
      ...match.product,
      items: [match.item],
      cacheId: `${match.product.cacheId ?? match.product.productId}-${match.item.itemId}`,
      productClusters: match.product.productClusters ?? [],
      clusterHighlights: match.product.clusterHighlights ?? [],
      categories: match.product.categories ?? [],
      properties: match.product.properties ?? [],
      specificationGroups: match.product.specificationGroups ?? [],
      skuSpecifications: match.product.skuSpecifications ?? [],
    } as ProductTypes.Product)

    return cards
  }, [])
}
