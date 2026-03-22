import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, serverTimestamp, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const newProducts = [
    {
        name: "Personalized Metal Key Chain",
        desc: "Durable and stylish metal key chain. High-quality engraving. Customization available.",
        price: 249,
        category: "Accessories",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618539/61HEsM2wp9L._AC_UY1000__pnqd3o.jpg",
        isFeatured: true
    },
    {
        name: "Custom Fridge Magnet",
        desc: "High-quality gloss finish magnets for your fridge. Create memories. Customization available.",
        price: 149,
        category: "Personalized Gifts",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618657/71OhoK9xm-L._AC_UF894_1000_QL80__mkbq8w.jpg",
        isFeatured: false
    },
    {
        name: "Official Custom Badges",
        desc: "Crisp, vibrant printing on durable metal/plastic badges. Perfect for schools and events. Customization available.",
        price: 49,
        category: "Stationery",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618767/printed-school-batches-500x500_jbv7yq.jpg",
        isFeatured: false
    },
    {
        name: "Bespoke Achievement Trophy",
        desc: "Premium gold-finish trophies for corporate recognition, sports, and academic excellence.",
        price: 1499,
        category: "Corporate Gifts",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618791/32_trophy_deals_mulygd.jpg",
        isFeatured: false
    },
    {
        name: "Customized Wooden Name Pen",
        desc: "Elegant wooden pen with personalized name engraving. Ideal for executives and teachers. Customization available.",
        price: 499,
        category: "Stationery",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618845/Personalized-Wooden-Pen-Name-Pen-Best-Gift-For-Teachers-Gift-For-Employees-1_hkxyfd.jpg",
        isFeatured: true
    },
    {
        name: "Premium Executive Diary",
        desc: "High-quality bound diary with premium paper and elegant cover. Perfect for professional use. Customization available.",
        price: 599,
        category: "Stationery",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618913/02-diaryprinting_tleow1.jpg",
        isFeatured: false
    },
    {
        name: "Customized Photo Pillow",
        desc: "Soft, high-quality fabric pillow with vibrant photo printing. A perfect heart-warming gift. Customization available.",
        price: 899,
        category: "Home Decor",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618982/Customized-Pillow-for-Husband_rqzxsc.webp",
        isFeatured: true
    },
    {
        name: "Handcrafted Wooden Pen Stand",
        desc: "Beautifully organized desktop pen stand with premium finish. Customization available.",
        price: 349,
        category: "Stationery",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772619064/71DC9AMa2NL_awxtev.jpg",
        isFeatured: false
    },
    {
        name: "Universal Metal Phone Stand",
        desc: "Minimalist, sturdy metal stand for all smartphone sizes. Ergonomic design.",
        price: 299,
        category: "Accessories",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772619118/61haiIaBuSL._AC_UF1000_1000_QL80__flqo7z.jpg",
        isFeatured: false
    },
    {
        name: "Minimalist Metal Card Holder",
        desc: "Sleek, RFID-blocking metal card holder for credit and business cards.",
        price: 399,
        category: "Accessories",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772619139/MetalWallet966x644_vaamqg.jpg",
        isFeatured: false
    },
    {
        name: "Personalized Photo LED Lamp",
        desc: "Custom engraved LED acrylic lamp. Stunning nighttime ambient light. Customization available.",
        price: 1899,
        category: "Home Decor",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772619200/large1749715573_6116X-GIBGL._SX522__ub4qrd.jpg",
        isFeatured: false
    },
    {
        name: "Customized Men's Leather Wallet",
        desc: "Premium leather wallet with custom name and charm feature. Durable and elegant. Customization available.",
        price: 799,
        category: "Accessories",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772619247/IMG-20240911-WA0087_1200x_mpjgw2.jpg",
        isFeatured: true
    }
];

async function runBulkMigration() {
    try {
        console.log("Signing in anonymously...");
        await signInAnonymously(auth);

        const prodCol = collection(db, "products");
        const catCol = collection(db, "categories");

        console.log("Migrating products...");
        const categoriesMap = {};

        for (const p of newProducts) {
            // Check if product exists
            const q = query(prodCol, where("name", "==", p.name));
            const snap = await getDocs(q);

            if (snap.empty) {
                await addDoc(prodCol, {
                    ...p,
                    status: "active",
                    createdAt: serverTimestamp(),
                    colors: ["#ffffff", "#000000"]
                });
                console.log(`✅ Added: ${p.name}`);
            } else {
                console.log(`⏩ Skipping (exists): ${p.name}`);
            }

            // Track category for creation/update
            if (!categoriesMap[p.category]) {
                categoriesMap[p.category] = p.img;
            }
        }

        console.log("Syncing categories...");
        for (const [catName, catImg] of Object.entries(categoriesMap)) {
            const q = query(catCol, where("name", "==", catName));
            const snap = await getDocs(q);

            if (snap.empty) {
                await addDoc(catCol, {
                    name: catName,
                    img: catImg,
                    status: "active",
                    createdAt: serverTimestamp()
                });
                console.log(`📂 Created Category: ${catName}`);
            } else {
                // Update image if it's generic (optional, but good for freshness)
                const docId = snap.docs[0].id;
                await setDoc(doc(db, "categories", docId), { img: catImg }, { merge: true });
                console.log(`📂 Updated Category Image: ${catName}`);
            }
        }

        console.log("Bulk migration complete! 🚀");
        process.exit(0);
    } catch (err) {
        console.error("Bulk migration failed:", err);
        process.exit(1);
    }
}

runBulkMigration();
