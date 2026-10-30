// Mock data to simulate an API/Database response


const productsData = [
    {
        id: 1,
        name: "Oversized Heavy Tee",
        category: "apparel",
        price: 35,
        description: "Premium heavyweight cotton tee with a relaxed, oversized fit. Perfect for daily streetwear.",
        image: "https://picsum.photos/seed/tee/500/600"
    },
    {
        id: 2,
        name: "Utility Cargo Pants",
        category: "apparel",
        price: 65,
        description: "Durable cargo pants featuring multiple utility pockets and adjustable ankle straps.",
        image: "https://picsum.photos/seed/pants/500/600"
    },
    {
        id: 3,
        name: "Minimalist Cap",
        category: "accessories",
        price: 25,
        description: "Clean, unstructured 6-panel cap made from washed cotton twill.",
        image: "https://picsum.photos/seed/cap/500/600"
    },
    {
        id: 4,
        name: "Chunky Sneakers",
        category: "footwear",
        price: 120,
        description: "Statement chunky sneakers with breathable mesh and premium suede overlays.",
        image: "https://picsum.photos/seed/sneakers/500/600"
    },
    {
        id: 5,
        name: "Canvas Tote Bag",
        category: "accessories",
        price: 20,
        description: "Heavy-duty canvas tote bag with reinforced handles. Fits a 15-inch laptop.",
        image: "https://picsum.photos/seed/bag/500/600"
    },
    {
        id: 6,
        name: "Tech Fleece Hoodie",
        category: "apparel",
        price: 85,
        description: "Ultra-soft tech fleece hoodie with a modern tapered fit and zippered pockets.",
        image: "https://picsum.photos/seed/hoodie/500/600"
    },
    {
        id: 7,
        name: "Classic Slip-Ons",
        category: "footwear",
        price: 70,
        description: "Timeless slip-on shoes with a vulcanized sole and elastic side accents.",
        image: "https://picsum.photos/seed/slipons/500/600"
    },
    {
        id: 8,
        name: "Silver Chain Necklace",
        category: "accessories",
        price: 45,
        description: "925 sterling silver chain necklace. Hypoallergenic and tarnish-resistant.",
        image: "https://picsum.photos/seed/necklace/500/600"
    }
];

// Simulate network request with a delayed
function fetchProductsAPI() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(productsData);
        }, 800); // 800ms delay to show skeleton loadings
    });
}