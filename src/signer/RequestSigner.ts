import type { AxiosRequestConfig } from 'axios'
import type { ShopeeTokensStorage } from '../storage'

import { createHmac } from 'crypto'

/**
 * A Class that handle request signing operation
 */
export class RequestSigner {
  constructor(
    public storage: ShopeeTokensStorage,
    public readonly partnerId: string,
    public readonly partnerKey: string,
    public readonly shopId: string = '',
  ) {
  }

  /**
   * Create the AxiosRequestConfigInterceptor
   */
  public interceptor() {
    return async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
      if (config.url) {
        let path = config.url
        if (config.baseURL) {
          path = path.replace(`${config.baseURL}`, '')
        }
        const s = await this.sign(path)
        config.params = config.params || {}
        config.params.partner_id = this.partnerId
        config.params.timestamp = s.timest
        if (this.shopId) {
          config.params.access_token = s.accessToken
          config.params.shop_id = this.shopId
        }
        config.params.sign = s.signature
      }
      return config
    }
  }

  /**
   * Create new RequestSigner with specific shopId.
   * 
   * @param shopId 
   * @returns 
   */
  public withShopId(shopId: string): RequestSigner {
    return new RequestSigner(
      this.storage,
      this.partnerId,
      this.partnerKey,
      shopId,
    )
  }

  public signNoAccessToken(path: string): { timest: string, signature: string } {
    return createSignature(path, this.partnerId, this.partnerKey)
  }

  public async sign(path: string): Promise<{ timest: string, signature: string, accessToken?: string }> {
    if (!this.shopId) {
      // console.info(`SIGN ${path}`)
      return createSignature(path, this.partnerId, this.partnerKey)
    }
    const tokens = await this.storage.loadTokens(this.shopId)
    // console.info(`SIGN ${path} (shopId=${this.shopId}, token=${tokens?.access_token})`)
    if (!tokens) {
      throw new Error(`ShopeeTokens for: ${this.shopId} cannot be found. Please recheck your accessTokenProvider/storage.`)
    }
    const s = createSignature(path, this.partnerId, this.partnerKey, tokens.access_token, this.shopId)
    return {
      ...s,
      accessToken: tokens.access_token,
    }
  }
}

export const createSignature = (path: string, partnerId: string, partnerKey: string, accessToken?: string, shopId?: string): { timest: string, signature: string, accessToken?: string } => {
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