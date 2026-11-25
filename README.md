# Incartion Style Studio

You are a senior frontend engineer and UI/UX designer. Build a complete, production-quality, frontend-only e-commerce website for "Incartion", a garment supplier based in Bhubaneswar, Odisha, India. Incartion sells garments from a minimum order of 1 piece up to bulk quantities for corporate and industrial clients.

The visual theme, layout patterns and UX must closely resemble Myntra (see the "Myntra Style Guide" section). There is NO backend and NO database. Use localStorage for all persistence (demo purposes). Payment is simulated.

======================================================
1. TECH STACK
======================================================
- React 18 + Vite, React Router v6
- Tailwind CSS (custom theme tokens)
- Framer Motion for animations and page transitions
- Zustand (or Context + useReducer) for state, persisted to localStorage
- Swiper.js for carousels and hero slider
- CSS 3D transforms for tilt cards, plus an optional lightweight react-three-fiber / three.js 3D element in the hero (rotating garment/hanger or floating fabric). It must be lazy-loaded and disabled on low-end or mobile devices
- canvas-confetti for the order success celebration
- jsPDF + jspdf-autotable (or html2canvas) for invoice PDF download
- lucide-react icons
- react-hot-toast for notifications
- Generate realistic mock data in /src/data (products.js, categories.js, coupons.js, reviews.js). Use Unsplash image URLs or placeholders

======================================================
2. MYNTRA STYLE GUIDE
======================================================
- Primary: Myntra pink #FF3F6C, accent orange #FF905A, dark text #282C3F, muted text #7E818C, border #EAEAEC, light bg #F5F5F6, success #03A685, star-rating green #14958F
- Font: "Inter" or "Assistant" (Whitney-like), clean, bold uppercase for small headings
- White background, thin borders, minimal shadows, rounded 2-4px corners on cards, pill buttons for CTAs
- Sticky top navbar: logo left, category mega-menu in the center (hover opens a full-width dropdown with sub-categories in columns), search bar, then Profile, Wishlist and Bag icons with count badges on the right. On mobile: hamburger drawer, a search icon, and a sticky bottom navigation bar (Home, Categories, Wishlist, Bag, Profile)
- Product card: image with hover swap to the second image, a rating badge at the bottom-left of the image ("4.2 ★ | 1.2k"), brand/title, product name, price in bold with strike-through MRP and a pink/orange "(40% OFF)", and a wishlist heart on hover
- Filter sidebar on the left in the products page (desktop), a bottom-sheet "Filter / Sort" bar on mobile
- Pink primary buttons with uppercase bold text (e.g. "ADD TO BAG", "PLACE ORDER")
- Skeleton loaders, smooth hover and scroll-reveal animations

======================================================
3. GLOBAL FEATURES
======================================================
A) Top Offer Ticker (every page, above navbar on Home; thin one on Product Details page)
 - A single-line marquee/auto-scrolling strip showing current trending coupons: e.g. "Use INCART10 – Get 10% OFF up to ₹500 | BULK20 – 20% OFF on 50+ pcs | WELCOME100 – Flat ₹100 OFF on first order"
 - Pull from coupons.js (only active ones). Pause on hover. Clicking a coupon copies the code with a toast
 - On the Product Details page show only a small single line version

B) Navbar
 - Before login: "Login / Signup" button. After login: it converts into a premium profile avatar (initials circle + name) with a dropdown containing exactly 3 items: My Orders, My Addresses, Logout
 - Category mega-menu: all 6 categories with sub-categories (see section 4). Clicking goes to /products?category=...&sub=...
 - On the Products page, a sticky secondary category/sub-category bar appears when scrolling

C) Auth (frontend demo)
 - Login/Signup page (and a modal version) with tabs: Login with Email + Password, Signup with Name, Email/Mobile, Password. Validate inputs. Store users in localStorage and session in localStorage ("incartion_user")
 - Optional mock OTP login (any 6 digits works)
 - Browsing is open to everyone. Login is REQUIRED only when the user clicks "Add to Bag" / opens the cart / checks out. If not logged in, open the login modal, and after a successful login continue the pending action (add the product automatically)
 - Protected routes: /cart, /checkout, /orders, /addresses

