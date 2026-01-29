# Project Overview

- **Project Name:** Clothie E-commerce Platform (Brand: Naba Hussam)
- **Domain/Problem Space:** Fashion e-commerce for women's clothing retail in Pakistan
- **Primary Purpose:** A full-stack e-commerce platform enabling customers to browse, customize, and purchase clothing items with support for both ready-to-wear and made-to-order products, featuring guest checkout, multiple payment methods, and comprehensive admin management.

---

# Tech Stack

## Frontend Technologies
- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.1
- **Styling:** Tailwind CSS 3.4.10
- **Routing:** React Router DOM 6.26.1
- **HTTP Client:** Axios 1.7.4
- **Notifications:** React Toastify 10.0.5
- **Language:** JavaScript (ES Modules)

## Backend Technologies
- **Runtime:** Node.js with ES Modules
- **Framework:** Express.js 4.19.2
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcrypt 5.1.1
- **Validation:** validator 13.12.0
- **File Upload:** Multer 1.4.5-lts.1
- **Development:** Nodemon 3.1.10

## Databases
- **Primary Database:** MongoDB (via Mongoose 8.5.3)
- **Database Hosting:** MongoDB Atlas (Cloud)

## External Services / APIs
- **File Storage:** AWS S3 (via @aws-sdk/client-s3 3.0.0)
- **Payment Gateways:** 
  - Stripe 16.8.0 (integrated but currently disabled for RTW products)
  - Razorpay 2.9.4 (integrated but currently disabled for RTW products)
- **Active Payment Methods:** Cash on Delivery (COD), Bank Transfer

## Libraries & Frameworks Actually Used
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, React Toastify
- **Backend:** Express, Mongoose, JWT, bcrypt, Multer, AWS SDK
- **Both:** dotenv for environment configuration

---

# High-Level System Behavior

## User Action → Final Output Flow

1. **User browses products** → Frontend fetches product list from `/api/product/list` → Products displayed with filtering/search capabilities
2. **User adds item to cart** → Cart state updated locally + synced to backend via `/api/cart/add` (if authenticated)
3. **User proceeds to checkout** → Delivery form validated → Order created via `/api/order/place` or `/api/order/place-guest`
4. **Order placed** → Cart cleared → User redirected to thank-you page with order confirmation
5. **Admin manages orders** → Orders fetched from `/api/order/list` → Status updated via `/api/order/status`

## Request/Response Lifecycle

1. Client sends HTTP request with optional JWT token in headers
2. Express middleware validates CORS, parses JSON body
3. Route-specific middleware (auth/adminAuth) validates JWT if required
4. Controller processes business logic, interacts with MongoDB via Mongoose
5. Response returned as JSON with `success` boolean and relevant data
6. Frontend updates React state based on response

---

# Implemented Features

## 1. User Authentication
- **What it does:** Handles user registration, login, and session management using JWT tokens
- **Location:** `ecom-backend/controllers/userController.js`, `ecom-backend/middleware/auth.js`, `ecom-frontend/src/pages/Login.jsx`
- **Inputs:** Email, password, name (for registration)
- **Outputs:** JWT token, user profile data

## 2. Admin Authentication
- **What it does:** Separate admin login with elevated privileges, supports both database admins and environment variable fallback
- **Location:** `ecom-backend/controllers/userController.js`, `ecom-backend/middleware/adminAuth.js`, `ecom-admin/src/components/Login.jsx`
- **Inputs:** Admin email, password
- **Outputs:** Admin JWT token

## 3. Product Management
- **What it does:** Full CRUD operations for products including image upload to S3, category management, Made-to-Order (MTO) and Ready-to-Wear (RTW) product types
- **Location:** `ecom-backend/controllers/productController.js`, `ecom-admin/src/pages/Add.jsx`, `ecom-admin/src/pages/List.jsx`, `ecom-admin/src/pages/Edit.jsx`
- **Inputs:** Product name, description, price, images (up to 4), category, subcategory, sizes, MTO attributes, add-ons
- **Outputs:** Product listing, individual product details

## 4. Category Hierarchy System
- **What it does:** Dynamic category/subcategory management with support for MTO and RTW type assignment
- **Location:** `ecom-backend/models/settingModel.js`, `ecom-admin/src/pages/Add.jsx`, Settings API
- **Inputs:** Main category name, subcategories, product type (MTO/RTW)
- **Outputs:** Hierarchical category tree for navigation and filtering

