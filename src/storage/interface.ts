export interface ShopeeTokens {
  access_token: string
  refresh_token: string
}

export interface ShopeeTokensStorage {
  /**
   * Provide a function to save tokens.
   * @param shopId primary reference to save (and retrieve) the token
   * @param tokens tokens to be saved
   */
  saveTokens(shopId: string, tokens: ShopeeTokens): Promise<void>

  /**
   * Provide a function to fetch the token, return null if the storage cannot find the token.
   * @param shopId primary reference to load the tokens
   */
  loadTokens(shopId: string): Promise<ShopeeTokens | null>
}