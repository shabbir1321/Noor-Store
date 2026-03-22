import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const primaryImg = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478999/WhatsApp_Image_2025-06-11_at_10.59.13_AM_s417ky.jpg";
const additionalImg = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478998/WhatsApp_Image_2025-06-11_at_10.59.09_AM_2_qrbpu4.jpg";

async function run() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously.");

        const colRef = collection(db, "products");

        const newProduct = {
            name: "Eco-Friendly Insulated Flask",
            category: "Drinkware",
            price: 849,
            img: primaryImg,
            images: [primaryImg, additionalImg],
            desc: "A high-performance insulated flask featuring a sleek design and superior temperature retention. Includes a secondary view showing the premium finish and build quality. Perfect for active lifestyles.",
            status: "active",
            isFeatured: true,
            colors: ["#2d6a4f", "#000000", "#ffffff"],
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(colRef, newProduct);
        console.log(`✅ Added ${newProduct.name} (ID: ${docRef.id})`);

        process.exit(0);
    } catch (error) {
        console.error("Failed to add product:", error);
        process.exit(1);
    }
}

run();
