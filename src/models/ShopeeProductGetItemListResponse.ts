import { ShopeeBaseResponse } from '.'

export type ShopeeProductItemStatus = 'NORMAL' | 'UNLIST' | 'BANNED' | 'DELETED'

/**
 * @see https://open.shopee.com/documents/v2/v2.product.get_item_list?module=89&type=1
 * 
 * Example Payload
 * 
 * ```json
 * {
 *   "error": "",
 *   "message": "",
 *   "warning": "",
 *   "request_id": "159ef3b9216fd3e799a4db4453c22720",
 *   "response": {
 *     "item": [
 *       {
 *         "item_id": 1830497,
 *         "item_status": "NORMAL",
 *         "update_time": 1667488380
 *       }
 *     ],
 *     "total_count": 1,
 *     "has_next_page": false
 *   }
 * },
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