import type { PropsWithChildren } from 'react'
import React, { useMemo } from 'react'
import { useQuery } from 'react-apollo'

import productById from './queries/productById.gql'
import SkuSummaryListWithoutQuery from './SkuSummaryListWithoutQuery'
import { adminMessages } from './messages'
import type { ProductClickParams } from './types'
import { expandSkusToProductCards } from './utils/expandSkusToProducts'

type ItemsFilter = 'ALL' | 'FIRST_AVAILABLE' | 'ALL_AVAILABLE'

interface Props extends PropsWithChildren<{
  /** Product ID to fetch SKUs from. */
  productId: string
  /** Name of the list for analytics events. */
  listName?: string
  /** Filter applied to product items in the GraphQL query. */
  itemsFilter?: ItemsFilter
  /** Maximum number of SKU cards to display in the shelf. */
  maxItems?: number
  /** Callback on product (SKU card) click. */
  actionOnProductClick?: (
    product: Record<string, unknown>,
    productClickParams?: ProductClickParams
  ) => void
}> {}

const DEFAULT_LIST_NAME = 'SKU list'

function SkuSummaryList({
  children,
  productId,
  listName = DEFAULT_LIST_NAME,
  itemsFilter = 'ALL_AVAILABLE',
  maxItems,
  actionOnProductClick,
}: Props) {
  const { data, loading, error } = useQuery(productById, {
    variables: {
      productId,
      itemsFilter,
    },
    skip: !productId,
    ssr: false,
    fetchPolicy: 'cache-first',
  })

  const products = useMemo(() => {
    const product = data?.productsByIdentifier?.[0]

    if (!product) {
      return []
    }

    const expandedProducts = expandSkusToProductCards(product)

    if (typeof maxItems === 'number' && maxItems > 0) {
      return expandedProducts.slice(0, maxItems)
    }

    return expandedProducts
  }, [data, maxItems])

  if (!productId || loading || error || !products.length) {
    return null
  }

  return (
    <SkuSummaryListWithoutQuery
      products={products}
      listName={listName}
      preferredSKU="FIRST_AVAILABLE"
      actionOnProductClick={actionOnProductClick}
    >
      {children}
    </SkuSummaryListWithoutQuery>
  )
}

SkuSummaryList.schema = {
  title: adminMessages.skuSummaryListTitle.id,
  description: adminMessages.skuSummaryListDescription.id,
  type: 'object',
  properties: {
    productId: {
      title: adminMessages.skuSummaryListProductIdTitle.id,
      description: adminMessages.skuSummaryListProductIdDescription.id,
      type: 'string',
    },
    listName: {
      title: adminMessages.skuSummaryListListNameTitle.id,
      type: 'string',
      default: DEFAULT_LIST_NAME,
    },
    itemsFilter: {
      title: adminMessages.skuSummaryListItemsFilterTitle.id,
      type: 'string',
      enum: ['ALL', 'FIRST_AVAILABLE', 'ALL_AVAILABLE'],
      default: 'ALL_AVAILABLE',
      enumNames: [
        adminMessages.skuSummaryListItemsFilterAll.id,
        adminMessages.skuSummaryListItemsFilterFirstAvailable.id,
        adminMessages.skuSummaryListItemsFilterAllAvailable.id,
      ],
    },
    maxItems: {
      title: adminMessages.skuSummaryListMaxItemsTitle.id,
      description: adminMessages.skuSummaryListMaxItemsDescription.id,
      type: 'number',
      minimum: 1,
    },
  },
}

export default SkuSummaryList
