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

const partnerId = process.env.PARTNER_ID || ''
const partnerKey = process.env.PARTNER_KEY || ''
const port = +(process.env.PORT || 3000)

if (!partnerId || !partnerKey) {
  throw new Error('Invalid usage. Please configure your .env file first.')
}

const client = new ShopeeOpenApiV2Client('sandbox', partnerId, partnerKey)
const naiveStorage: Record<string, ShopeeTokens> = {}
const storage: ShopeeTokensStorage = {
  async saveTokens(shopId: string, tokens: ShopeeTokens): Promise<void> {
    naiveStorage[shopId] = tokens
  },
  async loadTokens(shopId: string): Promise<ShopeeTokens | null> {
    return naiveStorage[shopId] || null
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
  await client.getAccessToken(code, shopId)
  const tokens = await storage.loadTokens(shopId)
  if (!tokens) {
    throw new Error('Hmmmmm, token should have been saved!')
  }
  const refreshed = await client.refreshToken(tokens.refresh_token, shopId)
  const context = client.createContext(refreshed, shopId)
  const categories = await context.getCategory()
  const shopInfo = await context.getShopInfo()
  const profileInfo = await context.getProfileInfo()
  return {
    shopInfo,
    profileInfo,
    categories,
  }
}

/**
 * Our running orchastrator, make it easy to run the tests!
 */
const run = async () => {
  const url = client.getAuthorizationLink(`http://localhost:${port}/`)
  console.log('Opening URL', url)
  await open(url)

  // Create server awaits for redirect URL
  const sv = createServer((req, res) => {
    const queryObject = parseUrl(req.url ?? '', true).query
    const code = `${queryObject['code']}`
    const shopId = `${queryObject['shop_id']}`
    console.log('Intercepted code, shop_id', { code, shopId }, 'running tests')
    runTest(code, shopId)
      .then((message) => {
        console.log('All good! Replied and shutting down our litte server.')
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.write(JSON.stringify(message))
      })
      .catch((err) => {
        console.log('Opps something failed during tests. Check the logs 🪵', err?.response.data)
        res.statusCode = 500
        res.write(err && err.message || err)
      })
      .finally(() => {
        res.end()
        console.log('All done! bye bye 👋.')
        process.exit(0)
      })
  })

  console.log('Waiting for code, and shop_id on port', port)
  sv.listen(port)
}
run()