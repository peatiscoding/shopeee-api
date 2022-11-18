import type { ShopeeTokens } from '../storage'
import type {
  AxiosInstance,
} from 'axios'

import axios from 'axios'
import { stringify } from 'querystring'
import {
  ShopeeCategoryResponse,
  ShopeeShopInfoResponse,
  ShopeeProfileInfoResponse,
  ShopeeProductGetItemListResponse,
  ShopeeProductItemStatus,
  ShopeeProductGetAttributesResponse,
  ShopeeProductItemBaseInfoResponse,
  ShopeeProductModelListResponse,
  ShopeeOrderStatus,
  ShopeeGetOrderListResponse,
  ShopeeOrdersDetailResponse,
  ShopeeUpdateProductStockResponse,
  ShopeeUpdateProductStockInput,
  ShopeeUpdateProductPriceInput,
  ShopeeUpdateProductPriceResponse,
  ShopeeGetAddressListResponse,
  ShopeeHandleBuyerCancellationInput,
  ShopeeHandleBuyerCancellationResponse,
  ShopeeCancelOrderInput,
  ShopeeCancelOrderResponse,
  ShopeeGetShippingParameterResponse,
  ShopeeShipOrderInput,
  ShopeeShipOrderResponse,
} from '../models'
import {
  createShopeeAutoRefreshHandler,
  shopeeResponseHandler,
} from './utils'
import { RequestSigner } from '../signer'

