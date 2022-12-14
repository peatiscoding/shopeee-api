import * as dotenv from 'dotenv' // or use `ts-node -r dotenv/config src/run.ts`
dotenv.config()

/**
 * THIS IS NOT INCLUDED IN LIBRARY
 * IT USES MANY DEV PACKAGES AS THIS LIB WONT SHIP WITH.
 * 
 * THIS FILE IS JUST FOR SAKE OF DEMONSTRATION.
 */

import open from 'open'
import { ShopeeOpenApiV2Client } from './client'
import { ShopeeTokens, ShopeeTokensStorage } from './storage'
import { createServer } from 'http'
import { parse as parseUrl } from 'url'
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'fs'
import { ShopeeGetShippingParameterResponse } from './models'

const partnerId = process.env.PARTNER_ID || ''
const partnerKey = process.env.PARTNER_KEY || ''
const port = +(process.env.PORT || 3000)

if (!partnerId || !partnerKey) {
  throw new Error('Invalid usage. Please configure your .env file first.')
}

// CLIENT
const client = new ShopeeOpenApiV2Client('sandbox', partnerId, partnerKey)

// STORAGE
const dir = '.demo-cache'
if (!existsSync(dir)) {
  mkdirSync(dir)
}
const storage: ShopeeTokensStorage = {
  async saveTokens(shopId: string, tokens: ShopeeTokens): Promise<void> {
    writeFileSync(`${dir}/${shopId}.json`, JSON.stringify(tokens))
  },
  async loadTokens(shopId: string): Promise<ShopeeTokens | null> {
    const path = `${dir}/${shopId}.json`
    if (existsSync(path)) {
      const content = readFileSync(path).toString()
      return JSON.parse(content)
    }
    return null
  },
}
client.setStorage(storage)

/**
 * Actual test suite to run
 * 
 * @param code 
 * @param shopId 
 * @returns 
 */
const runTest = async (code: string, shopId: string): Promise<any> => {
  if (code !== 'token-already-exists') {
    await client.getAccessToken(code, shopId)
  }
  const tokens = await storage.loadTokens(shopId)
  if (!tokens) {
    throw new Error('Hmmmmm, token should have been saved!')
  }
  const refreshed = await client.refreshToken(tokens.refresh_token, shopId)
  const context = client.createShopContext(shopId)
  const categories = await context.getCategory()
  const attributeForFirstCategory = await context.getProductAttributes(102067)
  // Break my token!
  console.warn('Destroy accessToken, to force refresh trigger..')
  context.signer.storage.saveTokens(shopId, {
    ...refreshed,
    access_token: 'broken-token',
  })
  const shopInfo = await context.getShopInfo()
  const profileInfo = await context.getProfileInfo()
  const products2 = await context.getProductItemList(10, 3)
  const products1 = await context.getProductItemList(0, 10)
  const productDetails = await context.getProductsItemBaseInfo(products1.response.item.map((o) => o.item_id))
  const orders = await context.getOrderList(0, 10)
  // const updateProductStock = await context.updateProductStock({
  //   item_id: 3453714549,
  //   stock_list: [{
  //     model_id: 0,
  //     seller_stock: [{
  //       stock: 27
  //     }]
  //   }]
  // })
  // const updateProductPrice = await context.updateProductPrice({
  //   item_id: 3453714549,
  //   price_list: [{
  //     model_id: 0,
  //     original_price: 7200
  //   }]
  // })
  const orderList = orders?.response?.order_list || []
  let shippingParams: ShopeeGetShippingParameterResponse | undefined = undefined
  if (orderList.length > 0) {
    shippingParams = await context.getShippingParameter(orderList[0].order_sn)
    if (shippingParams?.response?.info_needed?.pickup?.length && shippingParams.response?.pickup?.address_list?.length) {
      const pickupAddress = shippingParams.response?.pickup?.address_list[0]
      await context.shipOrder({
        order_sn: orderList[0].order_sn,
        pickup: {
          address_id: pickupAddress.address_id,
          pickup_time_id: pickupAddress.time_slot_list[0].pickup_time_id
        }
      })
    }
    if (shippingParams?.response?.info_needed?.dropoff?.length && shippingParams.response.dropoff?.branch_list?.length) {
      const branch = shippingParams.response.dropoff?.branch_list[0]
      await context.shipOrder({
        order_sn: orderList[0].order_sn,
        dropoff: {
          branch_id: branch.branch_id,
        }
      })
    }
    if (shippingParams.response.info_needed?.non_integrated?.length) {
      await context.shipOrder({
        order_sn: orderList[0].order_sn,
        non_integrated: {
          tracking_number: "Track number xxx"
        }
      })
    }

  }
  const address = await context.getAddressList()
  return {
    shopInfo,
    profileInfo,
    orders,
    productDetails,
    products2,
    products1,
    attributeForFirstCategory,
    categories,
    address,
    shippingParams,
    // updateProductStock,
    // updateProductPrice,
  }
}

/**
 * Our running orchastrator, make it easy to run the tests!
 */
const run = async (argShopId: string) => {
  console.info('Starting DEMO (', argShopId, ')')
  // Create server awaits for redirect URL
  let didServed = false
  // this server is plan to serve only 1 GET call.
  const sv = createServer((req, res) => {
    // Sometime browser just keep calling this same API, and it will cause the log message messy.
    if (didServed) {
      res.end()
      return
    }
    didServed = true
    const queryObject = parseUrl(req.url ?? '', true).query
    const code = `${queryObject['code']}`
    const shopId = `${queryObject['shop_id']}`
    console.log('Intercepted code, shop_id', { code, shopId }, 'running tests')
    runTest(code, shopId)
      .then((message) => {
        console.log('All good!')
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.write(JSON.stringify(message))
      })
      .catch((err) => {
        console.error('Opps something failed during tests. Check the logs ????', err.response?.data || err.message)
        res.statusCode = 200
        res.write(err && err.message || err)
      })
      .finally(() => {
        res.end()
        setTimeout(() => {
          console.log('All done! Shutting down our litte server. bye bye ????.')
          process.exit(0)
        }, 500)
      })
  })

  console.log('Waiting for code, and shop_id on port', port)
  sv.listen(port)

  const tokens = await storage.loadTokens(argShopId)
  if (tokens) {
    // tokens already found! we can run tests now!
    console.info('\n>>> TOKENS EXISTS FOR', argShopId, 'skip shopee authorization\n')
    const url = `http://localhost:${port}/?code=token-already-exists&shop_id=${argShopId}`
    console.log('Opening URL', url)
    await open(url)
  } else {
    console.info('\n>>> NO TOKENS LOADED FOR', argShopId, 'will try authorize with shopee...\n')
    const url = client.getAuthorizationLink(`http://localhost:${port}/`)
    console.log('Opening URL', url)
    await open(url)
  }
}

const args = process.argv.filter((arg) => /^shopid=\d+$/i.test(arg))
let argShopId = ''
if (args.length > 0) {
  argShopId = args[0].replace(/^[^=]*=(\d+)$/, '$1')
}

run(argShopId)