## 5. Shopping Cart
- **What it does:** Manages cart state with size-specific quantities, add-ons tracking, persistent storage for authenticated users
- **Location:** `ecom-backend/controllers/cartController.js`, `ecom-frontend/src/context/ShopContext.jsx`, `ecom-frontend/src/pages/Cart.jsx`, `ecom-frontend/src/components/CartDrawer.jsx`
- **Inputs:** Item ID, size, quantity, selected add-ons
- **Outputs:** Cart items array, cart total calculation

## 6. Order Management
- **What it does:** Complete order lifecycle from placement to delivery, supporting multiple payment methods, guest checkout, order cancellation, and status tracking
- **Location:** `ecom-backend/controllers/orderController.js`, `ecom-frontend/src/pages/PlaceOrder.jsx`, `ecom-admin/src/pages/Orders.jsx`
- **Inputs:** Cart items, shipping address, payment method, delivery instructions
- **Outputs:** Order confirmation, order status updates, delivery tracking

## 7. Guest Checkout
- **What it does:** Allows non-authenticated users to place orders using email, with automatic linking when account is created
- **Location:** `ecom-backend/controllers/orderController.js` (placeOrder function), `ecom-frontend/src/pages/PlaceOrder.jsx`
- **Inputs:** Guest email, shipping address, cart items
- **Outputs:** Order placed without authentication requirement

## 8. Cash on Delivery (COD) System
- **What it does:** Full COD order management including delivery service assignment, tracking, delivery attempts tracking, and COD analytics
- **Location:** `ecom-backend/controllers/orderController.js` (COD-specific functions), `ecom-admin/src/pages/Orders.jsx`
- **Inputs:** Order ID, delivery service name, tracking ID, delivery status
- **Outputs:** COD order status, delivery tracking info, COD analytics

## 9. Bank Transfer Payment
- **What it does:** Allows customers to pay via bank transfer with payment proof upload
- **Location:** `ecom-backend/controllers/settingController.js`, `ecom-frontend/src/pages/PlaceOrder.jsx`
- **Inputs:** Payment proof image, order ID
- **Outputs:** Order marked as "Pending Verification"

## 10. Product Search
- **What it does:** Global search across product name, category, subcategory, and description with regex matching
- **Location:** `ecom-backend/controllers/productController.js` (searchProducts), `ecom-frontend/src/components/HeaderSearch.jsx`
- **Inputs:** Search query string
- **Outputs:** Matching products (limited to 20 results)

## 11. Made-to-Order (MTO) Features
- **What it does:** Supports custom-made products with deposit payment, design locking, modification requests, and production tracking
- **Location:** `ecom-backend/controllers/orderController.js` (MTO functions), `ecom-frontend/src/pages/Product.jsx`
- **Inputs:** MTO product selections, custom size, design categories
- **Outputs:** MTO order with deposit/balance tracking, modification deadline

## 12. Product Add-ons
- **What it does:** Optional purchasable additions to products (e.g., dupatta) with per-item pricing
- **Location:** `ecom-backend/models/productModel.js`, `ecom-frontend/src/pages/Product.jsx`, `ecom-admin/src/pages/Add.jsx`
- **Inputs:** Add-on name, price, selection state
- **Outputs:** Add-ons added to cart with price calculations

## 13. Shipping Options
- **What it does:** Configurable delivery charges for within Karachi and outside Karachi regions
- **Location:** `ecom-backend/models/settingModel.js`, `ecom-frontend/src/pages/Cart.jsx`, `ecom-frontend/src/context/ShopContext.jsx`
- **Inputs:** Shipping option selection (within_karachi / outside_karachi)
- **Outputs:** Calculated shipping fee added to order total

## 14. Size Chart Management
- **What it does:** Centralized size charts for MTO and RTW products uploaded to S3
- **Location:** `ecom-backend/controllers/settingController.js`, `ecom-admin/src/pages/Settings.jsx`, `ecom-frontend/src/pages/Product.jsx`
- **Inputs:** Size chart images for MTO/RTW types
- **Outputs:** Size chart modal display on product pages

