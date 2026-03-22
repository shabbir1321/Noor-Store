import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

await signInAnonymously(auth);
console.log("Signed in successfully.");

// Check existing products first
const existing = await getDocs(collection(db, "products"));
console.log(`Found ${existing.size} existing product(s).`);

const products = [
    {
        name: "Classic White T-Shirt",
        category: "Apparel",
        price: 499,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772578674/standard-plain-round-neck-shirt-white_258aab92-9088-42a0-9dbf-c9867a82ebeb_large_xujfjs.png",
        desc: "A premium-quality plain white round-neck t-shirt crafted from 100% combed cotton. Lightweight, breathable, and perfect for custom printing. Ideal for casual wear, corporate events, and personalized gifting.",
        colors: ["#ffffff", "#000000", "#c0c0c0"],
        status: "active",
        isFeatured: true,
        createdAt: new Date("2026-03-01")
    },
    {
        name: "Premium Insulated Water Bottle",
        category: "Drinkware",
        price: 799,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772613392/scoria-GREEN-3-WATER-BOTTLE-stainless-steel-water-bottle-best-cold-hot-bottle-sustainable_649d66b8-4da5-457d-99a3-e32853526087_zbs1va.jpg",
        desc: "A premium stainless steel insulated water bottle designed to keep your drinks cold for 24 hours and hot for 12 hours. Perfect for gifting, corporate events, or everyday use. Customize it with your logo or text for a lasting impression.",
        colors: ["#2d6a4f", "#000000", "#ffffff", "#1a3c5e"],
        status: "active",
        isFeatured: true,
        createdAt: new Date("2026-03-04")
    }
];

// Only add products that don't already exist (check by name)
const existingNames = existing.docs.map(d => d.data().name);

for (const product of products) {
    if (existingNames.includes(product.name)) {
        console.log(`⏭️  "${product.name}" already exists, skipping.`);
    } else {
        const docRef = await addDoc(collection(db, "products"), product);
        console.log(`✅ Added "${product.name}" → ID: ${docRef.id}`);
    }
}

console.log("Done!");
process.exit(0);
