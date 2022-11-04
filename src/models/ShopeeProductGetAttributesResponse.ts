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