## 15. Analytics Event Tracking
- **What it does:** GA4-compatible e-commerce event tracking (view_item, add_to_cart, remove_from_cart, begin_checkout, purchase)
- **Location:** `ecom-frontend/src/context/ShopContext.jsx`, `ecom-frontend/src/pages/Product.jsx`, `ecom-frontend/src/pages/PlaceOrder.jsx`, `ecom-frontend/src/components/GlobalTracking.jsx`
- **Inputs:** Product/cart data at various user actions
- **Outputs:** DataLayer pushes and gtag events for GTM/GA4

## 16. Admin Settings Management
- **What it does:** Global configuration for bank details, WhatsApp number, delivery charges, home page transitions, product disclaimers
- **Location:** `ecom-backend/controllers/settingController.js`, `ecom-admin/src/pages/Settings.jsx`
- **Inputs:** Various configuration values
- **Outputs:** Stored settings applied across frontend/admin

## 17. Image Upload with S3
- **What it does:** Handles product image uploads to AWS S3 with validation, unique key generation, and public URL return
- **Location:** `ecom-backend/utils/s3.js`, `ecom-backend/controllers/productController.js`
- **Inputs:** Image buffer, file mimetype
- **Outputs:** Public S3 URL for image access

## 18. User Profile Management
- **What it does:** Basic profile viewing and name update functionality
- **Location:** `ecom-backend/controllers/userController.js`, `ecom-frontend/src/pages/Profile.jsx`
- **Inputs:** User ID (from token), new name
- **Outputs:** Profile data, update confirmation

---

# Data Handling

## What Data Enters the System
- **User Data:** Name, email, password, cart data
- **Product Data:** Name, description, price, images, categories, sizes, MTO attributes, add-ons
- **Order Data:** Items, shipping address, payment method, delivery instructions
- **Settings Data:** Bank details, WhatsApp number, delivery charges, size charts, disclaimers

## How Data is Processed
1. **Input Validation:** validator.js for email, custom validations for passwords and required fields
2. **Password Security:** bcrypt hashing with 10 salt rounds
3. **Image Processing:** Multer memory storage → buffer → S3 upload
4. **Cart Calculations:** Client-side calculation with server-side verification
5. **Order Processing:** Validation → Order creation → Cart clearing → Status tracking

## Where Data is Stored
- **MongoDB Atlas:** Users, Products, Orders, Reviews (model exists but commented out), Settings
- **AWS S3:** Product images, size chart images, payment proof images
- **Client LocalStorage:** JWT token, cart data (guest), MTO selections, shipping preferences

## What is Returned to Users
- **JSON Responses:** `{ success: boolean, data/message: ... }`
- **Product Images:** Direct S3 URLs
- **Order Confirmations:** Order ID, estimated delivery date, payment status

---

# Architecture Observations

## Pattern: Modular Monolith with Separate Frontend Apps

The system follows a modular monolith architecture:

### Components:
1. **ecom-frontend:** Customer-facing SPA (React)
2. **ecom-admin:** Admin dashboard SPA (React)
3. **ecom-backend:** Single REST API server (Express)

### Separation of Concerns:
- **Models:** Define data schemas with Mongoose (userModel, productModel, orderModel, settingModel, reviewModel)
- **Controllers:** Business logic separated by domain (user, product, order, cart, settings)
- **Routes:** API endpoint definitions with middleware composition
- **Middleware:** Authentication (auth, adminAuth), file handling (multer)
- **Utilities:** S3 operations, database connection

### Architectural Patterns Observed:
- **MVC-ish:** Models, Controllers, Routes (Views are React components)
- **Context Pattern:** React Context for global state (ShopContext)
- **Repository Pattern (informal):** Controllers access models directly
- **Middleware Chain:** Express middleware for cross-cutting concerns

---

# Performance Considerations

## Optimizations Present
- **Product List Caching:** Products fetched once and stored in React context
- **Debounced Search:** 300ms debounce on search input for API calls
- **Image Lazy Loading:** React's default rendering behavior
- **Cart Persistence:** LocalStorage reduces API calls for guests
- **S3 Direct URLs:** No server proxying for images

## Bottlenecks or Limitations
- **No Database Indexing Explicitly Defined:** Aside from review model's compound index
- **Full Product List Fetch:** All products loaded at once (no pagination in frontend context)
- **No Server-Side Caching:** Each request hits MongoDB
- **Single Database Connection:** No connection pooling configuration visible
- **Sequential Image Uploads:** Images uploaded in Promise.all but could benefit from pre-signed URLs for client-direct uploads
- **No CDN:** S3 URLs used directly without CloudFront

---

# Security Considerations

