import type { ProductTypes } from 'vtex.product-context'

import { mapCatalogProductToProductSummary } from './normalize'

/**
 * Expands each SKU of a product into a virtual product card
 * with a single item, ready for ProductSummaryListWithoutQuery.
 */
export function expandSkusToProductCards(product: ProductTypes.Product) {
  const items = product?.items ?? []

  if (!items.length) {
    return []
  }

  return items.map((item: ProductTypes.Item) => {
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
  })
}
