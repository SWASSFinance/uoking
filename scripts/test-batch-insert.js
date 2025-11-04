#!/usr/bin/env node

/**
 * Test script to verify batch insert query construction
 * This helps debug the order items insertion
 */

// Simulate cart items
const cartItems = [
  { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Gold Coins', quantity: 1000, price: 5.99, details: { server: 'Atlantic' } },
  { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Silver Coins', quantity: 500, price: 2.99, details: null }
];

const orderId = '00000000-0000-0000-0000-000000000000';

// Simulate the batch insert logic
const values = [];
const params = [];
let paramIndex = 1;

for (const item of cartItems) {
  const isCustomProduct = !item.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  const productId = isCustomProduct ? '00000000-0000-0000-0000-000000000000' : item.id;
  
  values.push(`($${paramIndex}, $${paramIndex+1}, $${paramIndex+2}, $${paramIndex+3}, $${paramIndex+4}, $${paramIndex+5}, $${paramIndex+6}, NOW())`);
  params.push(
    orderId,
    productId,
    item.name,
    item.quantity,
    item.price.toFixed(2),
    (item.price * item.quantity).toFixed(2),
    item.details ? JSON.stringify(item.details) : null
  );
  paramIndex += 7;
}

const query = `
  INSERT INTO order_items (
    order_id, product_id, product_name, quantity, unit_price, total_price, 
    custom_details, created_at
  ) VALUES ${values.join(', ')}
`;

console.log('=== BATCH INSERT TEST ===\n');
console.log('Query:', query);
console.log('\nParams:', params);
console.log('\nParams count:', params.length);
console.log('Expected params:', cartItems.length * 7);
console.log('\nValues:');
values.forEach((v, i) => console.log(`  ${i + 1}. ${v}`));

console.log('\n=== VALIDATION ===');
console.log('✓ Params count matches:', params.length === cartItems.length * 7);

// Check if parameter placeholders are sequential
const maxParam = paramIndex - 1;
console.log('✓ Max parameter index:', maxParam);
console.log('✓ Expected max:', cartItems.length * 7);

if (params.length === cartItems.length * 7 && maxParam === cartItems.length * 7) {
  console.log('\n✅ Batch insert query looks correct!');
} else {
  console.log('\n❌ Parameter mismatch detected!');
}

