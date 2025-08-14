"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Cart, CartItem, clientCart } from '@/lib/cart'

interface CartContextType {
  cart: Cart
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  syncToServer: () => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = clientCart.getCart()
    setCart(savedCart)
  }, [])

  // Listen for storage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        const newCart = clientCart.getCart()
        setCart(newCart)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const updatedCart = clientCart.addItem(item, quantity)
    setCart(updatedCart)
  }

  const removeItem = (itemId: string) => {
    const updatedCart = clientCart.removeItem(itemId)
    setCart(updatedCart)
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = clientCart.updateQuantity(itemId, quantity)
    setCart(updatedCart)
  }

  const clearCart = () => {
    const updatedCart = clientCart.clearCart()
    setCart(updatedCart)
  }

  const syncToServer = async (): Promise<boolean> => {
    const success = await clientCart.syncToServer()
    if (success) {
      setCart({ items: [], total: 0, itemCount: 0 })
    }
    return success
  }

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      syncToServer
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 