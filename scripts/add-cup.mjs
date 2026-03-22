import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const categoryName = "Cups";
const thumbnailImg = "https://res.cloudinary.com/df9pom0nq/image/upload/v1774143496/2-1_kbm1k5.jpg";
const extraImg = "https://res.cloudinary.com/df9pom0nq/image/upload/v1774143496/2-4_ca7cml.webp";

async function addCup() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously.");

        // 1. Add Category if it doesn't exist
        const catRef = collection(db, "categories");
        const catSnap = await getDocs(query(catRef, where("name", "==", categoryName)));
        
        if (catSnap.empty) {
            await addDoc(catRef, {
                name: categoryName,
                img: thumbnailImg,
                status: "active",
                createdAt: new Date()
            });
            console.log(`✅ Added category: ${categoryName}`);
        } else {
            console.log(`ℹ️ Category ${categoryName} already exists.`);
        }

        // 2. Add Cup Product
        const prodRef = collection(db, "products");
        const productName = "Customized Ceramic Mug";
        
        // Check if product already exists to avoid duplicates
        const prodSnap = await getDocs(query(prodRef, where("name", "==", productName)));
        if (prodSnap.empty) {
            await addDoc(prodRef, {
                name: productName,
                desc: "A high-quality ceramic mug perfect for customization. Featuring a smooth finish and durable build, it's ideal for personalized photos, logos, or text. A great gift for any occasion.",
                price: 399,
                category: categoryName,
                img: thumbnailImg,
                images: [thumbnailImg, extraImg],
                status: "active",
                isFeatured: true,
                createdAt: new Date()
            });
            console.log(`✅ Added cup: ${productName}`);
        } else {
            console.log(`ℹ️ Cup ${productName} already exists.`);
        }

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to add cup:", err);
        process.exit(1);
    }
}

addCup();
