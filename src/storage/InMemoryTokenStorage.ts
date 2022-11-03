import type {
  ShopeeTokensStorage,
  ShopeeTokens,
} from '.'

export class InMemoryTokenStorage implements ShopeeTokensStorage {
  private store: Record<string, ShopeeTokens> = {}

  constructor() {
  }

  async saveTokens(shopId: string, tokens: ShopeeTokens): Promise<void> {
    this.store[shopId] = tokens
  }

  async loadTokens(shopId: string): Promise<ShopeeTokens | null> {
    return this.store[shopId]
  } 
}