import { ShopeeBaseResponse } from '.'

export type ShopeeProductAttributeInputValidationType = 'INT_TYPE' | 'STRING_TYPE' | 'ENUM_TYPE' | 'FLOAT_TYPE' | 'DATE_TYPE' | 'TIMESTAMP_TYPE'
export type ShopeeProductAttributeFormatType = 'NORMAL' | 'QUANTITATIVE'
export type ShopeeProductAttributeDateFormatType = 'YEAR_MONTH_DATE' | 'YEAR_MONTH'
export type ShopeeProductAttributeInputType = 'DROP_DOWN' | 'MULTIPLE_SELECT' | 'TEXT_FILED' | 'COMBO_BOX' | 'MULTIPLE_SELECT_COMBO_BOX'

export interface ShopeeProductAttributeBrand {
  parent_brand_id: number
}

export interface ShopeeProductAttributeParentAttribute {
  parent_attribute_id: number
  parent_value_id: number
}

export interface ShopeeProductAttributeValue {
  value_id: number
  original_value_name: string
  display_value_name: string
  value_unit: string
  parent_attribute_list: ShopeeProductAttributeParentAttribute[]
  parent_brand_list: ShopeeProductAttributeBrand[]
}

export interface ShopeeProductAttribute {
  attribute_id: number
  original_attribute_name: string
  display_attribute_name: string
  is_mandatory: boolean
  input_validation_type: ShopeeProductAttributeInputValidationType
  format_type: ShopeeProductAttributeFormatType
  date_format_type: ShopeeProductAttributeDateFormatType
  input_type: ShopeeProductAttributeInputType
  attribute_unit: string[]
  attribute_value_list: ShopeeProductAttributeValue[]
  max_input_value_number: number
}

interface ShopeeProductBaseInfoDescriptionFieldList {
  field_type: string
  text?: string
  image_info?: {
    image_id: string
    image_url: string
  }
}
interface ShopeeProductBaseInfoLogisticInfo {
  logistic_id: number
  logistic_name: string
  enabled: boolean
  shipping_fee: number
  is_free: boolean
}
interface ShopeeProductBaseInfoAttributeValue {
  value_id: number
  original_value_name: string
  value_unit: string
}

interface ShopeeProductBaseInfoSellerStock {
  location_id: string
  stock: number
}

interface ShopeeProductBaseInfoPriceInfo {
  currency: string
  original_price: number
  current_price: number
}

interface ShopeeProductBaseInfoAttribute {
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
 * @see https://open.shopee.com/documents/v2/v2.product.get_attributes?module=89&type=1
 * 
 * Example Payload
 * 
 * ```json
 * {
 *   "error": "",
 *   "message": "",
 *   "warning": "",
 *   "request_id": "159ef3b9216fd3e799a4db4453c22720",
 *   "response": {
 *     "attribute_list": [
 *        {
 *         "attribute_id": 100002,
 *          "original_attribute_name": "Aquarium Decoration Type",
 *          "display_attribute_name": "Aquarium Decoration Type",
 *          "is_mandatory": false,
 *          "input_validation_type": "STRING_TYPE",
 *          "format_type": "NORMAL",
 *          "date_format_type": "YEAR_MONTH_DATE",
 *          "input_type": "COMBO_BOX",
 *          "attribute_unit": [],
 *          "attribute_value_list": [],
 *          "max_input_value_number": 1
 *        }
 *     ]
 *   }
 * },
 * ```
 */
export interface ShopeeProductGetAttributesResponse extends ShopeeBaseResponse {
  warning: string
  response: {
    attribute_list: ShopeeProductAttribute[]
  }
}

export interface ShopeeProductItemBaseInfoResponse extends ShopeeBaseResponse {
  warning: string
  response: {
    item_list: ShopeeProductBaseInfo[]
  }
}