

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  category?: string
  details?: any // For custom items like account builder
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
        // Validate and sanitize cart data
        const items = Array.isArray(cart.items) ? cart.items : []
        const total = parseFloat(String(cart.total)) || 0
        const itemCount = parseInt(String(cart.itemCount)) || 0
        
        return {
          items,
          total: isNaN(total) ? 0 : total,
          itemCount: isNaN(itemCount) ? 0 : itemCount
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
    
    // Validate price
    const validPrice = parseFloat(String(item.price)) || 0
    
    // Validate quantity limit
    const maxQuantity = 10000
    const newQuantity = existingItemIndex > -1 
      ? Math.min(cart.items[existingItemIndex].quantity + quantity, maxQuantity)
      : Math.min(quantity, maxQuantity)
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item with validated price
      cart.items.push({ ...item, price: validPrice, quantity: newQuantity })
    }
    
    // Recalculate totals with safety checks
    cart.total = cart.items.reduce((sum, item) => {
      const itemPrice = parseFloat(String(item.price)) || 0
      const itemQty = parseInt(String(item.quantity)) || 0
      return sum + (itemPrice * itemQty)
    }, 0)
    cart.itemCount = cart.items.reduce((sum, item) => sum + (parseInt(String(item.quantity)) || 0), 0)
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
    
    return cart
  },

  // Remove item from cart
  removeItem: (itemId: string): Cart => {
    const cart = clientCart.getCart()
    cart.items = cart.items.filter(item => item.id !== itemId)
    
    // Recalculate totals with safety checks
    cart.total = cart.items.reduce((sum, item) => {
      const itemPrice = parseFloat(String(item.price)) || 0
      const itemQty = parseInt(String(item.quantity)) || 0
      return sum + (itemPrice * itemQty)
    }, 0)
    cart.itemCount = cart.items.reduce((sum, item) => sum + (parseInt(String(item.quantity)) || 0), 0)
    
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
        // Update quantity with maximum limit
        const maxQuantity = 10000
        cart.items[itemIndex].quantity = Math.min(quantity, maxQuantity)
      }
      
      // Recalculate totals with safety checks
      cart.total = cart.items.reduce((sum, item) => {
        const itemPrice = parseFloat(String(item.price)) || 0
        const itemQty = parseInt(String(item.quantity)) || 0
        return sum + (itemPrice * itemQty)
      }, 0)
      cart.itemCount = cart.items.reduce((sum, item) => sum + (parseInt(String(item.quantity)) || 0), 0)
      
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