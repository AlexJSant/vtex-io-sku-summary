import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'
import { ProductSummaryContext } from 'vtex.product-summary-context'
import { SponsoredBadgePosition } from 'vtex.product-summary-context/react/ProductSummaryTypes'
import { useIntl } from 'react-intl'
import { IOMessage } from 'vtex.native-types'

import shouldShowSponsoredBadge from './utils/shouldShowSponsoredBadge'
import { adminMessages, storeMessages } from './messages'

const { useProductSummary } = ProductSummaryContext

const CSS_HANDLES = [
  'nameContainer',
  'nameWrapper',
  'productName',
  'brandName',
  'skuName',
  'productReference',
  'sponsoredBadge',
] as const

const defaultShowFields = {
  showProductName: false,
  showProductReference: false,
  showBrandName: false,
  showSku: false,
}

interface ShowFieldsProps {
  showProductName?: boolean
  showProductReference?: boolean
  showBrandName?: boolean
  showSku?: boolean
}

interface Props {
  /**
   * Defines the visibility on certain properties.
   * @default { showProductName: false, showProductReference: false, showBrandName: false, showSku: false }
   */
  showFieldsProps?: ShowFieldsProps
  /**
   * HTML tag used. It can be: `div`, `h1`, `h2`, `h3`.
   * @default "h3"
   */
  tag?: 'div' | 'h1' | 'h2' | 'h3'
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function ProductSummaryName({
  showFieldsProps = defaultShowFields,
  tag = 'h3',
  classes,
}: Props) {
  const { product, sponsoredBadge } = useProductSummary()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const productName = product?.productName
  const skuName = product?.sku?.name
  const brandName = product?.brand
  const productReference = product?.productReference

  const fields = { ...defaultShowFields, ...showFieldsProps }

  const showSponsoredBadge = shouldShowSponsoredBadge(
    product,
    sponsoredBadge?.position as SponsoredBadgePosition,
    'titleTop'
  )

  const showProduct = fields.showProductName && productName
  const showBrand = fields.showBrandName && brandName
  const showSkuField = fields.showSku && skuName
  const showReference = fields.showProductReference && productReference

  const hasVisibleContent =
    showProduct || showBrand || showSkuField || showReference || showSponsoredBadge

  if (!hasVisibleContent) {
    return null
  }

  const Wrapper = tag
  const intl = useIntl()

  const ariaLabelParts = [
    showProduct && productName,
    showBrand && brandName,
    showSkuField && skuName,
    showReference && productReference,
  ].filter(Boolean)

  const ariaLabel = ariaLabelParts.length
    ? intl.formatMessage(storeMessages.nameAriaLabel, {
        productName: ariaLabelParts.join(' '),
      })
    : undefined

  return (
    <div
      className={`${handles.nameContainer} flex items-start justify-center pv6`}
      aria-label={ariaLabel}
    >
      <Wrapper
        className={`${handles.nameWrapper} overflow-hidden c-on-base f5 mv0`}
      >
        {showSponsoredBadge && (
          <span className={`${handles.sponsoredBadge} db c-muted-1 t-mini-s`}>
            <IOMessage id={sponsoredBadge?.label} />
          </span>
        )}
        {showProduct && (
          <span className={`${handles.productName} t-body`}>{productName}</span>
        )}
        {showBrand && (
          <span className={`${handles.brandName} t-body`}>{brandName} </span>
        )}
        {showSkuField && (
          <span className={`${handles.skuName} t-small`}>{skuName}</span>
        )}
        {showReference && (
          <span className={handles.productReference}>
            {`REF: ${productReference}`}
          </span>
        )}
      </Wrapper>
    </div>
  )
}

ProductSummaryName.schema = {
  title: adminMessages.productSummaryNameTitle.id,
  type: 'object',
  properties: {},
}

export default ProductSummaryName
