import type { AxiosInstance, AxiosResponse } from 'axios'

import axios from 'axios'
import { createHmac } from 'crypto'
import { ShopeeTokens } from '../dist'
import {
  ShopeeBaseResponse,
  ShopeeAccessTokenResponse,
  ShopeeCategoryResponse,
  ShopeeShopInfoResponse,
  ShopeeProfileInfoResponse,
} from './models'
import { ShopeeTokensStorage } from './storage'

const getHost = (env: 'prod' | 'sandbox') => env === 'prod'
  ? 'https://partner.shopeemobile.com'
  : 'https://partner.test-stable.shopeemobile.com'

const shopeeResponseHandler = (resp: AxiosResponse): AxiosResponse => {
  if (!resp || !resp.data) {
    throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} with empty payload!`)
  }
  const resData = resp.data as ShopeeBaseResponse
  if (resData.error) {
    console.warn('>> REQ FAILED', resp.config.url)
    throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} response with error: ${JSON.stringify(resData.error)}, message: ${resData.message}, resp: ${JSON.stringify(resData)}`)
  }
  return resp
}

export class ShopContext {
  public readonly ax: AxiosInstance

  public constructor(
    public readonly host: string,
    public readonly partnerId: string,
    public readonly partnerKey: string,
    public readonly shopId: string,
    public readonly accessTokenProvider: () => ShopeeTokens | Promise<ShopeeTokens>) {
    this.ax = axios.create({
      baseURL: this.host,
    })
    this.ax.interceptors.request.use(async (config) => {
      if (config.url) {
        const path = config.url
        const s = await this.sign(path)
        config.params = config.params || {}
        config.params.partner_id = this.partnerId
        config.params.timestamp = s.timest
        config.params.access_token = s.accessToken
        config.params.shop_id = shopId
        config.params.sign = s.signature
      }
      return config
    })
    this.ax.interceptors.response.use(shopeeResponseHandler)
  }

  /**
   * List all categories provided by Shopee's service
   * 
   * @param language 
   */
  public async getCategory(language?: string): Promise<ShopeeCategoryResponse> {
    const path = '/api/v2/product/get_category'
    const resp = await this.ax.get(path, {
      params: {
        language,
      },
    })
    return resp.data as ShopeeCategoryResponse
  }

  /**
   * @see https://open.shopee.com/documents/v2/v2.shop.get_shop_info?module=92&type=1
   */
  public async getShopInfo(): Promise<ShopeeShopInfoResponse> {
    const path = '/api/v2/shop/get_shop_info'
    const resp = await this.ax.get(path)
    return resp.data as ShopeeShopInfoResponse
  }

  public async getProfileInfo(): Promise<ShopeeProfileInfoResponse> {
    const path = '/api/v2/shop/get_profile'
    const resp = await this.ax.get(path)
    return resp.data as ShopeeProfileInfoResponse
  }

  private async sign(path: string): Promise<{ timest: string, signature: string, accessToken: string }> {
    const tokens = await this.accessTokenProvider()
    if (!tokens) {
      throw new Error(`ShopeeTokens for: ${this.shopId} cannot be found. Please recheck your accessTokenProvider/storage.`)
    }
    const s = ShopeeOpenApiV2Client.createSignature(path, this.partnerId, this.partnerKey, tokens.access_token, this.shopId)
    return {
      ...s,
      accessToken: tokens.access_token,
    }
  }
}

/**
 * ShopeeOpenAPI (v2)
 */
export class ShopeeOpenApiV2Client {

  /**
   * Exposed ax instance to be used by consumer.
   */
  public readonly ax: AxiosInstance
  private readonly host: string
  private storage?: ShopeeTokensStorage

