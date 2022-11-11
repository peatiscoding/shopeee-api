import { ShopeeBaseResponse } from '.'

export interface ShopeeHandleBuyerCancellationInput {
  order_sn: string
  operation: 'ACCEPT' | 'REJECT'
}

/**
 * @see https://open.shopee.com/documents/v2/v2.order.handle_buyer_cancellation?module=94&type=1
 * 
 * Example Payload
 * 
 * ```json
 * {
    "request_id": "b937c04e554847789cbf3fe33a0ad5f1",
    "error": "",
    "message": "",
    "response": {
         "update_time": 14981918191
    }
 * },
 * ```
 */

export interface ShopeeHandleBuyerCancellationResponse extends ShopeeBaseResponse {
  request_id: string
  error: string
  message: string
  response: {
    update_time: number
  }
}