import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import vndLogo from 'assets/images/metapolis_token-11.png';
import usdLogo from 'assets/images/metapolis_token-10.png';

const useInchDex = (chain) => {
  const { Moralis, account } = useMoralis();
  const [tokenList, setTokenlist] = useState({});
  const myToken = {
    // '0xA4389f795F5Ad3715bA1b153F82E89DD652Fe43D': {
    //   address: "0xA4389f795F5Ad3715bA1b153F82E89DD652Fe43D",
    //   decimals: 18,
    //   logoURI: vndLogo,
    //   name: "Polis VND",
    //   symbol: "pVND",
    // },
    // '0x8Ad0D94f2864B815f84c2De43C3c7e84bd09E969': {
    //   address: "0x8Ad0D94f2864B815f84c2De43C3c7e84bd09E969",
    //   decimals: 18,
    //   logoURI: usdLogo,
    //   name: "Polis USD",
    //   symbol: "pUSD",
    // }

  }

  useEffect(() => {
    if (!Moralis?.["Plugins"]?.["oneInch"]) return null;
    Moralis.Plugins.oneInch.getSupportedTokens({ chain }).then((tokens) =>
    {
      if(chain === 'bsc') {
        setTokenlist(Object.assign(myToken, tokens.tokens));
      } else {
        setTokenlist(Object.assign(tokens.tokens));
      } 
    })
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Moralis, Moralis.Plugins, chain]);

  // console.log(chain);
  const getQuote = async (params) =>
    await Moralis.Plugins.oneInch.quote({
      chain: params.chain, // The blockchain  you want to use (eth/bsc/polygon)
      fromTokenAddress: params.fromToken.address, // The token you want to swap
      toTokenAddress: params.toToken.address, // The token you want to receive
      amount: Moralis.Units.Token(params.fromAmount, params.fromToken.decimals).toString(),
    });

  async function trySwap(params) {
    const { fromToken, fromAmount, chain } = params;
    const amount = Moralis.Units.Token(fromAmount, fromToken.decimals).toString();
    if (fromToken.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
      await Moralis.Plugins.oneInch
        .hasAllowance({
          chain, // The blockchain you want to use (eth/bsc/polygon)
          fromTokenAddress: fromToken.address, // The token you want to swap
          fromAddress: account, // Your wallet address
          amount,
        })
        .then(async (allowance) => {
          console.log(allowance);
          if (!allowance) {
            await Moralis.Plugins.oneInch.approve({
              chain, // The blockchain you want to use (eth/bsc/polygon)
              tokenAddress: fromToken.address, // The token you want to swap
              fromAddress: account, // Your wallet address
            });
          }
        })
        .catch((e) => alert(e.message));
    }

    await doSwap(params)
      .then((receipt) => {
        if (receipt.statusCode !== 400) {
          alert("Swap Complete");
        }
        console.log(receipt);
      })
      .catch((e) => alert(e.message));
  }

  async function doSwap(params) {
    return await Moralis.Plugins.oneInch.swap({
      chain: params.chain, // The blockchain you want to use (eth/bsc/polygon)
      fromTokenAddress: params.fromToken.address, // The token you want to swap
      toTokenAddress: params.toToken.address, // The token you want to receive
      amount: Moralis.Units.Token(params.fromAmount, params.fromToken.decimals).toString(),
      fromAddress: account, // Your wallet address
      slippage: 1,
    });
  }

  return { getQuote, trySwap, tokenList };
};

export default useInchDex;
