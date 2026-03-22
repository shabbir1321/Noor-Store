import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const comboImages = [
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773397448/unnamed_1_dwllpp.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398333/WhatsApp_Image_2026-02-18_at_10.39.06_AM_qwogcn.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398337/WhatsApp_Image_2026-02-18_at_10.45.18_AM_1_fcbbvx.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398406/unnamed_1_atvllk.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398389/WhatsApp_Image_2026-02-18_at_10.39.05_AM_1_ger3x8.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398377/WhatsApp_Image_2026-02-18_at_10.45.32_AM_2_fazygl.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398374/WhatsApp_Image_2026-02-18_at_10.45.32_AM_1_xlgqok.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398360/WhatsApp_Image_2026-02-18_at_10.45.28_AM_1_biajz0.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398349/WhatsApp_Image_2026-02-18_at_10.45.18_AM_jzfelz.jpg",
    "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398343/WhatsApp_Image_2026-02-18_at_10.45.30_AM_1_mjq5ff.jpg"
];

async function seed() {
    await signInAnonymously(auth);
    console.log("Signed in anonymously.");

    const colRef = collection(db, "products");

    for (let i = 0; i < comboImages.length; i++) {
        const product = {
            name: `Premium Gift Combo #${i + 1}`,
            category: "Combo",
            price: 1299 + (i * 100), // Variable prices for demo
            img: comboImages[i],
            desc: "A bespoke collection of high-quality products curated for the perfect gifting experience. Elegantly packaged and ready for personalization.",
            colors: ["#ffffff", "#000000", "#c0c0c0"],
            status: "active",
            isFeatured: i < 3, // Feature the first 3
            createdAt: new Date()
        };

        // Check if exists
        const q = query(colRef, where("img", "==", product.img));
        const snap = await getDocs(q);
        
        if (snap.empty) {
            await addDoc(colRef, product);
            console.log(`✅ Added ${product.name}`);
        } else {
            console.log(`⏭️  ${product.name} already exists, skipping.`);
        }
    }

    console.log("Combo seeding complete!");
    process.exit(0);
}

seed().catch(console.error);
