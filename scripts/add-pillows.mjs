import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const categoryName = "Customized Pillows";
const categoryImg = "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144420/WhatsApp_Image_2025-06-11_at_10.59.19_AM_1_qpldxy.jpg";

const pillows = [
    {
        name: "Square Custom Photo Pillow",
        desc: "A classic square-shaped pillow that can be personalized with your favorite high-definition photo. Made from soft, durable fabric, it's perfect for adding a personal touch to your living room or bedroom.",
        price: 499,
        category: categoryName,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144420/WhatsApp_Image_2025-06-11_at_10.59.19_AM_1_qpldxy.jpg",
        images: ["https://res.cloudinary.com/df9pom0nq/image/upload/v1774144420/WhatsApp_Image_2025-06-11_at_10.59.19_AM_1_qpldxy.jpg"],
        status: "active",
        isFeatured: true
    },
    {
        name: "Heart-Shaped Photo Pillow",
        desc: "Express your love with this beautiful heart-shaped pillow. Personalize it with a special photo to create a memorable gift for anniversaries, birthdays, or Valentine's Day. Soft and cuddly with premium stuffing.",
        price: 599,
        category: categoryName,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144419/WhatsApp_Image_2025-06-11_at_10.59.18_AM_1_xfkcir.jpg",
        images: ["https://res.cloudinary.com/df9pom0nq/image/upload/v1774144419/WhatsApp_Image_2025-06-11_at_10.59.18_AM_1_xfkcir.jpg"],
        status: "active",
        isFeatured: true
    },
    {
        name: "Customized Sequin Magic Pillow",
        desc: "A fun and interactive sequin pillow. Brush the sequins to reveal your personalized photo! This magic pillow is a great conversation starter and a unique decorative piece for any home.",
        price: 699,
        category: categoryName,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144419/WhatsApp_Image_2025-06-11_at_10.59.16_AM_1_crpnww.jpg",
        images: ["https://res.cloudinary.com/df9pom0nq/image/upload/v1774144419/WhatsApp_Image_2025-06-11_at_10.59.16_AM_1_crpnww.jpg"],
        status: "active",
        isFeatured: false
    },
    {
        name: "Premium Velvet Photo Pillow",
        desc: "Experience luxury with this premium velvet pillow. Features a soft, plush texture and vibrant photo printing that won't fade. An elegant addition to any home decor setup.",
        price: 549,
        category: categoryName,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1774144418/WhatsApp_Image_2025-06-11_at_10.59.12_AM_gdkzyf.jpg",
        images: ["https://res.cloudinary.com/df9pom0nq/image/upload/v1774144418/WhatsApp_Image_2025-06-11_at_10.59.12_AM_gdkzyf.jpg"],
        status: "active",
        isFeatured: false
    }
];

async function addPillows() {
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

        // 2. Add Pillow Products
        const prodRef = collection(db, "products");
        for (const pillow of pillows) {
            // Check if product already exists to avoid duplicates
            const prodSnap = await getDocs(query(prodRef, where("name", "==", pillow.name)));
            if (prodSnap.empty) {
                await addDoc(prodRef, {
                    ...pillow,
                    createdAt: new Date()
                });
                console.log(`✅ Added pillow: ${pillow.name}`);
            } else {
                console.log(`ℹ️ Pillow ${pillow.name} already exists.`);
            }
        }

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to add pillows:", err);
        process.exit(1);
    }
}

addPillows();
