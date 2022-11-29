import { ShopeeBaseResponse } from '.'

interface ShopeeGetShippingDocumentResultOrder {
  order_sn: string
  package_number?: string
  shipping_document_type?: string
}

export interface ShopeeGetShippingDocumentResultInput {
  order_list: ShopeeGetShippingDocumentResultOrder[]
}

interface ShopeeGetShippingDocumentResultData {
  order_sn: string
  package_number: string
  status: string
  fail_error: string
  fail_message: string
}

export interface ShopeeGetShippingDocumentResultResponse extends ShopeeBaseResponse {
  error: string
  message: string
  response: {
    result_list: ShopeeGetShippingDocumentResultData[]
  }
}