import { ShopeeBaseResponse } from '.'

export type  OrderDetailResponeOptionalFields = 'buyer_user_id' | 'buyer_username' | 'estimated_shipping_fee' | 'recipient_address' | 'actual_shipping_fee' | 'goods_to_declare' | 'note' | 'note_update_time' | 'item_list' | 'pay_time' | 'dropshipper' | 'dropshipper_phone' | 'split_up' | 'buyer_cancel_reason' | 'cancel_by' | 'cancel_reason' | 'actual_shipping_fee_confirmed' | 'buyer_cpf_id' |
  'fulfillment_flag' | 'pickup_done_time' | 'package_list' | 'shipping_carrier' | 'payment_method' | 'total_amount' | 'buyer_username' | 'invoice_data' | 'checkout_shipping_carrier' | 'reverse_shipping_fee' | 'order_chargeable_weight_gram' | 'edt' | 'prescription_images' | 'prescription_check_status'
interface ShopeeOrderInvoice {
  number: string
  series_number: string
  access_key: string
  issue_date: number
  total_value: number
  products_total_value: number
  tax_code: string
}

interface ShopeeOrderPackageItem {
  item_id: number
  model_id: number
  model_quantity: number
}

interface ShopeeOrderPackage {
  package_number: string
  logistics_status: string
  shipping_carrier: string
  parcel_chargeable_weight_gram: number
  item_list: ShopeeOrderPackageItem[]
}

interface ShopeeOrderItem {
  item_id: number
  item_name: string
  item_sku: string
  model_id: number
  model_name: string
  model_sku: string
  model_quantity_purchased: number
  model_original_price: number
  model_discounted_price: number
  wholesale: boolean
  weight: number
  add_on_deal: boolean
  main_item: boolean
  add_on_deal_id: number
  promotion_type: string
  promotion_id: number
  order_item_id: number
  promotion_group_id: number
  image_info: {
    image_url: string
    product_location_id: string[]
  }
}

interface ShopeeOrderRecipientAddress {
  name: string
  phone: string
  town: string
  district: string
  city: string
  state: string
  region: string
  zipcode: string
  full_address: string

}

interface ShopeeOrder {
  order_sn: string
  region: string
  currency: string
  cod: boolean
  total_amount: number
  order_status: string
  shipping_carrie: string
  payment_method: string
  estimated_shipping_fee: number
  message_to_seller: string
  create_time: number
  update_time: number
  days_to_ship: number
  ship_by_date: number
  buyer_user_id: number
  buyer_username: number
  actual_shipping_fee: number
  goods_to_declare: boolean
  note: string
  note_update_time: number
  recipient_address: ShopeeOrderRecipientAddress
  item_list: ShopeeOrderItem
  pay_time: number
  dropshipper: string
  dropshipper_phone: string
  split_up: boolean
  buyer_cancel_reason: string
  cancel_by: string
  cancel_reason: string
  actual_shipping_fee_confirmed: boolean
  buyer_cpf_id: string
  fulfillment_flag: string
  pickup_done_time: number
  package_list: ShopeeOrderPackage[]
  invoice_data: ShopeeOrderInvoice
  checkout_shipping_carrier: string
  reverse_shipping_fee: number
  order_chargeable_weight_gram: number
  edt_from: number
  edt_to: number
  prescription_images: string[]
  prescription_check_status: number
}

/**
 * Example
 *
 * ```
 * {
    "error": "",
    "message": "",
    "response": {
        "order_list": [
            {
                " checkout_shipping_carrier": null,
                " reverse_shipping_fee.": null,
                "actual_shipping_fee ": null,
                "actual_shipping_fee_confirmed": false,
                "buyer_cancel_reason": "",
                "buyer_cpf_id": null,
                "buyer_user_id": 258065,
                "buyer_username": "drcbuy_uat_sg_1",
                "cancel_by": "",
                "cancel_reason": "",
                "cod": false,
                "create_time": 1632973421,
                "currency": "SGD",
                "days_to_ship": 3,
                "dropshipper": "",
                "dropshipper_phone": "",
                "estimated_shipping_fee": 3.99,
                "fulfillment_flag": "fulfilled_by_local_seller",
                "goods_to_declare": false,
                "invoice_data": null,
                "item_list": [
                    {
                        "item_id": 101513055,
                        "item_name": "Vitamin Bottles - Acc",
                        "item_sku": "",
                        "model_id": 0,
                        "model_name": "",
                        "model_sku": "",
                        "model_quantity_purchased": 1,
                        "model_original_price": 3000,
                        "model_discounted_price": 3000,
                        "wholesale": false,
                        "weight": 0.3,
                        "add_on_deal": false,
                        "main_item": false,
                        "add_on_deal_id": 0,
                        "promotion_type": "",
                        "promotion_id": 0,
                        "order_item_id": 101513055,
                        "promotion_group_id": 0,
                        "image_info": {
                            "image_url": "https://cf.shopee.sg/file/fe05b113170c5e97ed515cf0f2fb9c0e_tn"
                        },
                        "product_location_id": ["IDL", "IDG"]
                    }
                ],
                "message_to_seller": "",
                "note": "",
                "note_update_time": 0,
                "order_sn": "210930KJDNF06T",
                "order_status": "COMPLETED",
                "package_list": [
                    {
                        "package_number": "OFG86672620092786",
                        "logistics_status": "LOGISTICS_DELIVERY_DONE",
                        "shipping_carrier": "Singpost POPstation - LPS (seller)",
                        "item_list": [
                            {
                                "item_id": 101513055,
                                "model_id": 0，
                                "model_quantity": 1
                            }
                        ]
                    }
                ],
                "pay_time": 1632973437,
                "payment_method": "Credit/Debit Card",
                "pickup_done_time": 1632973711,
                "recipient_address": {
                    "name": "Buyer",
                    "phone": "******10",
                    "town": "",
                    "district": "",
                    "city": "",
                    "state": "",
                    "region": "SG",
                    "zipcode": "820116",
                    "full_address": "BLOCK 116, EDGEFIELD PLAINS, #05-334, SG, 820116"
                },
                "region": "SG",
                "reverse_shipping_fee": 0,
                "ship_by_date": 1633405439,
                "shipping_carrier": "Singpost POPstation - LPS (seller)",
                "split_up": false,
                "total_amount": 2988.99,
                "update_time": 1633001809
            }
        ]
    },
    "request_id": "971b45d6a002bfc680019320c9a685a0"
}
  ```
 */

export interface ShopeeOrdersDetailResponse extends ShopeeBaseResponse {
  request_id: string
  error: string
  response: {
    order_list: ShopeeOrder[]
  }
}