  /**
   * Create a shopeeApiInstance!
   * 
   * @param env 
   * @param partnerId 
   */
  constructor(
    public readonly env: 'sandbox' | 'prod',
    public readonly partnerId: string,
    public readonly partnerKey: string,
  ) {
    // create axios instance.
    this.host = getHost(env)
    this.ax = axios.create({
      baseURL: this.host,
    })

    // Automatically sign the request
    this.ax.interceptors.request.use((config) => {
      if (config.url) {
        const path = config.url
        const s = this.sign(path)
        config.params = config.params || {}
        config.params.partner_id = this.partnerId
        config.params.timestamp = s.timest
        config.params.sign = s.signature
      }
      return config
    })
    this.ax.interceptors.response.use(shopeeResponseHandler)
  }

  public setStorage(storage: ShopeeTokensStorage) {
    this.storage = storage
  }

  /**
   * Create authorization link to login.
   * @param redirectUrl a target URL to intercept authorizeCode
   */
  public getAuthorizationLink(redirectUrl: string): string {
    const path = '/api/v2/shop/auth_partner'
    const s = this.sign(path)
    const url = new URL(path, this.host)
    url.searchParams.append('partner_id', this.partnerId)
    url.searchParams.append('timestamp', s.timest)
    url.searchParams.append('sign', s.signature)
    url.searchParams.append('redirect', redirectUrl)
    return url.toString()
  }

  /**
   * Use this API to exchange authorizeCode for accessToken + refreshToken
   *
   * @param authorizationCode 
   * @param shopId 
   * @returns 
   */
  public async getAccessToken(authorizationCode: string, shopId: string): Promise<ShopeeAccessTokenResponse> {
    const path = '/api/v2/auth/token/get'
    const resp = await this.ax.post(path, {
      code: authorizationCode,
      shop_id: +shopId,
      partner_id: +this.partnerId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resData = resp.data as ShopeeAccessTokenResponse
    if (this.storage) {
      await this.storage?.saveTokens(shopId, resData)
    }
    return resData
  }

  /**
   * Use this API to exchange about to expired refreshToken for new accessToken + refreshToken
   *
   * @param currentRefreshToken 
   * @param shopId 
   * @returns 
   */
  public async refreshToken(currentRefreshToken: string, shopId: string): Promise<ShopeeAccessTokenResponse> {
    const path = '/api/v2/auth/access_token/get'
    const resp = await this.ax.post(path, {
      refresh_token: currentRefreshToken,
      shop_id: +shopId,
      partner_id: +this.partnerId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resData = resp.data as ShopeeAccessTokenResponse
    if (this.storage) {
      await this.storage?.saveTokens(shopId, resData)
    }
    return resData
  }

  /**
   * Create a context from staticAccessToken
   * 
   * @param staticTokens 
   * @param shopId 
   * @returns 
   */
  public createContext(staticTokens: ShopeeTokens, shopId: string): ShopContext {
    return new ShopContext(
      this.host,
      this.partnerId,
      this.partnerKey,
      shopId,
      () => staticTokens,
    )
  }

  /**
   * Create a context by provide the static accessToken!
   * 
   * @param shopId 
   * @returns 
   */
  public createContextFromStorage(shopId: string): ShopContext {
    return new ShopContext(
      this.host,
      this.partnerId,
      this.partnerKey,
      shopId,
      async () => {
        const tokens = await this.storage?.loadTokens(shopId)
        if (!tokens) {
          throw new Error(`No token cannot be found for: ${shopId}`)
        }
        return tokens
      },
    )
  }

  private sign(path: string): { timest: string, signature: string } {
    return ShopeeOpenApiV2Client.createSignature(path, this.partnerId, this.partnerKey)
  }

  public static createSignature(path: string, partnerId: string, partnerKey: string, accessToken?: string, shopId?: string): { timest: string, signature: string, accessToken?: string } {
    const timest = `${Math.floor(new Date().getTime() / 1000)}`
    const payload = [partnerId, path, timest, accessToken || '', shopId || ''].join('')
    const hmac = createHmac('sha256', partnerKey)
    const signature = hmac.update(payload).digest('hex')
    return {
      timest,
      signature,
      accessToken,
    }
  }
}