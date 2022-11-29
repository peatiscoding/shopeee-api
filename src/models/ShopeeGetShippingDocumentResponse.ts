import { ShopeeBaseResponse } from '.'

interface ShopeeGetShippingDocumentOrder {
  order_sn: string
  package_number?: string
}

export interface ShopeeGetShippingDocumentInput {
  order_list: ShopeeGetShippingDocumentOrder[]
}

interface ShopeeGetShippingDocumentResult {
  order_sn: string
  package_number: string
  suggest_shipping_document_type: string
  selectable_shipping_document_type: string[]
  fail_error: string
  fail_message: string
}

export interface ShopeeGetShippingDocumentResponse extends ShopeeBaseResponse {
  error: string
  message: string
  response: {
    result_list: ShopeeGetShippingDocumentResult[]
  }
}