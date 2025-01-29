import React, { createContext, useState} from "react";

// Crea el contexto
const ModalContext = createContext();

// Crea el proveedor del contexto
const ModalProvider = ({ children }) => {
  const [modalContextOpen, setModalContextOpen] = useState(true);
  const [activeModalName, setActiveModalName] = useState(undefined);

  const setStateModal = (state) => {
    if (state === undefined) return;

    if (modalContextOpen && state === false) setModalContextOpen(state);
    if (!modalContextOpen && state === true) setModalContextOpen(state);
    if (modalContextOpen && state === true) {
      console.error("The modal are already open")
    }
  }

  return (
    <ModalContext.Provider
      value={{
        modalContextOpen,
        setStateModal,
        activeModalName,
        setActiveModalName
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider, ModalContext };
