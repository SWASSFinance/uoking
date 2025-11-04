"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TestCart() {
  const { cart, addItem, removeItem, clearCart } = useCart()

  const testItems = [
    {
      id: "test-1",
      name: "Test Sword",
      price: 29.99,
      image_url: "/test-sword.jpg",
      category: "Weapons"
    },
    {
      id: "test-2", 
      name: "Test Shield",
      price: 19.99,
      image_url: "/test-shield.jpg",
      category: "Armor"
    }
  ]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cart Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Items: {cart.itemCount} | Total: ${(cart.total || 0).toFixed(2)}
          </p>
          
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} | ${item.price}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {testItems.map((item) => (
            <Button 
              key={item.id}
              onClick={() => addItem(item)}
              className="w-full"
            >
              Add {item.name}
            </Button>
          ))}
        </div>

        <Button 
          onClick={clearCart}
          variant="destructive"
          className="w-full"
        >
          Clear Cart
        </Button>
      </CardContent>
    </Card>
  )
} 