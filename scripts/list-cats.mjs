import { db, auth } from "./firebase-init.mjs";
import { collection, getDocs } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

async function listCats() {
    await signInAnonymously(auth);
    const snap = await getDocs(collection(db, "categories"));
    snap.forEach(doc => {
        console.log(`CAT: ${doc.data().name}`);
    });
    process.exit(0);
}

listCats();
