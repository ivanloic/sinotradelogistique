import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  return useContext(CartContext);
}

const STORAGE_KEY = 'sino_trade_cart_v1';
const SHIPPING_KEY = 'sino_trade_shipping_v1';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to parse cart from storage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to persist cart', e);
    }
  }, [cartItems]);

  const [shippingOption, setShippingOption] = useState(() => {
    try {
      const raw = localStorage.getItem(SHIPPING_KEY);
      return raw || 'air';
    } catch (e) {
      return 'air';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SHIPPING_KEY, String(shippingOption));
    } catch (e) {
      console.warn('Failed to persist shipping option', e);
    }
  }, [shippingOption]);

  // helper to compute a stable key for an item including options
  const itemKey = (item) => {
    const opts = item.options || {};
    // sort keys for stability
    const sorted = Object.keys(opts).sort().reduce((acc, k) => { acc[k] = opts[k]; return acc }, {});
    return `${item.productId}::${JSON.stringify(sorted)}`;
  }

  const addItem = (item) => {
    // item: { productId, name, price, image, quantity = 1, minOrder, taxType, options }
    setCartItems(prev => {
      const qty = item.quantity || 1;
      const key = itemKey(item);
      const existing = prev.find(ci => ci._key === key);
      if (existing) {
        return prev.map(ci => ci._key === key ? { ...ci, quantity: ci.quantity + qty } : ci);
      }
      const toAdd = {
        _key: key,
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        minOrder: item.minOrder || 1,
        taxType: item.taxType || 'ttc',
        quantity: Math.max(qty, item.minOrder || 1),
        options: item.options || {}
      };
      return [...prev, toAdd];
    });
  };

  const removeItem = (key) => {
    setCartItems(prev => prev.filter(i => i._key !== key));
  };

  const updateQuantity = (key, newQuantity) => {
    setCartItems(prev => prev.map(i => i._key === key ? { ...i, quantity: Math.max(newQuantity, i.minOrder || 1) } : i));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQuantity, clearCart, shippingOption, setShippingOption }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
