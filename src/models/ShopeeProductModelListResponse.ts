import { ShopeeBaseResponse, ShopeeProductBaseInfoSellerStock } from '.'

interface ShopeeProductModelListTierVariationOptionList {
  option: string
  image: {
    image_id: string
    image_url: string
  }
}

interface ShopeeProductModelListTierVariation {
  name: string
  option_list: ShopeeProductModelListTierVariationOptionList[]
}

interface ShopeeProductModelListModelPriceInfo {
  current_price: number
  original_price: number
  inflated_price_of_current_price: number
  inflated_price_of_original_price: number
  sip_item_price?: number
  sip_item_price_source?: number
  currency?: string
}

interface ShopeeProductModelListModel {
  model_id: number
  tier_index: number[]
  promotion_id: number
  model_sku: string
  gtin_code: string
  price_info: ShopeeProductModelListModelPriceInfo[]
  pre_order: {
    is_pre_order: boolean
    days_to_ship: number
  }
  summary_info: {
    total_reserved_stock: number
    total_available_stock: number
  }
  seller_stock: ShopeeProductBaseInfoSellerStock[]
}

/**
 * Example
 *
 * ```
 * {
    "error": "",
    "message": "",
    "warning": "",
    "request_id": "b338afa23ffd3ea3d46dc0dc5998d225",
    "response": {
        "tier_variation": [
            {
                "name": "size",
                "option_list": [
                    {
                        "option": "XS"
                    },
                    {
                        "option": "S"
                    },
                    {
                        "option": "M"
                    }
                ]
            }
        ],
        "model": [
            {
                "model_id": 9182545,
                "promotion_id": 0,
                "tier_index": [
                    1
                ],
              
                "price_info": [
                    {
                        "current_price": 800,
                        "original_price": 800,
                        "inflated_price_of_current_price": 800,
                        "inflated_price_of_original_price": 800
                    }
                ],
                "model_sku": "3344",
                "pre_order": {
                    "is_pre_order": false,
                    "days_to_ship": 2
                },
                "stock_info_v2": {
                    "summary_info": {
                        "total_reserved_stock": 0,
                        "total_available_stock": 100
                    },
                    "seller_stock": [
                        {
                            "location_id": "TWZ",
                            "stock": 100
                        }
                    ]
                }
            },
            {
                "model_id": 9182546,
                "promotion_id": 0,
                "tier_index": [
                    0
                ],
                
                "price_info": [
                    {
                        "current_price": 800,
                        "original_price": 800,
                        "inflated_price_of_current_price": 800,
                        "inflated_price_of_original_price": 800
                    }
                ],
                "model_sku": "1123",
                "pre_order": {
                    "is_pre_order": false,
                    "days_to_ship": 2
                },
                "stock_info_v2": {
                    "summary_info": {
                        "total_reserved_stock": 0,
                        "total_available_stock": 100
                    },
                    "seller_stock": [
                        {
                            "location_id": "TWZ",
                            "stock": 100
                        }
                    ]
                }
            }
        ]
    }
  }
  ```
 */

export interface ShopeeProductModelListResponse extends ShopeeBaseResponse {
  warning: string
  response: {
    tier_variation: {
      option_list: ShopeeProductModelListTierVariation[]
    },
    model: ShopeeProductModelListModel
  }
}