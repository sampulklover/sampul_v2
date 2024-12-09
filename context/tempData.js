import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const TempDataContext = createContext();

export const useTempData = () => useContext(TempDataContext);

export const TempDataProvider = ({ children }) => {
  const [tempData, setTempData] = useState({
    assets: {
      key: 'add',
      instructionType: '',
      selectedItem: null,
    },
    invite: {
      selectedItem: null,
    },
    beloved: {
      key: 'add',
      category: 'co_sampul',
      selectedItem: null,
    },
    aftercare: {
      key: 'add',
      selectedItem: null,
    },
  });

  const setValueTempData = (key, passData) => {
    if (tempData.hasOwnProperty(key)) {
      setTempData({
        ...tempData,
        [key]: passData,
      });
    } else {
      toast.error(`The key '${key}' does not exist in the state object.`);
    }
  };

  return (
    <TempDataContext.Provider value={{ tempData, setValueTempData }}>
      {children}
    </TempDataContext.Provider>
  );
};
