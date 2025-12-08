# Frontend - React Application

Sales Management System frontend built with React, Vite, and Tailwind CSS.

## Setup

```bash
npm install
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the frontend directory:
- `VITE_API_URL=http://localhost:5000/api/transactions` (optional, defaults to localhost)

## Features

- **Search** - Debounced search by customer name or phone
- **Filters** - Multiple filter options (region, gender, age, category, tags, payment method, date)
- **Sorting** - Sort by date, quantity, or customer name
- **Pagination** - Sliding window pagination with max 6 visible pages
- **Stats** - Real-time calculation of total units, amount, and discount

## Components

- `App.jsx` - Main application container with state management
- `Navbar` - Top navigation with search functionality
- `Sidebar` - Left navigation menu
- `FilterBar` - Filter controls and sort dropdown
- `TransactionTable` - Data table with loading and empty states
- `Pagination` - Page navigation component

## Performance

- 400ms debounce on search input
- Memoized stats calculations
- Optimized re-renders with React hooks

