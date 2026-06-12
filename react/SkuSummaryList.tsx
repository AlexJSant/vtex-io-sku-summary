import type { PropsWithChildren } from 'react'
import React, { useMemo } from 'react'
import { useQuery } from 'react-apollo'

import productById from './queries/productById.gql'
import productsBySkuIds from './queries/productsBySkuIds.gql'
import SkuSummaryListWithoutQuery from './SkuSummaryListWithoutQuery'
import { adminMessages } from './messages'
import type { ProductClickParams } from './types'
import {
  expandManualSkusToProductCards,
  expandSkusToProductCards,
} from './utils/expandSkusToProducts'

type ItemsFilter = 'ALL' | 'FIRST_AVAILABLE' | 'ALL_AVAILABLE'

interface ManualSku {
  skuId?: string
  __editorItemTitle?: string
}

interface Props extends PropsWithChildren<{
  /** Product ID to fetch SKUs from. Ignored when manual SKUs are provided. */
  productId?: string
  /** Manually selected SKUs. When present, overrides productId. */
  skus?: ManualSku[]
  /** Name of the list for analytics events. */
  listName?: string
  /** Filter applied to product items in the GraphQL query. Only used with productId. */
  itemsFilter?: ItemsFilter
  /** Maximum number of SKU cards to display. Only used with productId. */
  maxItems?: number
  /** Callback on product (SKU card) click. */
  actionOnProductClick?: (
    product: Record<string, unknown>,
    productClickParams?: ProductClickParams
  ) => void
}> {}

const DEFAULT_LIST_NAME = 'SKU list'

function normalizeManualSkuIds(skus?: ManualSku[] | unknown) {
  if (!Array.isArray(skus) || !skus.length) {
    return []
  }

  return skus
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return ''
      }

      const skuEntry = entry as ManualSku & { id?: string | number }
      const rawSkuId = skuEntry.skuId ?? skuEntry.id

      if (rawSkuId == null || rawSkuId === '') {
        return ''
      }

      return String(rawSkuId).trim()
    })
    .filter((skuId): skuId is string => Boolean(skuId))
}

function SkuSummaryList({
  children,
  productId,
  skus,
  listName = DEFAULT_LIST_NAME,
  itemsFilter = 'ALL_AVAILABLE',
  maxItems,
  actionOnProductClick,
}: Props) {
  const manualSkuIds = useMemo(() => normalizeManualSkuIds(skus), [skus])
  const isManualMode = manualSkuIds.length > 0

  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(productById, {
    variables: {
      productId,
      itemsFilter,
    },
    skip: isManualMode || !productId,
    ssr: false,
    fetchPolicy: 'cache-first',
  })

  const {
    data: skuData,
    loading: skuLoading,
    error: skuError,
  } = useQuery(productsBySkuIds, {
    variables: {
      skuIds: manualSkuIds,
    },
    skip: !isManualMode,
    ssr: false,
    fetchPolicy: 'cache-first',
  })

  const products = useMemo(() => {
    if (isManualMode) {
      return expandManualSkusToProductCards(
        skuData?.productsByIdentifier,
        manualSkuIds
      )
    }

    const product = productData?.productsByIdentifier?.[0]

    if (!product) {
      return []
    }

    const expandedProducts = expandSkusToProductCards(product)

    if (typeof maxItems === 'number' && maxItems > 0) {
      return expandedProducts.slice(0, maxItems)
    }

    return expandedProducts
  }, [isManualMode, skuData, manualSkuIds, productData, maxItems])

  const loading = isManualMode ? skuLoading : productLoading
  const error = isManualMode ? skuError : productError
  const hasSource = isManualMode ? manualSkuIds.length > 0 : Boolean(productId)

  if (!hasSource || loading || error || !products.length) {
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
    skus: {
      type: 'array',
      title: adminMessages.skuSummaryListSkusTitle.id,
      description: adminMessages.skuSummaryListSkusDescription.id,
      items: {
        type: 'object',
        title: adminMessages.skuSummaryListSkusItemTitle.id,
        properties: {
          __editorItemTitle: {
            title: adminMessages.skuSummaryListSkusItemEditorTitle.id,
            type: 'string',
          },
          skuId: {
            title: adminMessages.skuSummaryListSkusItemSkuIdTitle.id,
            description: adminMessages.skuSummaryListSkusItemSkuIdDescription.id,
            type: 'string',
          },
        },
      },
    },
    listName: {
      title: adminMessages.skuSummaryListListNameTitle.id,
      type: 'string',
      default: DEFAULT_LIST_NAME,
    },
    itemsFilter: {
      title: adminMessages.skuSummaryListItemsFilterTitle.id,
      description: adminMessages.skuSummaryListItemsFilterDescription.id,
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
