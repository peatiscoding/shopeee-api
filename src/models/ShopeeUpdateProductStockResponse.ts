import { ShopeeBaseResponse } from '.'


interface ShopeeUpdateProductStockInputSellerStock {
  location_id?: string,
  stock: number
}


interface ShopeeUpdateProductStockInputStock {
  model_id?: number
  seller_stock: ShopeeUpdateProductStockInputSellerStock[]
}

export interface ShopeeUpdateProductStockInput {
  item_id: number
  stock_list: ShopeeUpdateProductStockInputStock[]
}

interface ShopeeUpdateProductStockFailure {
  model_id: number
  failed_reason: string
}


interface ShopeeUpdateProductStockSuccess {
  model_id: number
  location_id: string
  stock: number
}

/**
 * @see https://open.shopee.com/documents/v2/v2.product.update_stock?module=89&type=1
 *
 * Example
 * 
 * {
  "error": "-",
  "message": "-",
  "warning": "-",
  "request_id": "-",
  "response": {
    "failure_list": [
      {
        "model_id": 0,
        "failed_reason": "-"
      }
    ],
    "success_list": [
      {
        "model_id": 0,
        "location_id": "-",
        "stock": 0
      }
    ]
  }
}
*/

export interface ShopeeUpdateProductStockResponse extends ShopeeBaseResponse {
  error: string
  message: string
  warning: string
  request_id: string
  response: {
    failure_list: ShopeeUpdateProductStockFailure[]
    success_list: ShopeeUpdateProductStockSuccess[]
  }
}