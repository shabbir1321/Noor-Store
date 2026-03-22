import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const imgFront = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478999/WhatsApp_Image_2025-06-11_at_10.59.13_AM_s417ky.jpg";

async function run() {
    await signInAnonymously(auth);
    console.log("Signed in anonymously.");

    const colRef = collection(db, "products");

    const newProduct = {
        name: "Standard Insulated Water Bottle",
        category: "Drinkware",
        price: 699,
        img: imgFront,
        images: [imgFront],
        desc: "A reliable standard insulated water bottle ideal for daily hydration. Durable, lightweight, and perfect for the gym, office, or outdoors.",
        status: "active",
        isFeatured: true,
        createdAt: new Date()
    };

    await addDoc(colRef, newProduct);
    console.log(`✅ Added ${newProduct.name}`);

    process.exit(0);
}

run().catch(console.error);
