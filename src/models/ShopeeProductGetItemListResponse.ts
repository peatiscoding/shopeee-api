import { ShopeeBaseResponse } from '.'

export type ShopeeProductItemStatus = 'NORMAL' | 'UNLIST' | 'BANNED' | 'DELETED'

/**
 * @see https://open.shopee.com/documents/v2/v2.product.get_item_list?module=89&type=1
 * 
 * Example Payload
 * 
 * ```json
 * {
 * }
 * ```
 */ 
export interface ShopeeProductItemId {
  item_id: number
  item_status: ShopeeProductItemStatus
  update_time: number
}

export interface ShopeeProductGetItemListResponse extends ShopeeBaseResponse {
  warning: string
  response: {
    item: ShopeeProductItemId[]
    total_count: number
    has_next_page: boolean
    next_offset: number
  }
}