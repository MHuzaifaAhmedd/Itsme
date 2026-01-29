/**
 * Diagram explanations for Clothie E-commerce Case Study
 * Based on CASE_STUDY_ENHANCED.md diagram explanations section
 */

export interface DiagramExplanation {
  whatItRepresents: string;
  howToRead: string;
  engineeringDecision: string;
}

export const clothieDiagramExplanations: Record<string, DiagramExplanation> = {
  'system-architecture': {
    whatItRepresents:
      'The complete system topology showing all applications, services, external dependencies, and network boundaries. This diagram illustrates how two separate frontend applications (Customer SPA and Admin Dashboard) communicate with a centralized Express backend, which interacts with MongoDB for data persistence and AWS S3 for image storage.',
    howToRead: `Horizontal Layers (Left to Right):

1. Frontend Layer: Two independent React SPAs deployed separately
   • Customer Frontend (nabahussam.com) - Shopping experience
   • Admin Dashboard (admin.nabahussam.com) - Store management

2. Reverse Proxy: Nginx handles SSL termination and request routing
   • Routes /api/* to backend
   • Serves static files for frontends

3. Backend Layer: Express API with middleware chain
   • Auth Middleware - JWT validation
   • Multer - File upload handling (memory storage)

4. Data Layer: MongoDB Atlas + AWS S3
   • MongoDB stores users, products, orders, settings
   • S3 stores product images, size charts, payment proofs

5. External Services: Analytics and communication
   • Google Analytics 4 - E-commerce event tracking
   • WhatsApp - Click-to-chat integration
   • Stripe/Razorpay - Integrated but inactive`,
    engineeringDecision: `Modular Monolith Architecture: This hybrid architecture provides deployment flexibility (frontends ship independently) while maintaining business logic centralization in the backend. The single backend avoids microservices complexity while separate frontends enable role-specific optimization and security isolation.

Network Isolation: Backend binds to localhost:7000 only, accessible via Nginx reverse proxy. This prevents direct internet exposure and adds an additional security layer.

S3 Direct URLs: Images served directly from S3 without backend proxying. This reduces backend load, latency, and bandwidth costs while leveraging S3's global edge locations.`,
  },

  'authentication-flow': {
    whatItRepresents:
      'The complete authentication lifecycle for both customers and admins, including the unique guest order linking mechanism that automatically associates guest orders when users create accounts.',
    howToRead: `Four Authentication Paths:

1. Customer Login (Top Left):
   • User submits email/password → POST /api/user/login
   • Backend validates via bcrypt.compare()
   • Valid → Generate JWT → Store in localStorage
   • Invalid → Return error response

2. Customer Registration (Middle Left):
   • Hash password with bcrypt (10 rounds)
   • Create user document
   • Link any guest orders with matching email
   • Generate JWT for immediate login

3. Admin Login (Middle):
   • First checks database for admin user (isAdmin: true)
   • Falls back to environment variables (ADMIN_EMAIL, ADMIN_PASSWORD)
   • Generates admin JWT with isAdmin flag

4. Guest Checkout (Right Side):
   • Creates order with guestEmail and isGuestOrder flag
   • No user document created
   • Orders linked when account registered with same email

Protected Route Flow (Bottom):
   • Subsequent requests include token in headers
   • Auth middleware validates JWT, attaches userId
   • Admin middleware also validates isAdmin flag`,
    engineeringDecision: `Dual Admin System: Database admins allow multiple admin users with proper password hashing. Environment fallback provides bootstrap access without requiring database seeding. Trade-off: env fallback uses plaintext comparison (identified security gap for future fix).

Guest Order Linking: Orders placed without authentication include guestEmail field. On registration, linkGuestOrders() runs a bulk update query to reassign orders. This provides checkout friction reduction while preserving order history capability.

JWT in LocalStorage: Chosen over httpOnly cookies for simpler cross-tab state sync and React SPA integration. Trade-off: Vulnerable to XSS if XSS exists (mitigated by CORS whitelist and input validation).`,
  },

  'order-placement-lifecycle': {
    whatItRepresents:
      'The end-to-end order placement flow from cart review to order confirmation, showing payment method routing, server-side validation, and the divergent paths for COD versus Bank Transfer orders.',
    howToRead: `Frontend Flow (Top Section):
1. Cart Review → Click Checkout
2. Check for MTO Items (made-to-order check)
3. Select Payment Method (COD or Bank Transfer)
4. Validate: MTO items force Bank Transfer
5. If Bank Transfer → Show bank account details
6. Submit Order → POST /api/order/place

Backend Processing (Middle Section):
7. Validate Items (product exists, size valid, qty > 0)
8. Fetch Settings (shipping charges)
9. Calculate Totals (subtotal + addOns + shipping)
10. Create Order Document
11. Branch: COD → Add codDetails subdocument
12. Branch: MTO → Add deposit/balance/deadline fields
13. Save Order to MongoDB
14. Clear User Cart

Response Flow (Bottom Section):
15. Return orderId to client
16. Clear localStorage cart
17. Fire GA4 purchase event
18. Redirect to thank-you page`,
    engineeringDecision: `Payment Method Enforcement: MTO products require Bank Transfer (no COD) because deposits need verification before production starts. Validation happens both client-side (UX) and server-side (security) to prevent bypass.

Server-Side Price Recalculation: Even though frontend sends prices, backend recalculates using database values. This prevents price manipulation via request tampering.

No Database Transactions: Order save and cart clear are separate operations without transaction wrapping. If cart clear fails after order save, order still exists but cart isn't cleared. Accepted trade-off for MVP (documented technical debt).`,
  },

  'product-data-flow': {
    whatItRepresents:
      'The complete product lifecycle from admin creation through S3 upload to customer display, including the image validation pipeline and search functionality.',
    howToRead: `Product Creation Path (Left Side):
1. Admin fills add product form
2. Client validates image aspect ratio (2:3)
3. Invalid → Error toast, Valid → Upload
4. POST /api/product/add (multipart/form-data)
5. Multer captures files to memory buffers
6. Upload each file to S3 via PutObjectCommand
7. Generate public URLs from bucket/region/key
8. Create Product document with image URLs
9. Save to MongoDB products collection

Product Display Path (Right Side):
10. Customer visits collection page
11. GET /api/product/list
12. Backend queries Product.find({})
13. Products cached in ShopContext
14. Render ProductItem components
15. <img> tags load directly from S3 URLs

Search Flow (Bottom):
16. User types in search box
17. 300ms debounce prevents excessive API calls
18. GET /api/product/search?q=...
19. Regex query on name, category, subcategory
20. Return max 20 results`,
    engineeringDecision: `Client-Side Aspect Ratio Validation: Validation happens before upload (fail-fast). This saves bandwidth and improves UX by immediately rejecting invalid images. Trade-off: No server-side validation means API can be bypassed (future enhancement: Sharp.js for server resize).

Memory Storage for Multer: Files buffered in memory rather than disk. This simplifies deployment (no temp file cleanup) but limits concurrent uploads by memory availability.

Context-Level Product Caching: Products fetched once on app load and stored in React Context. All components read from cache. Trade-off: New products not visible until page refresh, but eliminates repeated API calls during navigation.`,
  },

  'cart-state-management': {
    whatItRepresents:
      'Cart state synchronization between client, server, and storage for both guest and authenticated users, including the cart merge logic that runs on login.',
    howToRead: `Guest User Flow (Top Path):
1. Add to Cart clicked (no token present)
2. Update local cart state: {itemId: {size: qty}}
3. Save to localStorage
4. Calculate cart total
5. Display in cart drawer
→ No backend communication

Authenticated User Flow (Middle Path):
1. Add to Cart clicked (token present)
2. Update Context state immediately
3. POST /api/cart/add to backend
4. Update user.cartData in MongoDB
5. Confirmation triggers recalculation
→ Cart persists across devices

Login Merge Flow (Bottom Path):
1. User logs in
2. Fetch cart from database (user.cartData)
3. Read cart from localStorage
4. Merge: dbCart + localCart (additive quantities)
5. Sync merged cart to backend
6. Clear localStorage
7. Recalculate totals`,
    engineeringDecision: `Nested Object Structure: Cart stored as {itemId: {size: quantity}} enables O(1) lookups. Size as key prevents duplicate entries for same product/size combination.

Additive Cart Merge: When user logs in with existing cart, quantities are added (not replaced). Example: Guest cart has M:2, DB cart has M:1 → Result M:3. This prevents data loss from any browsing session.

Separate Add-ons State: cartAddOns stored in separate state object to avoid deep nesting complexity. Each item ID maps to array of selected add-ons.

Zero Backend for Guests: Guest carts never hit API until checkout. This reduces server load and improves performance for non-converting visitors.`,
  },

  'mto-workflow': {
    whatItRepresents:
      'The specialized workflow for Made-to-Order products including custom sizing, deposit payments, modification windows, and production tracking phases.',
    howToRead: `Customer Selection Phase (Top):
1. View MTO product (flagged isMakeToOrder: true)
2. Select design category from mtoAttributes options
3. Choose custom size or view size chart
4. Add to cart with MTO flag

Checkout Enforcement (Middle-Top):
5. Proceed to checkout
6. System detects MTO items
7. Force Bank Transfer (COD disabled)
8. Display bank account details
9. Optional: Upload payment proof
10. Submit order

Backend Processing (Middle):
11. Validate: MTO → Must be Bank Transfer
12. Calculate deposit: total × depositPercentage
13. Calculate balance: total - deposit
14. Set modification deadline: orderDate + days
15. Set balance due date: orderDate + productionDays
16. Create order with MTO-specific fields

Post-Order Lifecycle (Bottom):
17. Admin verifies deposit payment
18. Modification window open (customer can request changes)
19. Deadline reached → Design locked
20. Production starts
21. Balance payment reminder
22. Admin verifies balance payment
23. Ready for delivery`,
    engineeringDecision: `Product Type Enforcement at Checkout: Rather than preventing MTO items from being added to cart, enforcement happens at checkout. This allows customers to browse and save items before committing to the more complex payment process.

Deposit Percentage per Product: Each MTO product can have its own deposit percentage (stored in mtoAttributes). This allows flexibility for different product value tiers.

Modification Deadline Calculation: Deadline calculated from order date (not payment date). This ensures predictable timelines regardless of payment verification delays. Trade-off: If deposit verification is slow, customer loses modification time.

Two-Stage Payment: Deposit secures the order and starts modification window. Balance due before delivery. This protects both parties: customer has time to finalize details, business has deposit commitment before production investment.`,
  },
};
