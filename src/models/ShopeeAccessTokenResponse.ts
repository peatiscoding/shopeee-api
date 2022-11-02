export interface ShopeeAccessTokenResponse {
  request_id: string
  error?: string
  refresh_token: string
  access_token: string
  expire_in: number
  message: string
  merchant_id_list?: number[]
  shop_id_list?: number[]
}