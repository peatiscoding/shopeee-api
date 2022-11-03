import type {
  AxiosInstance,
  AxiosResponse,
} from 'axios'

import { ShopeeBaseResponse } from '../models'
import { ShopeeTokens } from '../storage'

export const getHost = (env: 'prod' | 'sandbox') => env === 'prod'
  ? 'https://partner.shopeemobile.com'
  : 'https://partner.test-stable.shopeemobile.com'

// Handle and parse default responses from Shopee
export const shopeeResponseHandler = (resp: AxiosResponse): AxiosResponse => {
  if (!resp || !resp.data) {
    throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} with empty payload!`)
  }
  const resData = resp.data as ShopeeBaseResponse
  if (resData.error) {
    console.warn('>> REQ FAILED', resp.config.url, resp.data)
    throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} response with error: ${JSON.stringify(resData.error)}, message: ${resData.message}, resp: ${JSON.stringify(resData)}`)
  }
  return resp
}

// Detect token expired (403) and refresh it automatically.
export const createShopeeAutoRefreshHandler = (_ax: AxiosInstance, refreshAccessTokenHandler: () => Promise<ShopeeTokens>) => async (error: any): Promise<any> => {
  const originalRequest = error.config
  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true
    await refreshAccessTokenHandler()
    return _ax(originalRequest)
  }
  throw error
}
