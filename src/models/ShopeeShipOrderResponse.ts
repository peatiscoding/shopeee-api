import { ShopeeBaseResponse } from '.'

interface ShopeeShipOrderPickup {
  address_id?: number
  pickup_time_id?: string
  tracking_number?: string
}

interface ShopeeShipOrderDropOff {
  branch_id?: number
  sender_real_name?: string
  tracking_number?: string
  slug?: string
}

interface ShopeeShipOrderNonIntegrated {
  tracking_numbe?: string
}



export interface ShopeeShipOrderInput {
  order_sn: string
  package_number?: string
  pickup?: ShopeeShipOrderPickup
  dropoff?: ShopeeShipOrderDropOff
  non_integrated?: ShopeeShipOrderNonIntegrated
}

export interface ShopeeShipOrderResponse extends ShopeeBaseResponse {
  request_id: string
  error: string
  message: string
}