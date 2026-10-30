# Task 5: E-Commerce Product Interface - VeloShop

A modern, vibrant, and fully responsive e-commerce frontend interface for a fictional streetwear brand called **VeloShop**. This project was built as part of the Frontend Developer Internship program at Auspify Technologies.

## 🚀 Live Demo
([https://kusnadi34.github.io/Task-5_E-commerce-Interface/])

## ✨ Features

- **Product Catalog:** Display products dynamically using a responsive grid layout.
- **Search & Filters:** Real-time search and category filtering (Apparel, Accessories, Footwear).
- **Sorting:** Sort products by price and name.
- **Shopping Cart:** A fully functional slide-out cart drawer to add, remove, and update item quantities.
- **Local Storage Persistence:** Cart data is saved in the browser, so items don't disappear on page refresh.
- **Interactive Modals:** Product detail views and a simulated checkout form.
- **Mobile-First Design:** Seamless experience across mobile, tablet, and desktop screens.

## 🛠 Tech Stack

- **HTML5:** Semantic structure.
- **CSS3:** Custom properties (CSS Variables), Flexbox, CSS Grid, and Media Queries.
- **Vanilla JavaScript (ES6+):**
  - **Component-Based Architecture:** Separated logic into `data.js` (mock database), `components.js` (UI rendering), and `app.js` (main logic).
  - **State Management:** Managed cart state without any external library.
  - **Event Delegation:** Efficient DOM event handling.
  - **Debouncing:** Implemented on the search input for better performance.

## 📁 Folder Structure

```text
Task-5_E-commerce-Interface/
├── assets/               # SVG product icons
├── js/
│   ├── app.js            # Main application logic & state
│   ├── components.js     # Reusable UI components
│   └── data.js           # Mock database of products
├── index.html            # Main HTML structure
└── style.css             # Styling and responsive design
