Shopee API Client: shopeee-api
==

- Very dirty implementation of Shopee API Client.
- Follow: https://open.shopee.com/developer-guide/20

# Feature

- Create authorization URL
- Issue Access Token with `shopId` flow.

# Usage

## Requirement

Your project need to install `axios` package with version <1. e.g. `npm i axios@0.18` the library provided both ES module and CommonJS variations.

## Installation

```
npm i shopeee-api
```

## Create client

```ts
import { ShopeeOpenApiV2Client } from 'shopeee-api'

const client = new ShopeeOpenApiV2Client(
  'sandbox',
  '<your-partner-id>',
  '<your-partner-key>'
)
```

## Basic Features

### Generate Authorization Link

```ts
const url = client.getAuthorizationLink('http://localhost:3000/your/exchange/authorization/endpoint')
```

### Exchange for AccessToken, RefreshToken

```ts
const tokens = await client.getAccessToken('<code_from_redirected_url_param>', '<shop_id_from_redirected_url_params>')
// Would get something like...
// {
//   refresh_token: '1c553a4e5a5051584a6378534a775943',
//   access_token: '43796865736750724541686e6a776875',
//   expire_in: 13987,
//   request_id: '89a4a161f675ddc8cd68d59071fb4b20',
//   error: '',
//   message: ''
// }
```

### Refresh a new token

```ts
const tokens = await client.refreshToken('<current_refresh_token>', '<shop_id>')
// Would get something like...
// {
//   refresh_token: '1c553a4e5a5051584a6378534a775943',
//   access_token: '43796865736750724541686e6a776875',
//   expire_in: 13987,
//   request_id: '89a4a161f675ddc8cd68d59071fb4b20',
//   error: '',
//   message: ''
// }
```

Note that `refreshToken` api is automatically invoked when use the Token in `Shop Context` mode. See (src/demo.ts) to see how
we test for forcing system to refresh the token..

## Storage Features

Consumer may opt-in to use Storage feature by implement the Storage interface and provide the storage implementation for
the client.

```ts
// create client as normal
const client = new Client(...)
// configure storage
const naiveStorage: Record<string, ShopeeTokens> = {}
client.setStorage({
  async saveTokens(shopId: string, tokens: ShopeeTokens): Promise<void> {
    // FIXME: use something more persistent such as RDS, Redis.
    naiveStorage[shopId] = tokens
  },
  async loadTokens(shopId: string): Promise<ShopeeTokens | null> {
    // FIXME: use something more persistent such as RDS, Redis.
    return naiveStorage[shopId] || null
  },
})
```

Once configured our client.getAccessToken() will now call `storage.saveTokens()` automatically.

> Note that we provided the Naive implementation as `InMemoryTokenStorage` which is loaded by default.

## Shop Context

Within shopee APIs, there are APIs those do not need shop, and its accessToken, and there are APIs that needs.

We separate these API that need to aware of its context by let the consumer choose when to access it. And provide the set of Tokens Storage on your own. If your tokens has been mismanaged error will be thrown (complaining that the Token for such shopId is missing.) This error will be thrown when the desired API is invoked.

Under this mode we will automatically detect for 403 http status, and perform refresh if the request is applicable.

```ts
// TODO: Create the client with setStorage options.
const context = client.createShopeContext(shopId)
// THIS API: https://open.shopee.com/documents/v2/v2.product.get_category?module=89&type=1
const categories = await context.getCategory()
```

### Currently Supported APIs

```ts
await context.getShopInfo()
await context.getProfileInfo()
await context.getCategory()
const products = await context.getProductItemList(0, 20)
await context.getProductAttributes(102067) // Get Product attributes by CategoryId
const productDetails = await context.getProductsItemBaseInfo(products.response.item.map((o) => o.item_id))
```

# To Test

Configure your `.env` file. (See `.env.example`)

then simply runs:

```
npm run demo
```