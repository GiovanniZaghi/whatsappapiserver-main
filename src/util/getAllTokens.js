import Factory from './tokenStore/factory';

export default async function getAllTokens(req) {
  const tokenStore = new Factory();
  const myTokenStore = tokenStore.createTokenStory(null);
  try {
    return await myTokenStore.listTokens();
  } catch (e) {
    req.logger.error(e);
  }
}
