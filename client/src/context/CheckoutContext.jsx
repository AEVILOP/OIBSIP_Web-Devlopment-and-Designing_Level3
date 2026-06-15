import { createContext, useContext, useMemo, useState } from 'react';

const CheckoutContext = createContext(null);

const readDraft = () => {
  try {
    return JSON.parse(sessionStorage.getItem('pizzaCheckout')) || null;
  } catch {
    return null;
  }
};

export function CheckoutProvider({ children }) {
  const [draft, setDraftState] = useState(readDraft);

  const setDraft = (value) => {
    setDraftState(value);
    sessionStorage.setItem('pizzaCheckout', JSON.stringify(value));
  };

  const clearDraft = () => {
    setDraftState(null);
    sessionStorage.removeItem('pizzaCheckout');
  };

  const value = useMemo(() => ({ draft, setDraft, clearDraft }), [draft]);
  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export const useCheckout = () => useContext(CheckoutContext);
