import { db, auth } from "./firebase-init.mjs";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

const categories = [
    {
        name: "Apparel",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772578674/standard-plain-round-neck-shirt-white_258aab92-9088-42a0-9dbf-c9867a82ebeb_large_xujfjs.png"
    },
    {
        name: "Drinkware",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1772613392/scoria-GREEN-3-WATER-BOTTLE-stainless-steel-water-bottle-best-cold-hot-bottle-sustainable_649d66b8-4da5-457d-99a3-e32853526087_zbs1va.jpg"
    },
    {
        name: "Combo",
        img: "https://res.cloudinary.com/df9pom0nq/image/upload/v1773397448/unnamed_1_dwllpp.jpg"
    }
];

async function seed() {
    console.log("Signing in anonymously...");
    const auth = getAuth(app);
    await signInAnonymously(auth);
    console.log("Seeding categories...");
    const colRef = collection(db, "categories");

    // Clear existing (if any)
    const snap = await getDocs(colRef);
    for (const d of snap.docs) {
        await deleteDoc(doc(db, "categories", d.id));
    }

    for (const cat of categories) {
        await addDoc(colRef, {
            ...cat,
            createdAt: new Date(),
            status: 'active'
        });
        console.log(`Added category: ${cat.name}`);
    }
    console.log("Seeding complete!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
