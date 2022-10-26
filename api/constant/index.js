var marketplaceAddress = require("./contract/marketplace").marketplaceAddress;
var marketplaceABI = require("./contract/marketplace").marketplaceABI;
const constants = {
  contracts: {
    MARKETPLACE_ABI: marketplaceABI,
    MARKETPLACE_ADDRESS: marketplaceAddress,
  },
  token: {
    TOKEN_SYMBOL: "MAH",
    TOKEN_NAME: "Manahubs",
  },
  collections: {
    COLLECTIONS_NAME: "Manahubs",
    COLLECTIONS_SYMBOL: "MAH",
    COLLECTIONS_URI: "ipfs://QmcPccuccWbtewn7bwpxw3rhWuuT77NSXyg4ncYEGycYNg/",
  },
  LIMIT_REFERRAL_LEVEL: 6,
  GOOGLE_CLOUD_STORAGE_BUCKET:
    "https://storage.googleapis.com/guardians_of_the_galaxy/",
  GATEWAY_HOSTNAME: "cf-ipfs.com",
};
module.exports = constants;
