import { ShopeeBaseResponse } from '.'

export interface SipAffiliateShopInfo {
  affi_shop_id: string
  region: string
}

/**
 * @see https://open.shopee.com/documents/v2/v2.shop.get_shop_info?module=92&type=1
 *
 * Example
 * 
 * ```json
 * {
 *   "shop_name": "auto_gen_90c84fb",
 *   "region": "TH",
 *   "status": "NORMAL",
 *   "is_sip": false,
 *   "is_cb": false,
 *   "is_cnsc": false,
 *   "request_id": "b15066953fc6ddb50b247df0cd35d020",
 *   "auth_time": 1667450081,
 *   "expire_time": 1699027199,
 *   "error": "",
 *   "message": "",
 *   "shop_cbsc": "UNUPGRADED"
 * }
 * ```
 */
export interface ShopeeShopInfoResponse extends ShopeeBaseResponse {
  shop_name: string
  region: string
  status: 'BANNED' | 'FROZEN' | 'NORMAL'
  sip_affi_shops: SipAffiliateShopInfo[]
  is_cb: boolean
  is_cnsc: boolean
  shop_cbsc: boolean
  auth_time: number
  expire_time: number
  is_sip: boolean
}