D) Responsive design: 50% of users are on desktop and 50% on mobile. Design mobile-first with breakpoints (360, 640, 768, 1024, 1280, 1536). Touch-friendly targets (min 44px), no horizontal scroll, swipeable carousels, sticky "Add to Bag" bar on the mobile product page, and bottom-sheets for filters and sort.

======================================================
4. CATEGORIES AND SUB-CATEGORIES (use as the source of truth)
======================================================
- Medical Uniform: Scrub Suit, Aprons
- Corporate: Shirt, Trouser, Blazer
- Hotel Uniform: Aprons, Shirt, Trouser, Blazer, Chef Coat, Waistcoat
- Industrial: Dungaree, Shirt, Trouser, Safety Jacket
- School Uniform: Shirt, Trouser, Skirt, Tie & Belt, Blazer (placeholder subcategories; keep them easy to edit in categories.js)
- T-Shirt: Round Neck, Polo

Each category has a background image, name, a short tagline and a sub-category list. Generate at least 3-4 products per sub-category (around 60-80 products total).

Product data model:
{ id, name, slug, category, subCategory, material (Cotton, Polyester, Poly-Cotton, Denim, Linen, Blend, Nylon), price, mrp, discountPercent, rating, ratingCount, images[4], description, sizes ["XS","S","M","L","XL","XXL","3XL"], colors, overview (fabric, fit, GSM, etc.), washCare[], designGuideline (logo placement, embroidery, custom printing, min-quantity notes), bulkPricing tiers [{minQty:1, price}, {minQty:10, price}, {minQty:50, price}, {minQty:100, price}], tags, isNew, isBestSeller, stock }

======================================================
5. PAGES
======================================================

5.1 HOME PAGE ( / )
 1. Offer ticker at the very top (see 3A)
 2. Hero section: a full-width auto-playing, swipeable, scrollable slider with 4-5 beautiful slides (Corporate Wear, Medical Uniforms, Hotel Uniforms, Bulk Orders from 1 pc). Each slide has a headline, a subheading, a CTA button and a parallax image. Add a subtle 3D effect (tilt/parallax on mouse move, floating garment or fabric element). Pagination dots + arrows
 3. Shop by Category: a grid of all 6 categories as large cards with a background image, a dark gradient overlay, the category name and a 3D tilt hover effect. Clicking a category expands/reveals its sub-category chips (or navigates to a sub-category picker view with image tiles). Clicking a sub-category goes to /products?category=X&sub=Y, where the filter is auto-selected
 4. Offers & Coupons section: attractive coupon cards (dashed ticket style, a code with a "Copy" button, discount details, minimum order, expiry), in a horizontally scrollable row
 5. Deals of the Day / Flat Discount banners (Myntra-style big discount tiles: "UP TO 50% OFF")
 6. Bulk Order / Corporate Quote section: a CTA banner "Ordering 50+ pieces? Get custom pricing", with a button that opens a Request Quote modal (name, company, phone, category, quantity, message), saved in localStorage
 7. Trending / Best Sellers carousel
 8. New Arrivals carousel
 9. Why Choose Incartion: icons for custom logo embroidery, from 1 pc to bulk, fast delivery, quality fabric, GST invoice, pan-India shipping
 10. Our Process (Choose -> Customize -> Order -> Delivered) animated timeline
 11. Customer Testimonials / Corporate clients logos marquee
 12. Instagram-style gallery or a "Shop the Look" grid
 13. Newsletter subscribe
 14. Footer: links, categories, contact (Bhubaneswar, Odisha), social icons, payment icons, policies

