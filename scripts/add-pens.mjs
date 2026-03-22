import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const penCategory = "Customized Pens";
const categoryImg = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714553/WhatsApp_Image_2026-02-18_at_10.39.03_AM_z71o3z.jpg";

const pens = [
    {
        name: "Luxe Engraved Signature Pen",
        desc: "A premium engraved pen featuring a sleek design and superior ink flow. Perfect for professionals and gifting. Refer to the included color guide for available finishes.",
        price: 599,
        category: penCategory,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714553/WhatsApp_Image_2026-02-18_at_10.39.03_AM_z71o3z.jpg",
        images: [
            "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714553/WhatsApp_Image_2026-02-18_at_10.39.03_AM_z71o3z.jpg",
            "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714550/WhatsApp_Image_2026-02-18_at_10.45.29_AM_hwfqo5.jpg" // Color Guide
        ],
        colors: ["#000000", "#1a1a1a", "#c0c0c0", "#ffd700"], // Example colors based on "select particular color"
        isFeatured: true,
        status: "active"
    },
    {
        name: "Sleek Professional Ballpoint",
        desc: "A minimalist ballpoint pen with a comfortable grip and premium metallic finish. Ideal for daily signatures and corporate use.",
        price: 449,
        category: penCategory,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714552/WhatsApp_Image_2026-02-18_at_10.47.32_AM_zl4vkn.jpg",
        colors: [], // No color options
        isFeatured: false,
        status: "active"
    },
    {
        name: "Elite Metallic Fountain Pen",
        desc: "A sophisticated fountain pen with a durable nib and elegant metallic body. Available in multiple premium color options to suit your style.",
        price: 899,
        category: penCategory,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714552/WhatsApp_Image_2026-02-18_at_10.45.28_AM_2_fov7is.jpg",
        colors: ["#000000", "#3b82f6", "#ef4444", "#10b981"], // Give color options
        isFeatured: true,
        status: "active"
    },
    {
        name: "Executive Matte Black Pen",
        desc: "A timeless matte black pen that exudes class and authority. Features a smooth-twist mechanism and high-capacity ink reservoir.",
        price: 649,
        category: penCategory,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714551/WhatsApp_Image_2026-02-18_at_10.39.05_AM_pqka4v.jpg",
        colors: [], // No color options
        isFeatured: false,
        status: "active"
    },
    {
        name: "Premium Custom Metal Pen",
        desc: "A high-quality metal pen designed for precision and durability. Its sturdy build makes it an excellent choice for custom engraving.",
        price: 499,
        category: penCategory,
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773714551/unnamed_lxngjh.jpg",
        colors: [], // No color options
        isFeatured: false,
        status: "active"
    }
];

async function addPens() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously.");

        // 1. Add Category if it doesn't exist
        const catRef = collection(db, "categories");
        const catSnap = await getDocs(query(catRef, where("name", "==", penCategory)));
        
        if (catSnap.empty) {
            await addDoc(catRef, {
                name: penCategory,
                img: categoryImg,
                status: "active",
                createdAt: new Date()
            });
            console.log(`✅ Added category: ${penCategory}`);
        } else {
            console.log(`ℹ️ Category ${penCategory} already exists.`);
        }

        // 2. Add Pen Products
        const prodRef = collection(db, "products");
        for (const pen of pens) {
            // Check if product already exists to avoid duplicates
            const prodSnap = await getDocs(query(prodRef, where("name", "==", pen.name)));
            if (prodSnap.empty) {
                await addDoc(prodRef, {
                    ...pen,
                    createdAt: new Date()
                });
                console.log(`✅ Added pen: ${pen.name}`);
            } else {
                console.log(`ℹ️ Pen ${pen.name} already exists.`);
            }
        }

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to add pens:", err);
        process.exit(1);
    }
}

addPens();
