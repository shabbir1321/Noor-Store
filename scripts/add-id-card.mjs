import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

async function migrate() {
    try {
        console.log("Signing in anonymously...");
        await signInAnonymously(auth);

        // 1. Add/Check Category "Stationery"
        const catRef = collection(db, "categories");
        const qCat = query(catRef, where("name", "==", "Stationery"));
        const catSnap = await getDocs(qCat);

        if (catSnap.empty) {
            console.log("Adding 'Stationery' category...");
            await addDoc(catRef, {
                name: "Stationery",
                img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772617780/photo_id_refresh_5_mpi7ey.png",
                status: "active",
                createdAt: serverTimestamp()
            });
        } else {
            console.log("'Stationery' category already exists.");
        }

        // 2. Add ID Card Product
        const prodRef = collection(db, "products");
        const qProd = query(prodRef, where("name", "==", "Premium Photo ID Card"));
        const prodSnap = await getDocs(qProd);

        if (prodSnap.empty) {
            console.log("Adding ID Card product...");
            await addDoc(prodRef, {
                name: "Premium Photo ID Card",
                desc: "Durable, high-quality PVC photo ID cards. Perfect for corporate offices, events, and schools. Features crisp printing and a professional finish.",
                price: 199,
                category: "Stationery",
                img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772617780/photo_id_refresh_5_mpi7ey.png",
                isFeatured: true,
                status: "active",
                colors: ["#ffffff"],
                createdAt: serverTimestamp()
            });
            console.log("ID Card product added successfully!");
        } else {
            console.log("ID Card product already exists.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
