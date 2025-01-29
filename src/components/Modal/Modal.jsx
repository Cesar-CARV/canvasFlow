import React, { useContext, useEffect } from "react";
import { ModalContext } from "../../context/ModalContext";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export default function Modal({
  children,
  modalName,
  background = true,
  offsetX,
  offsetY,
}) {
  const {
    modalContextOpen,
    setStateModal,
    activeModalName,
    setActiveModalName,
  } = useContext(ModalContext);

  if (!modalContextOpen) return;
  if (activeModalName !== modalName) return;

  // Close modal on click out of area
  const handleCloseModal = (e) => {
    e.preventDefault();
    setStateModal(false);
    setActiveModalName(undefined);
  };

  // Do not close modal on click overlay area
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Close modal with the key ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setStateModal(false);
        setActiveModalName(undefined);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {createPortal(
        <dialog
          open
          onClick={handleCloseModal}
          className={`${styles["container"]} ${
            background && styles["container--background"]
          } ${!offsetX && !offsetY ? styles["container--center"] : ""}`}
        >
          <div
            onClick={handleModalClick}
            style={{ left: offsetX, top: offsetY }}
            className={styles["modal"]}
          >
            {children}
          </div>
        </dialog>,
        document.querySelector("#modal-root")
      )}
    </>
  );
}
