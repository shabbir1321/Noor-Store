import { db, auth } from "./firebase-init.mjs";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const imgFront = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478999/WhatsApp_Image_2025-06-11_at_10.42.42_AM_qsowng.jpg";
const imgBack = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773479001/WhatsApp_Image_2025-06-11_at_10.59.16_AM_iixlm6.jpg";

async function run() {
    await signInAnonymously(auth);
    console.log("Signed in anonymously.");

    const colRef = collection(db, "products");
    const q = query(colRef, where("category", "==", "Drinkware"));
    const snap = await getDocs(q);

    let found = false;
    for (const d of snap.docs) {
        const data = d.data();
        if (data.name.includes("Bottle") || data.name.includes("bottle")) {
            console.log(`Found bottle product: ${data.name} (${d.id})`);
            await updateDoc(doc(db, "products", d.id), {
                img: imgFront,
                images: [imgFront, imgBack]
            });
            console.log(`✅ Updated ${data.name} with new images array.`);
            found = true;
        }
    }

    if (!found) {
        console.log("Could not find a bottle product to update.");
    }

    console.log("Done.");
    process.exit(0);
}

run().catch(console.error);
