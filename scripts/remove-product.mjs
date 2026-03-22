import { db, auth } from "./firebase-init.mjs";
import { doc, deleteDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const productId = "bwS3QNCMGa8oL7yifqqz"; // Premium Ceramic Mug in Drinkware

async function removeProduct() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously.");

        const docRef = doc(db, "products", productId);
        await deleteDoc(docRef);
        console.log(`✅ Deleted product with ID: ${productId}`);

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to remove product:", err);
        process.exit(1);
    }
}

removeProduct();