## Auth/Validation/Sanitization Present
- **JWT Authentication:** Tokens validated on protected routes
- **Password Hashing:** bcrypt with 10 rounds
- **Email Validation:** validator.js
- **CORS Configuration:** Explicit origin whitelist for production domains
- **Admin Separation:** Separate middleware for admin routes
- **Input Validation:** Required field checks in controllers
- **File Type Validation:** Image dimension validation (2:3 aspect ratio)
- **File Size Limits:** 20MB max via Multer configuration
- **Backend-only Binding:** Production backend binds to 127.0.0.1 (localhost only)

## Known Gaps or Missing Security Layers
- **No Rate Limiting:** API endpoints unprotected from brute force
- **No CSRF Protection:** Relies on CORS and token headers
- **No Input Sanitization:** No explicit XSS protection on text inputs
- **JWT No Expiration:** Tokens created without `expiresIn` option
- **Admin Password in Env:** Fallback admin auth uses plaintext password comparison
- **No SQL/NoSQL Injection Prevention:** Mongoose provides some protection, but no explicit sanitization
- **S3 Bucket Public:** Relies on AWS policy for access control
- **Sensitive Data in Deployment Docs:** Credentials visible in DEPLOYMENT.md

---

# Error Handling & Edge Cases

## Errors Handled Explicitly
- **Multer Errors:** File size, file count, unexpected field errors caught in global middleware
- **MongoDB Connection:** Connection event logged
- **S3 Upload Failures:** Try-catch with error re-throw
- **API Response Pattern:** Consistent `{ success: false, message: error.message }` pattern
- **Empty Cart Validation:** Prevents order placement with empty cart
- **Product Not Found:** Returns appropriate error response
- **Invalid ObjectId:** Frontend validates MongoDB ObjectId format

## Failures Not Handled
- **Network Failures:** No retry logic for failed API calls
- **S3 Quota Exceeded:** No specific handling
- **Database Connection Loss:** No reconnection logic
- **Concurrent Order Modifications:** No optimistic locking
- **Payment Gateway Failures:** Basic error return only
- **Image Upload Race Conditions:** No specific handling
- **Session Expiration:** No automatic logout on 401

---

# Deployment & Environment

## Hosting Assumptions
- **VPS:** Linux server (IP: 193.203.190.237)
- **Reverse Proxy:** Nginx handling SSL termination and routing
- **Container Runtime:** Docker with buildx for multi-platform builds
- **Registry:** GitHub Container Registry (GHCR)

## Environment Variables
### Backend:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` - Fallback admin credentials
- `AWS_REGION` - S3 region (eu-north-1)
- `S3_BUCKET` - S3 bucket name
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `STRIPE_SECRET_KEY` (optional) - Stripe payment
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (optional) - Razorpay payment
- `PORT` - Server port (default: 4000)

### Frontend/Admin:
- `VITE_BACKEND_URL` - Backend API base URL

## Build/Runtime Expectations
- **Frontend/Admin:** Vite build produces static files, served via `serve` package
- **Backend:** Direct Node.js execution with `node server.js`
- **Docker Images:** Built for `linux/amd64` platform
- **Port Mapping:**
  - Frontend: 7001:3000
  - Admin: 7002:3000
  - Backend: 7000:4000 (localhost only)

---

# Known Limitations

## Features Partially Implemented
- **Reviews System:** Model exists, controller code commented out, not active
- **Stripe/Razorpay Payments:** Integrated but disabled for RTW products (only COD/Bank Transfer active)
- **Made-to-Order Production Tracking:** Status fields exist but UI for full workflow not visible
- **User Password Reset:** Not Implemented
- **Email Notifications:** Not Implemented
- **Order Invoice Generation:** Not Implemented
- **Inventory/Stock Management:** Not Implemented
- **Wishlist:** Not Implemented
- **Product Variants Beyond Size:** Not Implemented
- **Multi-Currency:** Not Implemented (PKR only)
- **Multi-Language:** Not Implemented

## Missing but Implied Functionality
- **Order Email Confirmations:** Expected for e-commerce but not implemented
- **Password Recovery Flow:** Login exists but no forgot password
- **Admin User Management:** Can't manage admin users from UI
- **Reporting/Dashboard Analytics:** No sales analytics in admin
- **Bulk Product Operations:** No bulk import/export
- **SEO Meta Management:** Basic schema.org markup present but no admin control
