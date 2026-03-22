import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const imgFront = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478998/WhatsApp_Image_2025-06-11_at_10.42.40_AM_h2jfch.jpg";

async function run() {
    await signInAnonymously(auth);
    console.log("Signed in anonymously.");

    const colRef = collection(db, "products");

    const newProduct = {
        name: "Premium Matte Water Bottle",
        category: "Drinkware",
        price: 899,
        img: imgFront,
        images: [imgFront], // Only one image provided
        desc: "A premium matte finish insulated water bottle. Designed for both style and functionality. Keep your beverages at the perfect temperature all day long. Excellent for gifting and corporate branding.",
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
