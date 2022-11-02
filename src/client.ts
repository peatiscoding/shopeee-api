import type { AxiosInstance } from 'axios'

import axios from 'axios'
import { createHmac } from 'crypto'
import { ShopeeAccessTokenResponse } from './models'
import { ShopeeTokensStorage } from './storage'


/**
 * ShopeeOpenAPI (v2)
 */
export class ShopeeOpenApiV2Client {

  private ax: AxiosInstance
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
    this.host = env === 'prod'
      ? 'https://partner.shopeemobile.com'
      : 'https://partner.test-stable.shopeemobile.com'
    // create axios instance.
    this.ax = axios.create({
      baseURL: this.host,
    })
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

  public async getAccessToken(authorizationCode: string, shopId: string): Promise<ShopeeAccessTokenResponse> {
    const path = '/api/v2/auth/token/get'
    const body = {
      code: authorizationCode,
      shop_id: +shopId,
      partner_id: +this.partnerId,
    }
    const s = this.sign(path)
    const resp = await this.ax.post(path, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        partner_id: this.partnerId,
        timestamp: s.timest,
        sign: s.signature,
      }
    })
    if (!resp || !resp.data) {
      throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} with empty payload!`)
    }
    const resData = resp.data as ShopeeAccessTokenResponse
    if (resData.error) {
      console.warn('REQ', resp.config)
      throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} response with error: ${JSON.stringify(resData.error)}, message: ${resData.message}, resp: ${JSON.stringify(resData)}`)
    }
    if (this.storage) {
      await this.storage?.saveTokens(shopId, resData)
    }
    return resData
  }

  public async refreshToken(currentRefreshToken: string, shopId: string): Promise<ShopeeAccessTokenResponse> {
    const path = '/api/v2/auth/access_token/get'
    const body = {
      refresh_token: currentRefreshToken,
      shop_id: +shopId,
      partner_id: +this.partnerId,
    }
    const s = this.sign(path)
    const resp = await this.ax.post(path, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        partner_id: this.partnerId,
        timestamp: s.timest,
        sign: s.signature,
      }
    })
    if (!resp || !resp.data) {
      throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} with empty payload!`)
    }
    const resData = resp.data as ShopeeAccessTokenResponse
    if (resData.error) {
      console.warn('REQ', resp.config)
      throw new Error(`Invalid ShopeeAPI response, status: ${resp.status} response with error: ${JSON.stringify(resData.error)}, message: ${resData.message}, resp: ${JSON.stringify(resData)}`)
    }
    if (this.storage) {
      await this.storage?.saveTokens(shopId, resData)
    }
    return resData
  }

  private sign(path: string): { timest: string, signature: string } {
    return ShopeeOpenApiV2Client.createSignature(path, this.partnerId, this.partnerKey)
  }

  public static createSignature(path: string, partnerId: string, partnerKey: string): { timest: string, signature: string } {
    const timest = `${Math.floor(new Date().getTime() / 1000)}`
    const payload = [partnerId, path, timest].join('')
    const hmac = createHmac('sha256', partnerKey)
    const signature = hmac.update(payload).digest('hex')
    return {
      timest,
      signature,
    }
  }
}