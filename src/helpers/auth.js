import { Modal } from "antd";
import Constants from "constant";
export const checkWalletConnection = async (
  isAuthenticated,
  authenticate,
  callback
) => {
  try {
    if (!isAuthenticated) {
      authenticate({ chainId: 56 });
    }
    await callback();
  } catch (error) {
    console.error(error);
    return new Promise((resolve, reject) => reject(error));
  }
};
function failModal(error) {
  let secondsToGo = 5;
  const modal = Modal.error({
    title: "Error!",
    // content: `There was a problem when buy this NFT`
    content: error + "",
  });
  setTimeout(() => {
    modal.destroy();
  }, secondsToGo * 1000);
}
export const requireWalletConnection = (isAuthenticated) => {
  if (!isAuthenticated) {
    failModal("You need connection to wallet");
  }
  return isAuthenticated;
};
