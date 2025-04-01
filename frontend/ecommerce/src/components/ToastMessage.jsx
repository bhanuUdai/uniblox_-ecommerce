import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToastMessage({ message, variant }) {
  const showToast = () => {
    toast(message, {
      type: variant, // toast type will correspond to the variant ('success', 'error', etc.)
      autoClose: 3000,
      hideProgressBar: true,
      position: "top-right",
      theme: "colored",
    });
  };

  React.useEffect(() => {
    if (message) {
      showToast();
    }
  }, [message]);

  return <ToastContainer />;
}

export default ToastMessage;
