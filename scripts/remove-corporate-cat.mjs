import { db, auth } from "./firebase-init.mjs";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

async function run() {
    try {
        console.log("Signing in anonymously...");
        await signInAnonymously(auth);

        // 1. Update Trophy Category
        console.log("Re-categorizing Trophy...");
        const trophyRef = doc(db, 'products', '6yjpHQwvhULtGCyiGpWK');
        await updateDoc(trophyRef, {
            category: "Personalized Gifts",
            secondaryCategories: []
        });

        // 2. Remove secondary categories from others
        const multiIds = ['4iesYym7AEyzMxIuP57y', 'iswpSh8TDXqB2loqKMJf', 'yKXj2FWmmEIDCLXx4E0a'];
        for (const id of multiIds) {
            console.log(`Cleaning up secondary categories for ${id}...`);
            const ref = doc(db, 'products', id);
            await updateDoc(ref, {
                secondaryCategories: []
            });
        }

        // 3. Delete Corporate Gifts Category
        console.log("Deleting 'Corporate Gifts' category...");
        const catRef = doc(db, 'categories', 'IHuZflsSJw9Ludx6dzrf');
        await deleteDoc(catRef);

        console.log("Corporate category removal complete! 🚀");
        process.exit(0);
    } catch (err) {
        console.error("Removal failed:", err);
        process.exit(1);
    }
}

run();
