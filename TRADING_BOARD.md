# WTS Trading Board 🛒

A secure trading platform where only plot owners can create posts to sell Ultima Online items, while anyone can browse and view the listings.

## Features

### 🔒 **Plot Owner Verification**
- Only users who own at least one plot can create trading posts
- Automatic verification when creating posts
- "Plot Owner" badge displayed on verified posts

### 🌐 **Public Viewing**
- Anyone can browse and search trading posts
- No authentication required to view listings
- Real-time filtering and search capabilities

### 📝 **Post Management**
- Create detailed trading posts with item information
- Set prices in gold (e.g., 50,000,000 for 50 million gold)
- Include shard and character information
- Add contact details for buyers
- Edit and delete your own posts

### 🔍 **Advanced Filtering**
- Search by item name, title, or description
- Filter by shard/server
- Price range filtering (min/max)
- Status-based filtering (active, sold, expired, cancelled)

## Database Schema

### `trading_posts` Table
```sql
CREATE TABLE trading_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'GOLD',
  shard VARCHAR(100),
  character_name VARCHAR(100),
  contact_info TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'cancelled')),
  is_plot_owner_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### GET `/api/trading`
- Fetch all active trading posts
- Supports query parameters for filtering:
  - `shard`: Filter by shard name
  - `item_name`: Search by item name
  - `min_price`: Minimum price filter
  - `max_price`: Maximum price filter
  - `limit`: Limit number of results

### POST `/api/trading`
- Create a new trading post
- Requires authentication
- Requires plot ownership verification
- Body parameters:
  - `title`: Post title (required)
  - `description`: Item description (required)
  - `item_name`: Name of the item (required)
  - `price`: Item price (required)
  - `currency`: Currency code (optional, default: GOLD)
  - `shard`: Shard/server name (optional)
  - `character_name`: Character name (optional)
  - `contact_info`: Contact information (optional)

### GET `/api/trading/[id]`
- Fetch a specific trading post by ID

### PUT `/api/trading/[id]`
- Update an existing trading post
- Requires authentication and ownership

### DELETE `/api/trading/[id]`
- Delete a trading post
- Requires authentication and ownership

### GET `/api/user/plot-owner-status`
- Check if the current user is a plot owner
- Returns `{ isPlotOwner: boolean, message: string }`

## Usage

### For Plot Owners
1. Navigate to `/trading` or use the "Trading Board" link in the Tools menu
2. Click "Create Trading Post" button
3. Fill in the required information:
   - Title and description
   - Item name and price in gold (e.g., 50000000 for 50 million gold)
   - Optional: shard, character name, contact info
4. Submit the post

### For Buyers
1. Browse the trading board at `/trading`
2. Use search and filters to find items
3. Contact sellers using the provided contact information
4. Arrange trades directly with sellers

## Security Features

- **Plot Ownership Verification**: Only verified plot owners can create posts
- **User Authentication**: Required for creating, editing, and deleting posts
- **Ownership Validation**: Users can only modify their own posts
- **Input Validation**: All form inputs are validated server-side
- **SQL Injection Protection**: Parameterized queries prevent SQL injection

## Status Management

Posts can have the following statuses:
- **active**: Available for purchase
- **sold**: Item has been sold
- **expired**: Post has expired
- **cancelled**: Post was cancelled by the seller

## Future Enhancements

- [ ] WTB (Want To Buy) posts
- [ ] Image uploads for items
- [ ] Rating and review system
- [ ] Automated post expiration
- [ ] Email notifications for new posts
- [ ] Advanced search with item categories
- [ ] Bulk post management
- [ ] Trading history tracking
