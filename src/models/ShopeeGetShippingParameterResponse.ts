import { ShopeeBaseResponse } from '.'

interface ShopeeGetShippingParameterTimeSlot {
  date: number
  time_text: string
  pickup_time_id: string
}

interface ShopeeGetShippingParameterAddress {
  address_id: number
  region: string
  state: string
  city: string
  district: string
  town: string
  address: string
  zipcode: string
  address_flag: string
  time_slot_list: ShopeeGetShippingParameterTimeSlot[]
}

interface ShopeeGetShippingParameterPickup {
  address_list: ShopeeGetShippingParameterAddress[]
}

interface ShopeeGetShippingParameterSlug {
  slug: string
  slug_name: string
}

interface ShopeeGetShippingParameterBranch {
  branch_id: number
  region: string
  state: string
  city: string
  address: string
  zipcode: string
  district: string
  town: string
}

interface ShopeeGetShippingParameterInfo {
  dropoff: string[]
  pickup: string[]
  non_integrated: string[]
}

interface ShopeeGetShippingParameterDropoff {
  branch_list: ShopeeGetShippingParameterBranch[]
  slug_list: ShopeeGetShippingParameterSlug[]
}

export interface ShopeeGetShippingParameterResponse extends ShopeeBaseResponse {
  request_id: string
  message: string
  error?: string
  response: {
    info_needed: ShopeeGetShippingParameterInfo
    dropoff: ShopeeGetShippingParameterDropoff
    pickup: ShopeeGetShippingParameterPickup
  }
}