5.2 PRODUCTS PAGE ( /products )
 - Breadcrumbs, a title with result count, and a Sort dropdown
 - Left filter sidebar (a bottom-sheet on mobile) with:
   * Category (checkboxes) with nested Sub-category (auto-selected from URL params, e.g. ?category=corporate&sub=shirt)
   * Price range (dual slider + min/max inputs)
   * Material (checkboxes)
   * Sort by: Recommended, Price Low to High, Price High to Low, Rating, Newest, Discount
   * "Clear all" and applied-filter chips at the top
 - Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop. Each card shows image, name, avg rating, price, MRP and discount, and a wishlist heart
 - When scrolling, the sticky navbar shows a category/sub-category strip. Pagination or infinite scroll with skeletons. Empty-state UI when there are no results. Sync all filters to URL query params

5.3 PRODUCT DETAILS PAGE ( /product/:slug )
 - Thin single-line coupon ticker at the top: "Use INCART10 to get 10% OFF (up to ₹500)..." (small and moving)
 - Left: exactly 4 product images (thumbnail strip + large image with hover zoom on desktop, swipe gallery on mobile)
 - Right/main info, in this order:
   1. Product name
   2. Average rating + review count
   3. Description
   4. Price (+ MRP + discount %) and the bulk-pricing tier table (price per piece auto-changes with total quantity)
   5. Size selector: for EACH size (XS-3XL) a quantity stepper (-/+ with a number input). The customer sets a quantity per size. Show the total pieces
   6. Note for our team (textarea): for logo/embroidery/colour/special instructions
   7. Calculated Bill box: per-size breakdown, total pieces, applied bulk price, subtotal, discount, GST (e.g. 12% or 5%), and the grand total. It updates live
   8. Buttons: ADD TO BAG (primary) and WISHLIST. A sticky bottom bar on mobile
   9. Pincode delivery check (mock), a size chart modal, and share
 - Below, as tabs or accordions:
   * Product Overview
   * Wash Care
   * Design Guideline
 - Reviews section: rating summary (a star distribution bar graph), a list of reviews (name, rating, date, text, "Verified Buyer" badge). Only reviews submitted from the My Orders page appear here (per product), merged with the seed reviews
 - Related Products carousel (same category/sub-category)
 - Recently viewed products

5.4 CART PAGE ( /cart ) (login required)
 - Myntra-style two-column layout: the cart items list (image, name, size-wise quantity breakdown, edit quantity, remove, move to wishlist, team note) + the price details panel
 - Coupon box: input + "Apply" + a list of available coupons (click to apply). Validate min order value, expiry and max discount, and show an error/success message. Show the "You saved ₹X" line
 - Price details: total MRP, discount, coupon discount, GST, delivery fee (free above ₹999), total payable
 - "PLACE ORDER" button, which leads to checkout

5.5 CHECKOUT ( /checkout ): a stepper UI (Bag -> Address -> Payment)
 - Step 1, Address (MANDATORY): list of saved addresses to select, or an "Add New Address" form (name, mobile, pincode, address, locality, city, state, type Home/Work, a default checkbox). The user cannot continue without a selected address
 - Step 2, Payment options: UPI (enter a UPI ID / QR display), Credit/Debit Card (with a number/expiry/CVV format validation), Net Banking, Wallets, Cash on Delivery, and "Pay Later / Request Invoice" for corporate. Simulate a 2-3 second processing loader with a random success (and a "retry" state for failure)
 - Order summary at the right/bottom (collapsible on mobile)

5.6 ORDER SUCCESS MODAL
 - After a successful payment show a full-screen celebration modal: confetti burst + animated checkmark (Lottie-like SVG animation) + "Order Placed Successfully! 🎉" + an order ID, the amount and the estimated delivery date
 - Two buttons: "View My Orders" -> /orders and "Continue Shopping" -> / (home)

