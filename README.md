# Retail Sales Management System - TruEstate SDE Intern Assignment

## 1. Overview

This project is a high-performance **Retail Sales Dashboard** built with the **MERN Stack** (MongoDB, Express, React, Node.js). It handles large-scale transaction datasets with sub-second latency through optimized database indexing and parallel query execution. The system features a modern, responsive UI built with React and Tailwind CSS, along with a robust Express.js backend that implements efficient search, filtering, sorting, and pagination capabilities.

**Live Demo:** [Frontend](https://truestateassignment12.netlify.app/) | [Backend API](https://truestate-project-sde-intern1.onrender.com)

---

## 2. Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Axios
* **Backend:** Node.js, Express.js, REST API architecture
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Deployment:** 
  * **Backend:** Render (Web Service)
  * **Frontend:** Netlify (Static Site Hosting)

---

## 3. Search Implementation Summary

Search is handled server-side to bypass client-side array limits and ensure scalability.

* **Logic:** Implemented a backend query builder using the `$or` operator with `$regex` (case-insensitive flag `i`) to search across customer name and phone number fields simultaneously.
* **Debouncing:** The frontend includes a **400ms debounce** on the search input. This prevents "API Thrashing" by ensuring a request is only sent after the user stops typing, significantly reducing server load.
* **Performance:** Utilizes MongoDB text indexes on `customer.name` and `customer.phone` fields, reducing search time complexity from O(N) to O(log N).

---

## 4. Filter Implementation Summary

A dynamic **Query Builder Pattern** is implemented in the service layer to handle multi-faceted filtering.

* **Multi-Select:** Fields like *Region* and *Category* accept comma-separated strings, which are parsed into MongoDB `$in` array queries for efficient filtering.
* **Range Logic:** The system intelligently parses frontend presets (e.g., "Last 7 Days", "Age 26-35") into precise MongoDB `$gte` (Greater Than or Equal) and `$lte` (Less Than or Equal) operators.
* **Resilience:** The builder gracefully handles missing or partial parameters, ensuring the API is robust against malformed requests and provides consistent responses.

---

## 5. Sorting Implementation Summary

Sorting is persistent across pagination and handled via database cursors for optimal performance.

* **Smart Defaults:** Text fields sort alphabetically (**A-Z**), while Date and Numeric fields default to Descending order (**Newest/Highest First**).
* **Mapping Layer:** A translation layer exists between the frontend sort keys and database paths (e.g., mapping UI "quantity" to DB `sales.quantity`), protecting the internal schema structure and providing a clean API interface.

---

## 6. Pagination Implementation Summary

Efficient pagination is implemented on both backend and frontend for optimal user experience.

* **Backend:** Implemented Offset-based pagination using `skip = (page - 1) * limit`. Data and count queries are executed in parallel using `Promise.all()` to reduce response latency by approximately 50%.
* **Frontend:** Designed a **Sliding Window** pagination component that displays a maximum of 6 pages at a time, providing a clean UX similar to modern design patterns. It includes boundary checks to disable Next/Previous buttons appropriately.

---

## 7. Setup Instructions

### Prerequisites
* Node.js (v16+)
* MongoDB Atlas Connection String

### Step 1: Clone the Repository
```bash
git clone https://github.com/deepakgangwr/TruEstate_Project_SDE_Intern.git
cd TruEstate_Project_SDE_Intern
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create Environment Variables
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env

# Data Seeding (Crucial for first run)
node seed.js

# Start the Server
npm start
```

### Step 3: Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install

# Create Environment Variables (Optional)
echo "VITE_API_URL=http://localhost:5000/api/transactions" > .env

# Start the React Application
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

---

## 8. Deployment Instructions

### Backend Deployment on Render

#### Prerequisites
* GitHub repository with your code
* MongoDB Atlas account and connection string
* Render account (free tier available)

#### Step 1: Prepare Backend for Render
1. Ensure your `backend/src/index.js` binds to `0.0.0.0`:
   ```javascript
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. Verify `backend/render.yaml` exists (optional but recommended):
   ```yaml
   services:
     - type: web
       name: truestate-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 5000
         - key: MONGO_URI
           sync: false  # Set this in Render dashboard
   ```

#### Step 2: Deploy on Render
1. **Create New Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**
   - **Name:** `truestate-backend` (or your preferred name)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** `22.16.0` (or latest LTS)

3. **Set Environment Variables:**
   - Click "Environment" tab
   - Add the following:
     - `NODE_ENV` = `production`
     - `PORT` = `5000` (Render will override this automatically)
     - `MONGO_URI` = `your_mongodb_atlas_connection_string`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Wait for deployment to complete (~5-10 minutes)
   - Your backend URL will be: `https://your-service-name.onrender.com`

#### Step 3: Verify Backend Deployment
- Visit your Render service URL
- You should see: `TruEstate API is running...`
- Test API endpoint: `https://your-service-name.onrender.com/api/transactions`

#### Important Notes:
- Render free tier services **spin down after 15 minutes of inactivity**
- First request after spin-down may take 30-60 seconds (cold start)
- For production, consider upgrading to a paid plan for always-on service

---

### Frontend Deployment on Netlify

#### Prerequisites
* GitHub repository with your code
* Backend API URL from Render deployment
* Netlify account (free tier available)

#### Step 1: Prepare Frontend for Netlify
1. Ensure `frontend/netlify.toml` exists:
   ```toml
   [build]
     base = "frontend"
     command = "npm run build"
     publish = "frontend/dist"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Verify `frontend/src/App.jsx` has correct API URL:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com/api/transactions';
   ```

#### Step 2: Deploy on Netlify
1. **Create New Site:**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
   - **Node version:** `18` (or latest LTS)

3. **Set Environment Variables:**
   - Go to "Site settings" → "Environment variables"
   - Click "Add variable"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api/transactions`
   - Replace `your-backend-url` with your actual Render backend URL

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy
   - Wait for deployment to complete (~2-5 minutes)
   - Your frontend URL will be: `https://random-name-12345.netlify.app`

#### Step 3: Configure Custom Domain (Optional)
1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Follow Netlify's DNS configuration instructions

#### Step 4: Verify Frontend Deployment
- Visit your Netlify site URL
- Verify the dashboard loads correctly
- Test that data loads from your Render backend
- Check browser console for any CORS or API errors

#### Important Notes:
- Netlify automatically redeploys on every push to your main branch
- Environment variables are encrypted and secure
- Netlify provides free SSL certificates automatically
- For production, consider setting up a custom domain

---

### Post-Deployment Checklist

#### Backend (Render)
- [ ] Backend URL is accessible
- [ ] API endpoints respond correctly (`/api/transactions`, `/api/transactions/options`)
- [ ] MongoDB connection is working
- [ ] CORS is configured to allow your Netlify domain
- [ ] Environment variables are set correctly

#### Frontend (Netlify)
- [ ] Frontend URL is accessible
- [ ] Data loads from backend API
- [ ] Search functionality works
- [ ] Filters and pagination work correctly
- [ ] Environment variable `VITE_API_URL` is set correctly

#### Troubleshooting
- **Backend not accessible:** Check Render logs for errors, verify PORT binding to `0.0.0.0`
- **CORS errors:** Ensure backend CORS allows your Netlify domain
- **API not loading:** Verify `VITE_API_URL` environment variable in Netlify dashboard
- **Build failures:** Check build logs in Render/Netlify dashboard for specific errors

---
