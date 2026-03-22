import { db, auth } from "./firebase-init.mjs";
import { doc, updateDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const combo3Id = "K4jUqqMPDSSn5DfdIvIl";
const combo9Id = "BehXjAG5D7yXdtJ3bwHr";

async function link() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously.");

        // Add link from #3 to #9
        const ref3 = doc(db, "products", combo3Id);
        await updateDoc(ref3, {
            relatedVariants: [
                { id: combo9Id, name: "Premium Gift Combo #9", img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773397448/unnamed_1_dwllpp.jpg" }
            ]
        });
        console.log("✅ Linked #3 to #9");

        // Add link from #9 to #3
        const ref9 = doc(db, "products", combo9Id);
        await updateDoc(ref9, {
            relatedVariants: [
                { id: combo3Id, name: "Premium Gift Combo #3", img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773398349/WhatsApp_Image_2026-02-18_at_10.45.18_AM_jzfelz.jpg" }
            ]
        });
        console.log("✅ Linked #9 to #3");

        process.exit(0);
    } catch (err) {
        console.error("Linking failed:", err);
        process.exit(1);
    }
}

link();
