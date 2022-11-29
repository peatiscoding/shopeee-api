import { ShopeeBaseResponse } from '.'

interface ShopeeDownloadShippingDocumentOrder {
  order_sn: string
  package_number?: string
}

export interface ShopeeDownloadShippingDocumentInput {
  shipping_document_type?: 'NORMAL_AIR_WAYBILL' | 'THERMAL_AIR_WAYBILL' | 'NORMAL_JOB_AIR_WAYBILL' | 'THERMAL_JOB_AIR_WAYBILL'
  order_list: ShopeeDownloadShippingDocumentOrder[]
}


export interface ShopeeDownloadShippingDocumentResponse extends ShopeeBaseResponse {
  waybill: Blob
}