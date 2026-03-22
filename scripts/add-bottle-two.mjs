import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const imgFront = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478998/WhatsApp_Image_2025-06-11_at_10.42.41_AM_uodol6.jpg";
const imgInside = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478998/WhatsApp_Image_2025-06-11_at_10.42.43_AM_epdigc.jpg";

async function run() {
    await signInAnonymously(auth);
    console.log("Signed in anonymously.");

    const colRef = collection(db, "products");

    const newProduct = {
        name: "Classic Insulated Water Bottle",
        category: "Drinkware",
        price: 799,
        img: imgFront,
        images: [imgFront, imgInside],
        desc: "A sleek and durable insulated water bottle designed for daily use. Keep your beverages at the perfect temperature all day long. Excellent for gifting and corporate branding.",
        colors: ["#2d6a4f", "#000000", "#ffffff"],
        status: "active",
        isFeatured: true,
        createdAt: new Date()
    };

    await addDoc(colRef, newProduct);
    console.log(`✅ Added ${newProduct.name}`);

    process.exit(0);
}

run().catch(console.error);
