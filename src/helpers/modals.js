import { Modal } from "antd";
const timeOut = 5;
const failureModal = (title = 'Error!', message = 'Something went wrong') => {
    const modal = Modal.error({
        title,
        // content: `There was a problem when buy this NFT`
        content: message,
    });
    setTimeout(() => {
        modal.destroy();
    }, timeOut * 1000);
}
const successModal = (title = 'Success!', message = 'Successfully')=>{
    const modal = Modal.success({
        title,
        content: message,
    });
    setTimeout(() => {
        modal.destroy();
    }, timeOut * 1000);
}

export {failureModal, successModal}