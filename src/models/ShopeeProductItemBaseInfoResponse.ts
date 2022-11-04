import { ShopeeBaseResponse } from '.'

export interface ShopeeProductBaseInfoDescriptionFieldList {
  field_type: string
  text?: string
  image_info?: {
    image_id: string
    image_url: string
  }
}

export interface ShopeeProductBaseInfoLogisticInfo {
  logistic_id: number
  logistic_name: string
  enabled: boolean
  shipping_fee: number
  is_free: boolean
}

export interface ShopeeProductBaseInfoAttributeValue {
  value_id: number
  original_value_name: string
  value_unit: string
}

export interface ShopeeProductBaseInfoSellerStock {
  location_id: string
  stock: number
}

export interface ShopeeProductBaseInfoPriceInfo {
  currency: string
  original_price: number
  current_price: number
}

export interface ShopeeProductBaseInfoAttribute {
  attribute_id: number
  original_attribute_name: number
  is_mandatory: boolean
  attribute_value_list: ShopeeProductBaseInfoAttributeValue[]
}

export interface ShopeeProductBaseInfo {
  item_id: number
  category_id: number
  item_name: string
  item_sku: string
  create_time: number
  update_time: number
  attribute_list: ShopeeProductBaseInfoAttribute[]
  price_info: ShopeeProductBaseInfoPriceInfo[]
  stock_info_v2: {
    summary_info: {
      total_reserved_stock: number
      total_available_stock: number
    }
    seller_stock: ShopeeProductBaseInfoSellerStock[]
  }
  image: {
    image_url_list: string[]
    image_id_list: string[]
  }
  weight: string
  dimension: {
    package_length: number
    package_width: number
    package_height: number
  }
  logistic_info: ShopeeProductBaseInfoLogisticInfo[]
  pre_order: {
    is_pre_order: boolean
    days_to_ship: number
  }
  condition: string
  size_chart: string
  item_status: string
  has_model: boolean
  promotion_id: number
  brand?: {
    brand_id: number
    original_brand_name: string
  }
  tax_info: {
    ncm: number
    same_state_cfop: number
    diff_state_cfop: number
    csosn: number
    origin: number
  }
  description_type: string
  description_info: {
    extended_description: {
      field_list: ShopeeProductBaseInfoDescriptionFieldList[]
    }
  }
}

/**
 * Example
 *
 * ```
 * {
    "error": "",
    "message": "",
    "warning": "Normal_stock will be offline under Oct 15th, please switch to a new field seller_stock as soon as possible.",
    "request_id": "249c3b5cb1f699ebac6e52c787435b20",
    "response": {
      "item_list": [
        {
          "item_id": 1830743,
          "category_id": 101941,
          "item_name": "ปุ่มเทสบนคีย์บอร์ดสีแดง",
          "item_sku": "",
          "create_time": 1667524089,
          "update_time": 1667524089,
          "price_info": [
            {
              "currency": "THB",
              "original_price": 551,
              "current_price": 551
            }
          ],
          "stock_info": [
            {
              "stock_type": 2,
              "current_stock": 30,
              "normal_stock": 30,
              "reserved_stock": 0
            }
          ],
          "image": {
            "image_url_list": [
              "https://cf.shopee.co.th/file/74a228cdbecc3050b8198e0610bd9038"
            ],
            "image_id_list": [
              "74a228cdbecc3050b8198e0610bd9038"
            ]
          },
          "weight": "0.200",
          "dimension": {
            "package_length": 10,
            "package_width": 10,
            "package_height": 10
          },
          "logistic_info": [
            {
              "logistic_id": 70020,
              "logistic_name": "DHL Domestic",
              "enabled": true,
              "is_free": false,
              "estimated_shipping_fee": 20
            },
            {
              "logistic_id": 70023,
              "logistic_name": "Best Express",
              "enabled": false,
              "is_free": false,
              "estimated_shipping_fee": 20
            }
          ],
          "pre_order": {
            "is_pre_order": false,
            "days_to_ship": 2
          },
          "condition": "NEW",
          "size_chart": "",
          "item_status": "NORMAL",
          "has_model": false,
          "promotion_id": 0,
          "brand": {
            "brand_id": 0,
            "original_brand_name": "NoBrand"
          },
          "item_dangerous": 0,
          "description_info": {
            "extended_description": {
              "field_list": [
                {
                  "field_type": "text",
                  "text": "ปุ่มบน Keyboard สีแดงคำว่า \"Test\""
                }
              ]
            }
          },
          "description_type": "extended",
          "stock_info_v2": {
            "summary_info": {
              "total_reserved_stock": 0,
              "total_available_stock": 30
            },
            "seller_stock": [
              {
                "location_id": "",
                "stock": 30
              }
            ],
            "shopee_stock": [
              {
                "location_id": "",
                "stock": 0
              }
            ]
          }
        },
        {
          "item_id": 1830497,
          "category_id": 102057,
          "item_name": "Tobolone Peak สุดที่ปลายเขา",
          "item_sku": "",
          "create_time": 1667488380,
          "update_time": 1667488380,
          "image": {
            "image_url_list": [
              "https://cf.shopee.co.th/file/2b3a62ca1212d0feb36f897e7c618734"
            ],
            "image_id_list": [
              "2b3a62ca1212d0feb36f897e7c618734"
            ]
          },
          "weight": "0.300",
          "dimension": {
            "package_length": 30,
            "package_width": 15,
            "package_height": 30
          },
          "logistic_info": [
            {
              "logistic_id": 70020,
              "logistic_name": "DHL Domestic",
              "enabled": true,
              "is_free": false,
              "estimated_shipping_fee": 20
            },
            {
              "logistic_id": 70023,
              "logistic_name": "Best Express",
              "enabled": false,
              "is_free": false,
              "estimated_shipping_fee": 20
            }
          ],
          "pre_order": {
            "is_pre_order": false,
            "days_to_ship": 2
          },
          "condition": "NEW",
          "size_chart": "",
          "item_status": "NORMAL",
          "has_model": true,
          "brand": {
            "brand_id": 0,
            "original_brand_name": "NoBrand"
          },
          "item_dangerous": 0,
          "description_info": {
            "extended_description": {
              "field_list": [
                {
                  "field_type": "text",
                  "text": "เพิ่มน้ำหนักเป็น 10ๆ  เท่าแค่กินเยอะๆ"
                }
              ]
            }
          },
          "description_type": "extended"
        }
      ]
    }
  }
  ```
 */
export interface ShopeeProductItemBaseInfoResponse extends ShopeeBaseResponse {
  warning: string
  response: {
    item_list: ShopeeProductBaseInfo[]
  }
}