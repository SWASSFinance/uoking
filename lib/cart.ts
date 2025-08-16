

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  category?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Client-side cart functions (for use in components)
export const clientCart = {
  // Get cart from localStorage
  getCart: (): Cart => {
    if (typeof window === 'undefined') {
      return { items: [], total: 0, itemCount: 0 }
    }
    
    try {
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        const cart = JSON.parse(cartData)
        return {
          items: cart.items || [],
          total: cart.total || 0,
          itemCount: cart.itemCount || 0
        }
      }
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
    }
    
    return { items: [], total: 0, itemCount: 0 }
  },

  // Add item to cart
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart => {
    const cart = clientCart.getCart()
    const existingItemIndex = cart.items.findIndex(cartItem => cartItem.id === item.id)
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.items.push({ ...item, quantity })
    }
    
    // Recalculate totals
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
    
    return cart
  },

  // Remove item from cart
  removeItem: (itemId: string): Cart => {
    const cart = clientCart.getCart()
    cart.items = cart.items.filter(item => item.id !== itemId)
    
    // Recalculate totals
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
    
    return cart
  },

  // Update item quantity
  updateQuantity: (itemId: string, quantity: number): Cart => {
    const cart = clientCart.getCart()
    const itemIndex = cart.items.findIndex(item => item.id === itemId)
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1)
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity
      }
      
      // Recalculate totals
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart))
    }
    
    return cart
  },

  // Clear cart
  clearCart: (): Cart => {
    const emptyCart = { items: [], total: 0, itemCount: 0 }
    localStorage.removeItem('cart')
    return emptyCart
  },

  // Sync cart to server (for checkout)
  syncToServer: async (cashbackAmount?: number, shard?: string, characterName?: string): Promise<boolean> => {
    try {
      const cart = clientCart.getCart()
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cart, 
          cashbackAmount: cashbackAmount || 0,
          shard: shard || '',
          characterName: characterName || ''
        }),
      })
      
      if (response.ok) {
        // Clear local cart after successful sync
        clientCart.clearCart()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error syncing cart to server:', error)
      return false
    }
  }
}

// Note: Cart is managed client-side using localStorage
// Server-side functions are not needed since cart sync happens during checkout 