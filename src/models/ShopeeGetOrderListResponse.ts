import { ShopeeBaseResponse } from '.'

export type ShopeeOrderStatus = 'UNPAID' | 'READY_TO_SHIP' | 'PROCESSED' | 'SHIPPED' | 'COMPLETED' | 'IN_CANCEL' | 'CANCELLED' | 'INVOICE_PENDING'

/**
 * @see https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1
 * 
 * Example Payload
 * 
 * ```json
 * {
 *   "error": "",
 *   "message": "",
 *   "warning": "",
 *   "request_id": "b937c04e554847789cbf3fe33a0ad5f1",
 *   "response": {
 *     "mode": true,
 *     "next_cursor":"20",
 *     "order_list": [
 *       {
 *           "order_sn": "string"
 *       },
 *       {
 *           "order_sn": "string"
 *       }
 *     ],
 *   }
 * },
 * ```
 */
export interface ShopeeOrderList {
  order_sn: string
}

export interface ShopeeGetOrderListResponse extends ShopeeBaseResponse {
  error: string
  response: {
    more: boolean,
    next_cursor: string,
    order_list: ShopeeOrderList[]
  }
}