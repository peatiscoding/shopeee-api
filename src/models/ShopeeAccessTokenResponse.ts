import { ShopeeBaseResponse } from '.'

export interface ShopeeAccessTokenResponse extends ShopeeBaseResponse {
  refresh_token: string
  access_token: string
  expire_in: number
  merchant_id_list?: number[]
  shop_id_list?: number[]
}