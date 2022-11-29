import { ShopeeBaseResponse } from '.'

interface ShopeeCreateShippingDocumentInputOrder {
  order_sn: string
  package_number?: string
  tracking_number?: string
  shipping_document_type?: 'NORMAL_AIR_WAYBILL' | 'THERMAL_AIR_WAYBILL' | 'NORMAL_JOB_AIR_WAYBILL'| 'THERMAL_JOB_AIR_WAYBILL'
}

export interface ShopeeCreateShippingDocumentInput {
  order_list: ShopeeCreateShippingDocumentInputOrder[]
}

interface ShopeeCreateShippingDocumentResponseResult {
  order_sn: string
  package_number: string
  fail_error: string
  fail_message: string
}

export interface ShopeeCreateShippingDocumentResponse extends ShopeeBaseResponse {
  error: string
  message: string
  response: {
    result_list: ShopeeCreateShippingDocumentResponseResult[]
  }
}