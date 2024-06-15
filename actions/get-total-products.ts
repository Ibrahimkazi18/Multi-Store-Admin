import { db } from "@/lib/firebase"
import { collection, doc, getDocs } from "firebase/firestore"

export const getTotalProducts = async (storeId : string) => {
    const productsData = (
        await getDocs(collection(doc(db, "stores", storeId), "products"))
    )

    const count = productsData.size

    return count
}