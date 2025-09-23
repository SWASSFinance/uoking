# Product Upload API Example

## Endpoint
`POST /api/products/create`

## Required Fields (JSON Body)
- `name` (string): Product name
- `description` (string): Product description  
- `price` (string/number): Product price
- `image_base64` (string): Base64 encoded image with data URL format

## Example Usage

### Using curl:
```bash
curl -X POST https://your-domain.com/api/products/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Magic Sword",
    "description": "A powerful magical sword with enchanted properties",
    "price": "99.99",
    "image_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }'
```

### Using Python requests (Your Use Case):
```python
import requests
import base64

url = "https://your-domain.com/api/products/create"

# Your data
product_name = "Magic Sword"
product_description = "A powerful magical sword with enchanted properties"
product_price = "99.99"
image_path = "/path/to/your/image.png"

# Convert image to base64
with open(image_path, "rb") as image_file:
    # Read the image
    image_data = image_file.read()
    # Convert to base64
    image_base64 = base64.b64encode(image_data).decode('utf-8')
    # Add data URL prefix (assuming PNG, adjust as needed)
    image_base64 = f"data:image/png;base64,{image_base64}"

# Prepare the JSON payload
payload = {
    'name': product_name,
    'description': product_description,
    'price': product_price,
    'image_base64': image_base64
}

# Make the request
response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})

# Check response
if response.status_code == 201:
    result = response.json()
    print(f"Success! Product created with ID: {result['product']['id']}")
    print(f"Image URL: {result['product']['image_url']}")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

### Alternative Python with automatic MIME type detection:
```python
import requests
import base64
import mimetypes

def upload_product(name, description, price, image_path, api_url):
    # Get MIME type
    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type or not mime_type.startswith('image/'):
        mime_type = 'image/png'  # default fallback
    
    # Convert image to base64
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        image_base64 = f"data:{mime_type};base64,{image_base64}"
    
    payload = {
        'name': name,
        'description': description,
        'price': str(price),
        'image_base64': image_base64
    }
    
    response = requests.post(api_url, json=payload)
    return response

# Usage
response = upload_product(
    name="Magic Sword",
    description="A powerful magical sword",
    price=99.99,
    image_path="/path/to/image.png",
    api_url="https://your-domain.com/api/products/create"
)
```

## Response Format

### Success (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "uuid-here",
    "name": "Magic Sword",
    "slug": "magic-sword",
    "description": "A powerful magical sword with enchanted properties",
    "price": "99.99",
    "image_url": "https://res.cloudinary.com/your-cloud/image/upload/...",
    "status": "active"
  },
  "cloudinary": {
    "public_id": "uoking/products/product-magic-sword-1234567890",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/..."
  }
}
```

### Error (400/409/500):
```json
{
  "error": "Error message here"
}
```

## What the API does:
1. Validates all required fields
2. Validates image file type and size (max 10MB)
3. Uploads image to Cloudinary with optimization
4. Generates a URL-friendly slug from the product name
5. Inserts product into the database
6. Returns the created product details and image URLs

## Database Fields Set:
- `name`: Your provided name
- `slug`: Auto-generated from name
- `description`: Your provided description
- `short_description`: First 200 chars of description
- `price`: Your provided price
- `image_url`: Cloudinary URL
- `status`: 'active'
- `featured`: false
- `type`: 'item'
- `rank`: 0
- `requires_character_name`: false
- `requires_shard`: false
- `created_at`/`updated_at`: Current timestamp
