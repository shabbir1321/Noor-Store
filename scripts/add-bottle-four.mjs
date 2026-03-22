import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const imgBlack = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478962/WhatsApp_Image_2026-02-18_at_10.45.31_AM_1_tmtdjt.jpg";
const imgSteel = "https://res.cloudinary.com/df9pom0nq/image/upload/v1773478962/WhatsApp_Image_2026-02-18_at_10.45.31_AM_2_qbg0fi.jpg";

async function run() {
    await signInAnonymously(auth);
    console.log("Signed in anonymously.");

    const colRef = collection(db, "products");

    const newProduct = {
        name: "Temperature Control Smart Flask",
        category: "Drinkware",
        price: 999,
        img: imgBlack, // Default display image
        colorVariants: [
            { name: 'Matte Black', hex: '#111111', imgUrl: imgBlack },
            { name: 'Brushed Steel', hex: '#c0c0c0', imgUrl: imgSteel }
        ],
        desc: "A smart insulated flask available in two premium finishes. Perfect for keeping your drinks hot or cold for extended periods. Select your preferred color below.",
        status: "active",
        isFeatured: true,
        createdAt: new Date()
    };

    await addDoc(colRef, newProduct);
    console.log(`✅ Added ${newProduct.name}`);

    process.exit(0);
}

run().catch(console.error);
