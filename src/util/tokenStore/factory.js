import config from '../../config.json';
import FileTokenStore from './fileTokenStory';

var Factory = function () {
  this.createTokenStory = function (client) {
    var myTokenStore;
    const type = config.tokenStoreType;
    myTokenStore = new FileTokenStore(client);
    return myTokenStore.tokenStore;
  };
};

module.exports = Factory;
