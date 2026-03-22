import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

async function migrate() {
    try {
        console.log("Signing in anonymously...");
        await signInAnonymously(auth);

        // 1. Add/Check Category "Home Decor"
        const catRef = collection(db, "categories");
        const qCat = query(catRef, where("name", "==", "Home Decor"));
        const catSnap = await getDocs(qCat);

        if (catSnap.empty) {
            console.log("Adding 'Home Decor' category...");
            await addDoc(catRef, {
                name: "Home Decor",
                img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618359/7151kORL1DL._AC_UF894_1000_QL80__o3exih.jpg",
                status: "active",
                createdAt: serverTimestamp()
            });
        } else {
            console.log("'Home Decor' category already exists.");
        }

        // 2. Add Acrylic Frame Product
        const prodRef = collection(db, "products");
        const qProd = query(prodRef, where("name", "==", "Premium Acrylic Photo Frame"));
        const prodSnap = await getDocs(qProd);

        if (prodSnap.empty) {
            console.log("Adding Acrylic Frame product...");
            await addDoc(prodRef, {
                name: "Premium Acrylic Photo Frame",
                desc: "Elevate your space with our Premium Acrylic Photo Frame. Featuring a crystal-clear, frameless design that makes your photos appear like they are floating. Durable, UV-resistant, and perfect for high-end home or office decor.",
                price: 1299,
                category: "Home Decor",
                img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772618359/7151kORL1DL._AC_UF894_1000_QL80__o3exih.jpg",
                isFeatured: true,
                status: "active",
                colors: ["#ffffff"],
                createdAt: serverTimestamp()
            });
            console.log("Acrylic Frame product added successfully!");
        } else {
            console.log("Acrylic Frame product already exists.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
