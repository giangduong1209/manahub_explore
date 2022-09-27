import { marketplaceABI, marketplaceAddress } from "./contractsInfo/marketplace"
import { nftCollectionABI, nftCollectionAddress } from "./contractsInfo/nftCollection"
import { stakingABI, stakingAddress } from "./contractsInfo/staking"
import { tokenABI, tokenAddress } from "./contractsInfo/tokenERC20"

const Constants = {
    contracts: {
        MARKETPLACE_ABI: marketplaceABI,
        MARKETPLACE_ADDRESS: marketplaceAddress,
        NFT_COLLECTION_ABI: nftCollectionABI,
        NFT_COLLECTION_ADDRESS: nftCollectionAddress,
        STAKING_ABI: stakingABI,
        STAKING_ADDRESS: stakingAddress,
        TOKEN_ERC20_ABI: tokenABI,
        TOKEN_ERC20_ADDRESS: tokenAddress
    },
    token: {
        TOKEN_SYMBOL: "MAH",
        TOKEN_NAME: "Manahubs"
    },
    collections: {
        COLLECTIONS_NAME: "Manahubs",
        COLLECTIONS_SYMBOL: "MAH",
        COLLECTIONS_URI: "ipfs://QmcPccuccWbtewn7bwpxw3rhWuuT77NSXyg4ncYEGycYNg/"
    },
    marketplace: {
        MARKETPLACE_ADDRESS_HASH: "0x6aEB7b03bAAeEBaAB61D30a03753d5Eabef0E120",
    },
    NFT_PRICE: 0.15,
    LIMIT_REFERRAL_LEVEL: 6,


}

export default Constants