import type { ShopeeTokens } from '../storage'
import type {
  AxiosInstance,
} from 'axios'

import axios from 'axios'
import {
  ShopeeCategoryResponse,
  ShopeeShopInfoResponse,
  ShopeeProfileInfoResponse,
  ShopeeProductGetItemListResponse,
  ShopeeProductItemStatus,
} from '../models'
import {
  createShopeeAutoRefreshHandler,
  shopeeResponseHandler,
} from './utils'
import { RequestSigner } from '../signer'

export class ShopContext {
  public readonly ax: AxiosInstance

  public constructor(
    public readonly host: string,
    public readonly shopId: string,
    public readonly signer: RequestSigner,
    public readonly refresher: () => Promise<ShopeeTokens>,
  ) {
    this.ax = axios.create({
      baseURL: this.host,
    })
    this.ax.interceptors.request.use(signer.interceptor())
    this.ax.interceptors.response.use(
      shopeeResponseHandler,
      createShopeeAutoRefreshHandler(this.ax, refresher),
    )
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
   * Fetch Shop's Info
   * 
   * @see https://open.shopee.com/documents/v2/v2.shop.get_shop_info?module=92&type=1
   */
  public async getShopInfo(): Promise<ShopeeShopInfoResponse> {
    const path = '/api/v2/shop/get_shop_info'
    const resp = await this.ax.get(path)
    return resp.data as ShopeeShopInfoResponse
  }

  /**
   * Fetch Shop's Profile Info
   * 
   * @see https://open.shopee.com/documents/v2/v2.shop.get_profile?module=92&type=1
   */
  public async getProfileInfo(): Promise<ShopeeProfileInfoResponse> {
    const path = '/api/v2/shop/get_profile'
    const resp = await this.ax.get(path)
    return resp.data as ShopeeProfileInfoResponse
  }

  /**
   * Fetch product item id from Shopee
   * 
   * @see https://open.shopee.com/documents/v2/v2.product.get_item_list?module=89&type=1
   * 
   * @param pageSize 
   * @param offset default is 0
   * @param opts.updateTimeFrom
   * @param opts.updateTimeTo
   * @param opts.itemStatus
   */
  public async getProductItemList(pageSize: number = 20, offset: number = 0, opts?: Partial<{ updateTimeFrom: number, updateTimeTo: number, itemStatus: ShopeeProductItemStatus[] }>): Promise<ShopeeProductGetItemListResponse> {
    const path = '/api/v2/product/get_item_list'
    const resp = await this.ax.get(path, {
      params: {
        offset,
        page_size: pageSize,
        update_time_from: opts?.updateTimeFrom,
        update_time_to: opts?.updateTimeTo,
        item_status: opts?.itemStatus || ['NORMAL'],
      }
    })
    return resp.data as ShopeeProductGetItemListResponse
  }
}
