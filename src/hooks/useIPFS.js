import Constants from "constant";

export const useIPFS = () => {
  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace(
      "ipfs://",
      `https://${Constants.GATEWAY_HOSTNAME}/ipfs/`
    );
  };

  return { resolveLink };
};
