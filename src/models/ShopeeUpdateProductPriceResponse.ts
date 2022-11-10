import { ShopeeBaseResponse } from '.'


interface ShopeeUpdateProductPriceInputPrice {
  model_id?: number
  original_price: number
}

export interface ShopeeUpdateProductPriceInput {
  item_id: number
  price_list: ShopeeUpdateProductPriceInputPrice[]
}

interface ShopeeUpdateProductPriceFailure {
  model_id: number
  failed_reason: string
}


interface ShopeeUpdateProductPriceSuccess {
  model_id: number
  original_price: number
}

/**
 * @see https://open.shopee.com/documents/v2/v2.product.update_price?module=89&type=1
 *
 * Example
 * 
 * {
    "error": "",
    "message": "",
    "warning": "",
    "request_id": "aaaaaaa",
    "response": {
    "failure_list": [{
      "model_id": 3456,
      "failed_reason": "fail"
    }],
    "success_list": [{
      "model_id": 0,
      "original_price": 11.11
    }]
    }
  }
*/

export interface ShopeeUpdateProductPriceResponse extends ShopeeBaseResponse {
  error: string
  message: string
  warning: string
  request_id: string
  response: {
    failure_list: ShopeeUpdateProductPriceFailure[]
    success_list: ShopeeUpdateProductPriceSuccess[]
  }
}