const ONE_DAY_IN_SECONDS = 86400

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
      paramsSerializer: stringify,
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
   * @param offset default is 0
   * @param pageSize 
   * @param opts.updateTimeFrom
   * @param opts.updateTimeTo
   * @param opts.itemStatus
   */
  public async getProductItemList(offset: number = 0, pageSize: number = 20, opts?: Partial<{ updateTimeFrom: number, updateTimeTo: number, itemStatus: ShopeeProductItemStatus[] }>): Promise<ShopeeProductGetItemListResponse> {
    const path = '/api/v2/product/get_item_list'
    const resp = await this.ax.get(path, {
      params: {
        offset,
        page_size: pageSize,
        ...opts?.updateTimeFrom ? { update_time_from: opts?.updateTimeFrom } : {},
        ...opts?.updateTimeTo ? { update_time_to: opts?.updateTimeTo } : {},
        item_status: opts?.itemStatus || ['NORMAL', 'UNLIST'],
      }
    })
    return resp.data as ShopeeProductGetItemListResponse
  }

  /**
   * Fetch attributes associated with given specific category.
   * 
   * @param categoryId
   * @param language 
   * @returns 
   */
  public async getProductAttributes(categoryId: number, language?: string): Promise<ShopeeProductGetAttributesResponse> {
    const path = '/api/v2/product/get_attributes'
    const resp = await this.ax.get(path, {
      params: {
        language,
        category_id: categoryId,
      }
    })
    return resp.data as ShopeeProductGetAttributesResponse
  }

  /**
   * Fetch list of Shopee product detail by productId
   * see https://open.shopee.com/documents/v2/v2.product.get_item_base_info?module=89&type=1
   * 
   * @param productIds array of productIds
   * @returns
   */
  public async getProductsItemBaseInfo(productIds: number[]): Promise<ShopeeProductItemBaseInfoResponse> {
    const path = '/api/v2/product/get_item_base_info'
    const resp = await this.ax.get(path, {
      params: {
        item_id_list: productIds.join()
      }
    })
    return resp.data as ShopeeProductItemBaseInfoResponse
  }

  /**
   * Fetch list of Shopee product detail by productId
   * see https://open.shopee.com/documents/v2/v2.product.get_model_list?module=89&type=1
   * 
   * @param productId number
   * @returns
   */
  public async getProductModelList(productId: number): Promise<ShopeeProductModelListResponse> {
    const path = '/api/v2/product/get_model_list'
    const resp = await this.ax.get(path, {
      params: {
        item_id: productId,
      }
    })
    return resp.data as ShopeeProductModelListResponse
  }


  /**
   * Fetch list of Shopee order list
   * see https://open.shopee.com/documents/v2/v2.order.get_order_list?module=94&type=1
   * 
   * @param offset
   * @param pageSize
   * @param opts.timeFrom
   * @param opts.timeTo
   * @param opts.orderStatus
   * @returns
   */
  public async getOrderList(offset: number = 0, pageSize: number = 20, opts?: Partial<{ timeRangeField: 'create_time' | 'update_time', timeFrom: number, timeTo: number, orderStatus: ShopeeOrderStatus }>): Promise<ShopeeGetOrderListResponse> {
    const path = '/api/v2/order/get_order_list'
    const resp = await this.ax.get(path, {
      params: {
        ...offset ? { cursor: `${offset}` } : {},
        page_size: pageSize,
        time_range_field: opts?.timeRangeField || 'create_time',
        time_from: opts?.timeFrom || Math.floor(new Date().getTime() / 1000) - (ONE_DAY_IN_SECONDS * 15),
        time_to: opts?.timeTo || Math.floor(new Date().getTime() / 1000),
        order_status: opts?.orderStatus || 'READY_TO_SHIP',
      }
    })
    return resp.data as ShopeeGetOrderListResponse
  }

  public async getOrdersDetail(orderSn: string[]): Promise<ShopeeOrdersDetailResponse> {
    const path = '/api/v2/order/get_order_detail'
    const resp = await this.ax.get(path, {
      params: {
        order_sn_list: orderSn.join()
      }
    })
    return resp.data as ShopeeOrdersDetailResponse
  }

  public async updateProductStock(updateProductStockInput: ShopeeUpdateProductStockInput): Promise<ShopeeUpdateProductStockResponse> {
    const path = '/api/v2/product/update_stock'
    const resp = await this.ax.post(path, updateProductStockInput)
    return resp.data as ShopeeUpdateProductStockResponse
  }

  public async updateProductPrice(updateProductPriceInput: ShopeeUpdateProductPriceInput): Promise<ShopeeUpdateProductPriceResponse> {
    const path = '/api/v2/product/update_price'
    const resp = await this.ax.post(path, updateProductPriceInput)
    return resp.data as ShopeeUpdateProductPriceResponse
  }


  /**
   * Fetch list of address of Shop
   * see https://open.shopee.com/documents/v2/v2.logistics.get_address_list?module=95&type=1
  */
  public async getAddressList(): Promise<ShopeeGetAddressListResponse> {
    const path = '/api/v2/logistics/get_address_list'
    const resp = await this.ax.get(path, {
      params: {}
    })
    return resp.data as ShopeeGetAddressListResponse
  }

  /**
   * Fetch channel list of logistic
   * see https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&type=1
  */
  public async getLogisticChannelList(): Promise<ShopeeGetAddressListResponse> {
    const path = '/api/v2/logistics/get_channel_list'
    const resp = await this.ax.get(path, {
      params: {}
    })
    return resp.data as ShopeeGetAddressListResponse
  }

  /**
   * handle buyer's cancellation application.
   * see https://open.shopee.com/documents/v2/v2.order.handle_buyer_cancellation?module=94&type=1
  */
  public async handleBuyerCancellation(handleBuyerCancellationInput: ShopeeHandleBuyerCancellationInput): Promise<ShopeeHandleBuyerCancellationResponse> {
    const path = '/api/v2/order/handle_buyer_cancellation'
    const resp = await this.ax.post(path, handleBuyerCancellationInput)
    return resp.data as ShopeeHandleBuyerCancellationResponse
  }

  /**
   * handle cancel order
   * see https://open.shopee.com/documents/v2/v2.order.cancel_order?module=94&type=1
  */
  public async cancelOrder(cancelOrderInput: ShopeeCancelOrderInput): Promise<ShopeeCancelOrderResponse> {
    const path = '/api/v2/order/cancel_order'
    const resp = await this.ax.post(path, cancelOrderInput)
    return resp.data as ShopeeHandleBuyerCancellationResponse
  }

  /**
   * handle get shipping parameter
   * see https://open.shopee.com/documents/v2/v2.logistics.get_shipping_parameter?module=95&type=1
  */
  public async getShippingParameter(orderSn: string): Promise<ShopeeGetShippingParameterResponse> {
    const path = '/api/v2/logistics/get_shipping_parameter'
    const resp = await this.ax.get(path, {
      params: {
        order_sn: orderSn,
      }
    })
    return resp.data as ShopeeGetShippingParameterResponse
  }

  /**
   * handle ship order
   * see https://open.shopee.com/documents/v2/v2.logistics.ship_order?module=95&type=1
  */
  public async shipOrder(shipOrderInput: ShopeeShipOrderInput): Promise<ShopeeShipOrderResponse> {
    const path = '/api/v2/logistics/ship_order'
    const resp = await this.ax.post(path, shipOrderInput)
    return resp.data as ShopeeShipOrderResponse
  }
}
