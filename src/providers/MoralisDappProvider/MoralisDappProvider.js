import Constants from "constant";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user, enableWeb3, isAuthenticated, isWeb3Enabled } =
    useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();
  const [contractABI, setContractABI] = useState(
    Constants.contracts.MARKETPLACE_ABI
  );
  const [marketAddress, setMarketAddress] = useState(
    Constants.contracts.MARKETPLACE_ADDRESS
  );
  useEffect(() => {
    if (!isWeb3Enabled && isAuthenticated) {
      enableWeb3();
    }
  }, [isWeb3Enabled, isAuthenticated]);
  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });
    Moralis.onAccountChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(web3?.givenProvider?.chainId));
  useEffect(
    () =>
      setWalletAddress(
        web3?.givenProvider?.selectedAddress || user?.get("ethAddress")
      ),
    [web3, user]
  );

  return (
    <MoralisDappContext.Provider
      value={{
        walletAddress,
        chainId,
        contractABI,
        setContractABI,
        marketAddress,
        setMarketAddress,
      }}
    >
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
