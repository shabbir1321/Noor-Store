import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const categoryName = "Lamps";
const categoryImg = "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144203/flimu_512_j7osxk.webp";

const lamps = [
    {
        name: "3D Acrylic Personalized Lamp",
        desc: "A stunning 3D acrylic lamp that can be personalized with your favorite photo or design. Features multiple color modes and a sleek wooden base. Perfect for home decor and gifting.",
        price: 999,
        category: categoryName,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144203/flimu_512_j7osxk.webp",
        images: ["https://res.cloudinary.com/df9pom0nq/image/upload/v1774144203/flimu_512_j7osxk.webp"],
        status: "active",
        isFeatured: true
    },
    {
        name: "Customized Signature LED Lamp",
        desc: "An elegant LED lamp featuring a custom signature or message engraved on high-quality acrylic. Warm light illumination creates a cozy atmosphere. A unique and thoughtful gift.",
        price: 1299,
        category: categoryName,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144204/WhatsApp_Image_2025-04-12_at_3.18.46_PM_fn8qwz.jpg",
        images: ["https://res.cloudinary.com/df9pom0nq/image/upload/v1774144204/WhatsApp_Image_2025-04-12_at_3.18.46_PM_fn8qwz.jpg"],
        status: "active",
        isFeatured: false
    }
];

async function addLamps() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously.");

        // 1. Add Category if it doesn't exist
        const catRef = collection(db, "categories");
        const catSnap = await getDocs(query(catRef, where("name", "==", categoryName)));
        
        if (catSnap.empty) {
            await addDoc(catRef, {
                name: categoryName,
                img: categoryImg,
                status: "active",
                createdAt: new Date()
            });
            console.log(`✅ Added category: ${categoryName}`);
        } else {
            console.log(`ℹ️ Category ${categoryName} already exists.`);
        }

        // 2. Add Lamp Products
        const prodRef = collection(db, "products");
        for (const lamp of lamps) {
            // Check if product already exists to avoid duplicates
            const prodSnap = await getDocs(query(prodRef, where("name", "==", lamp.name)));
            if (prodSnap.empty) {
                await addDoc(prodRef, {
                    ...lamp,
                    createdAt: new Date()
                });
                console.log(`✅ Added lamp: ${lamp.name}`);
            } else {
                console.log(`ℹ️ Lamp ${lamp.name} already exists.`);
            }
        }

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to add lamps:", err);
        process.exit(1);
    }
}

addLamps();