5.7 MY ORDERS ( /orders ) (premium, attractive UI)
 - Order cards with the order ID, date, items, the total and a status badge
 - A beautiful animated vertical/horizontal tracking timeline: Order Placed -> Confirmed -> Packed -> Shipped -> Out for Delivery -> Delivered (with dates and icons, a glowing current step, a progress bar). For the demo, auto-progress the status over time (or add a "Simulate next status" dev button) so that the user can reach "Delivered"
 - Order details drawer/page: items, size-wise quantities, the address, the payment info, the bill
 - After the status is Delivered:
   * "Download Invoice" button, which generates a professional GST-style PDF invoice (Incartion logo, address in Bhubaneswar, invoice no., billing/shipping address, itemised table, taxes, total, terms) with jsPDF
   * "Rate & Review" button for EACH product in the order: a star rating, a title, text and (optional) photo upload (base64). Saved to localStorage and displayed on that product's detail page in the Reviews section
 - "Cancel order" (only before Shipped) and "Reorder" buttons

5.8 MY ADDRESSES ( /addresses )
 - A list/grid of address cards with Add, Edit, Delete and Set Default. The addresses added here appear on the checkout page

5.9 ABOUT US ( /about ): the Incartion story, a mission/vision, the stats counters (animated), manufacturing process, the team, why us, a timeline, a Bhubaneswar-based factory/office photos, and a CTA

5.10 CONTACT US ( /contact ): a contact form with validation (saved to localStorage and shown with a success toast), the address, phone, email, working hours, a Google Maps iframe embed of Bhubaneswar, a floating WhatsApp button, and an FAQ accordion

5.11 Others: Wishlist page, a 404 page, Search results page/search suggestions dropdown, and a Terms/Privacy/Shipping policy basic page

======================================================
6. EXTRA FEATURES TO ADD (my suggestions, implement them)
======================================================
- Wishlist (persisted), recently viewed, and product search with suggestions
- Bulk pricing tiers and a "Request a Quote" form for corporate clients
- Dark overlay quick-view modal for products on the grid (desktop)
- Size chart modal, pincode serviceability check
- Skeleton loaders, lazy-loaded images, route-based code splitting
- Toast notifications and a mini-cart drawer on "Add to Bag"
- Scroll-to-top button, a floating WhatsApp/Call button
- SEO meta tags (react-helmet-async), accessible markup (ARIA, keyboard focus), and image alt texts
- Smooth page transitions and scroll-reveal animations
- Respect prefers-reduced-motion

======================================================
7. LOCALSTORAGE KEYS
======================================================
incartion_users, incartion_session, incartion_cart, incartion_wishlist, incartion_addresses (per user), incartion_orders (per user), incartion_reviews, incartion_quotes, incartion_contacts, incartion_recent

======================================================
8. COUPONS (coupons.js)
======================================================
[ { code:"WELCOME100", type:"flat", value:100, minOrder:499, desc:"Flat ₹100 OFF on your first order" },
  { code:"INCART10", type:"percent", value:10, maxDiscount:500, minOrder:999 },
  { code:"BULK20", type:"percent", value:20, maxDiscount:5000, minOrder:5000, minQty:50 },
  { code:"CORP15", type:"percent", value:15, maxDiscount:3000, minOrder:3000 } ]
Include an expiry date for each coupon and an "active" flag.

======================================================
9. CODE QUALITY / DELIVERABLES
======================================================
- A clean folder structure: /components, /pages, /store, /hooks, /utils, /data, /assets
- Reusable components (ProductCard, FilterSidebar, CouponCard, QuantitySizeSelector, OrderTimeline, AddressForm, etc.)
- Fully working end-to-end flow: Browse -> Product -> Add to Bag (login gate) -> Cart + Coupon -> Address -> Payment -> Success modal -> My Orders -> Delivered -> Invoice + Review -> Review visible on the product page
- Pixel-polished on both mobile (360-430px) and desktop (1280px+). Test both
- Provide the setup and run instructions (npm install, npm run dev) and a short README

Start by creating the project structure, the design tokens and the mock data, then build the pages one by one, and make sure each page works before moving on.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/585a40c1-ca74-4609-bb17-ee783411e26b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
