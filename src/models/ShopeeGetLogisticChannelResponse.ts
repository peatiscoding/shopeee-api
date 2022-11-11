import { ShopeeBaseResponse } from '.'


interface ShopeeGetLogisticChannelChannel{

}

/**
 * @see https://open.shopee.com/documents/v2/v2.logistics.get_channel_list?module=95&type=1
 * 
 * Example Payload
 * 
 * ```json
 *  {
    "error": "",
    "message": "",
    "response": {
        "logistics_channel_list": [
            {
                "logistics_channel_id":30014,
                "logistics_channel_name":"OK Mart",
                "cod_enabled":true,
                "enabled":true,
                "fee_type":"FIXED_DEFAULT_PRICE",
                "size_list":[

                ],
                "weight_limit":{
                    "item_max_weight":0,
                    "item_min_weight":0
                },
                "item_max_dimension":{
                    "height":0,
                    "width":0,
                    "length":0,
                    "unit":"",
                    "dimension_sum":0
                },
                "preferred":false,
                "force_enable":false,
                "mask_channel_id":0,
                "logistics_description":"",
                "volume_limit":{
                    "item_max_volume":0,
                    "item_min_volume":0
                }
            },
         {
                "logistics_channel_id":30001,
                "logistics_channel_name":"黑貓宅急便",
                "cod_enabled":false,
                "enabled":true,
                "fee_type":"SIZE_SELECTION",
                "size_list":[
                    {
                        "size_id":"1",
                        "name":"0-60cm",
                        "default_price":90
                    },
                    {
                        "size_id":"2",
                        "name":"61-90cm",
                        "default_price":130
                    },
                    {
                        "size_id":"3",
                        "name":"91-120cm",
                        "default_price":170
                    },
                    {
                        "size_id":"4",
                        "name":"121-150cm",
                        "default_price":210
                    }
                ],
                "weight_limit":{
                    "item_max_weight":0,
                    "item_min_weight":0
                },
                "item_max_dimension":{
                    "height":0,
                    "width":0,
                    "length":0,
                    "unit":"",
                    "dimension_sum":0
                },
                "preferred":false,
                "force_enable":false,
                "mask_channel_id":0,
                "logistics_description":" ",
                "volume_limit":{
                    "item_max_volume":0,
                    "item_min_volume":0
                }
            },
            {
                "logistics_channel_id": 78004,
                "logistics_channel_name": "International Express - ส่งจากต่างประเทศ",
                "cod_enabled": true,
                "enabled": true,
                "fee_type": "SIZE_INPUT",
                "size_list": [],
                "weight_limit": {
                    "item_max_weight": 20,
                    "item_min_weight": 0.01
                },
                "item_max_dimension": {
                    "height": 0,
                    "width": 0,
                    "length": 0,
                    "unit": "",
                    "dimension_sum": 0
                },
                "preferred": false,
                "force_enable": false,
                "mask_channel_id": 0,
                "logistics_description": "",
                "volume_limit": {
                    "item_max_volume": 0,
                    "item_min_volume": 0
                }
            }，
           {
                "logistics_channel_id": 39303,
                "logistics_channel_name": "中華郵政",
                "cod_enabled": false,
                "enabled": false,
                "fee_type": "CUSTOM_PRICE",
                "size_list": [],
                "weight_limit":  { 
                    "item_max_weight": 0, 
                    "item_min_weight": 0  
                },                                                       
               "item_max_dimension": {
                    "height": 0,
                    "width": 0,
                    "length": 0,
                    "unit": "",
                    "dimension_sum": 0
                },
                "preferred": false,
                "force_enable": false,
                "mask_channel_id": 0,
                "logistics_description": "",
                "volume_limit": {
                    "item_max_volume": 0,
                    "item_min_volume": 0
                }
            }       
        ]
    },
    "request_id": "a316752d608baf000b2c73e2e5eed5c8"
}
 * ```
 */

export interface ShopeeGetLogisticChannelResponse extends ShopeeBaseResponse {
  request_id: string
  error: string
  message: string
  response: {
    logistics_channel_list: ShopeeGetLogisticChannelChannel[]
  }
}