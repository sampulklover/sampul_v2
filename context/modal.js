import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState({
    logout: false,
    intro: false,
    invite: false,
    beloved: false,
    assets: false,
    aftercare: false,
    kyc: false,
    charity: false,
    trust: false,
    executor: false,
  });

  const toggleModal = (key) => {
    if (isModalOpen.hasOwnProperty(key)) {
      setIsModalOpen({
        ...isModalOpen,
        [key]: !isModalOpen[key],
      });
    } else {
      toast.error(`The key '${key}' does not exist in the state object.`);
    }
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, toggleModal }}>
      {children}
    </ModalContext.Provider>
  );
};
