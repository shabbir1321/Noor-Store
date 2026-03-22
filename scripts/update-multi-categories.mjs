import { db, auth } from "./firebase-init.mjs";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const idsToUpdate = [
    '4iesYym7AEyzMxIuP57y', // Premium Insulated Water Bottle
    'iswpSh8TDXqB2loqKMJf', // Customized Wooden Name Pen
    'yKXj2FWmmEIDCLXx4E0a'  // Handcrafted Wooden Pen Stand
];

async function update() {
    try {
        console.log("Signing in anonymously...");
        await signInAnonymously(auth);

        for (const id of idsToUpdate) {
            const ref = doc(db, 'products', id);
            await updateDoc(ref, {
                secondaryCategories: ["Corporate Gifts"]
            });
            console.log(`✅ Updated product ${id} with Corporate Gifts category`);
        }

        console.log("Multi-category update complete! 🚀");
        process.exit(0);
    } catch (err) {
        console.error("Update failed:", err);
        process.exit(1);
    }
}

update();
