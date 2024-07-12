import translations from '../constant/translations';
import { createContext, useContext, useState } from 'react';

export const LocaleContext = createContext();

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  const changeLocale = async ({ lang }) => {
    if (translations.hasOwnProperty(lang)) {
      setLocale(lang);
      // console.log('Language changed to:', lang);
    } else {
      console.error(`Language key "${lang}" not found in translations.`);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
