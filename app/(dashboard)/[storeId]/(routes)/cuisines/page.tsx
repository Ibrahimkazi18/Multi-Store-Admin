import { collection, doc, getDocs } from "firebase/firestore"
import { format } from "date-fns"

import { db } from "@/lib/firebase"
import { Cuisine } from "@/types-db"
import { CuisineColumn } from "./components/columns"
import CuisineClient from "./components/client"

const CusinesPage = async ({params} : {params : { storeId : string}}) => {

  const cuisineData = (
    await getDocs(
      collection(doc(db, "stores", params.storeId), "cuisines")
    )
  ).docs.map(doc => doc.data()) as Cuisine[]

  const formattedCuisines : CuisineColumn[] = cuisineData.map(
    (item) => ({
      id : item.id,
      name : item.name,
      value : item.value,
      createdAt : item.createdAt ? format(item.createdAt.toDate(), "MMMM do, yyyy") : ""
    })
  );

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CuisineClient data={formattedCuisines} />
        </div>
    </div>
  )
}

export default CusinesPage