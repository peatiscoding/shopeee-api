import { ShopeeBaseResponse } from '.'

interface ShopeeGetAddressListAddress {
  address_id: number
  region: string
  state: string
  city: string
  address: string
  zipcode: string
  district: string
  town: string
  address_type: "DEFAULT_ADDRESS" | "PICK_UP_ADDRESS" | "RETURN_ADDRESS"
}


/**
 * @see https://open.shopee.com/documents/v2/v2.logistics.get_address_list?module=95&type=1
 * 
 * Example Payload
 * 
 * ```json
 {
    "error": "",
    "message": "",
    "response": {
        "show_pickup_address": false,
        "address_list": [
            {
                "address_id": 1173,
                "region": "TH",
                "state": "จังหวัดกาฬสินธุ์",
                "city": "อำเภอห้วยผึ้ง",
                "address": "unit 1, building 2",
                "zipcode": "46240",
                "district": "",
                "town": "",
                "address_type": []
            },
            {
                "address_id": 1191,
                "region": "TH",
                "state": "จังหวัดชลบุรี",
                "city": "อำเภอเกาะสีชัง",
                "address": "unit 123",
                "zipcode": "20120",
                "district": "",
                "town": "",
                "address_type": [
                    "PICK_UP_ADDRESS",
                    "RETURN_ADDRESS"
                ]
            },
            {
                "address_id": 1238,
                "region": "TH",
                "state": "จังหวัดชลบุรี",
                "city": "อำเภอพานทอง",
                "address": "2312312313",
                "zipcode": "12323",
                "district": "",
                "town": "",
                "address_type": []
            }
        ]
    },
    "request_id": "675015f4f59943a39f2f69c22da431f8"
}
 * ```
 */
export interface ShopeeGetAddressListResponse extends ShopeeBaseResponse {
  error: string
  message: string
  response: {
    show_pickup_address: boolean
    address_list: ShopeeGetAddressListAddress[]
  }
}