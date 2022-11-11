import { ShopeeBaseResponse } from '.'

interface ShopeeCancelOrderItem {
  item_id: number
  model_id: number
}

export interface ShopeeCancelOrderInput {
  order_sn: string
  cancel_reason: 'OUT_OF_STOCK' | 'CUSTOMER_REQUEST' | 'UNDELIVERABLE_AREA' | 'COD_NOT_SUPPORTED'
  item_list: ShopeeCancelOrderItem[]
}

/**
 * @see https://open.shopee.com/documents/v2/v2.order.cancel_order?module=94&type=1
 * 
 * Example Payload
 * 
 * ```json
 * {
    "error": "",
    "message": "",
    "request_id": "2ead12d461c34e7c9275c42c2f70fa7d",
    "response": {
        "update_time": 1603184533
    } 
 * },
 * ```
 */

export interface ShopeeCancelOrderResponse extends ShopeeBaseResponse {
  error: string
  message: string
  request_id: string
  response: {
    update_time: number
  }
}