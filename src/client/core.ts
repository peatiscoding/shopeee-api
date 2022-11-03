import type { AxiosInstance } from 'axios'

import axios from 'axios'
import {
  ShopeeAccessTokenResponse,
} from '../models'
import { RequestSigner } from '../signer'
import {
  InMemoryTokenStorage,
  ShopeeTokens,
  ShopeeTokensStorage,
} from '../storage'
import { ShopContext } from './ShopContext'
import {
  getHost,
  shopeeResponseHandler,
} from './utils'

/**
 * ShopeeOpenAPI (v2)
 */
export class ShopeeOpenApiV2Client {

  /**
   * Exposed ax instance to be used by consumer.
   */
  public readonly ax: AxiosInstance
  private readonly host: string
  private signer: RequestSigner

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
    storage?: ShopeeTokensStorage,
  ) {
    // create axios instance.
    this.host = getHost(env)
    this.ax = axios.create({
      baseURL: this.host,
    })

    this.signer = new RequestSigner(
      storage ?? new InMemoryTokenStorage(),
      this.partnerId,
      this.partnerKey,
    )

    // Automatically sign the request
    this.ax.interceptors.request.use(this.signer.interceptor())
    this.ax.interceptors.response.use(shopeeResponseHandler)
  }

  public setStorage(storage: ShopeeTokensStorage) {
    this.signer.storage = storage
  }

  /**
   * Create authorization link to login.
   * @param redirectUrl a target URL to intercept authorizeCode
   */
  public getAuthorizationLink(redirectUrl: string): string {
    const path = '/api/v2/shop/auth_partner'
    const s = this.signer.signNoAccessToken(path)
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
    this.signer.storage.saveTokens(shopId, resData)
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
    await this.signer.storage.saveTokens(shopId, resData)
    return resData
  }

  /**
   * Create a context by the Token within the storage.
   * 
   * @param shopId 
   * @returns 
   */
  public createShopContext(shopId: string): ShopContext {
    return new ShopContext(
      this.host,
      shopId,
      this.signer.withShopId(shopId),
      async () => {
        return this.signer.storage.loadTokens(shopId)
          .then((tokens) => {
            if (!tokens) {
              throw new Error(`Unable to load tokens for refresh. ${shopId}`)
            }
            return this.refreshToken(tokens.refresh_token, shopId)
          })
      },
    )
  }
}