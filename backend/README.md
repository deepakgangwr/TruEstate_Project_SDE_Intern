# Backend API

Express.js REST API for managing retail transaction data.

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file with:
- `PORT=5000`
- `MONGO_URI=your_mongodb_connection_string`

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run seed` - Run the data seeding script

## API Endpoints

### Transactions
- `GET /api/transactions` - Get paginated transactions with filters
  - Query params: `page`, `limit`, `search`, `region`, `gender`, `category`, `paymentMethod`, `sortBy`, `order`, etc.
- `GET /api/transactions/options` - Get available filter options (regions, categories, payment methods, tags)

## Architecture

The backend follows a Controller-Service-Repository pattern:
- **Controllers** - Handle HTTP requests and responses
- **Services** - Contain business logic and database operations
- **Models** - Define Mongoose schemas with indexes
- **Utils** - Helper functions like query builder

## Performance Optimizations

- Parallel query execution using `Promise.all`
- Lean queries for reduced memory usage
- Compound indexes following ESR rule
- Stream-based CSV processing for seeding

