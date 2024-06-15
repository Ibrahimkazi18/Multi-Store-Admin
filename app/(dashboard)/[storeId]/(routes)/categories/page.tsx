import { collection, doc, getDocs } from "firebase/firestore"
import { format } from "date-fns"

import { db } from "@/lib/firebase"
import { Category } from "@/types-db"
import { CategoryColumn } from "./components/columns"
import CategoriesClient from "./components/client"

const CategoriesPage = async ({params} : {params : { storeId : string}}) => {

  const categoriesDtata = (
    await getDocs(
      collection(doc(db, "stores", params.storeId), "categories")
    )
  ).docs.map(doc => doc.data()) as Category[]

  const formattedCategories : CategoryColumn[] = categoriesDtata.map(
    (item) => ({
      id : item.id,
      billboardLabel : item.billboardLabel,
      name : item.name,
      createdAt : item.createdAt ? format(item.createdAt.toDate(), "MMMM do, yyyy") : ""
    })
  );

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoriesClient data={formattedCategories} />
        </div>
    </div>
  )
}

export default CategoriesPage