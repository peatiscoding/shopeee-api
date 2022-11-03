import { ShopeeBaseResponse } from '.'

/**
 * @see https://open.shopee.com/documents/v2/v2.shop.get_profile?module=92&type=1
 * 
 * Example:
 * 
 * ```
 * {
 *   "request_id": "902f5a3356b507cc5fdfc11da3d65c20",
 *   "error": "",
 *   "message": "",
 *   "response": {
 *     "shop_name": "auto_gen_90c84fb",
 *     "shop_logo": "",
 *     "description": ""
 *   }
 * }
 * ```
 */
export interface ShopeeProfileInfoResponse extends ShopeeBaseResponse {
  response: {
    shop_logo: string
    description: string
    shop_name: string
  }
}