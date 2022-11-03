import { ShopeeBaseResponse } from '.'

/**
 * @see https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1
 * 
 * Example Payload
 * 
 * ```json
 * {
 *   "category_id": 100001,
 *   "parent_category_id": 0,
 *   "original_category_name": "Health",
 *   "display_category_name": "Health",
 *   "has_children": true
 * }
 * ```
 */ 
export interface ShopeeCategoryInfo {
  category_id: number
  parent_category_id: number
  original_category_name: string
  display_category_name: string
  has_children: boolean
}

export interface ShopeeCategoryResponse extends ShopeeBaseResponse {
  warning: string
  response: {
    category_list: ShopeeCategoryInfo[]
  }
}