import { db } from "@/lib/firebase"
import { Billboards, Category } from "@/types-db"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import CategoryForm from "./_components/category-form"


const CategoryPage = async ({params} : {params : {storeId : string, categoryId : string}}) => {

  const category = (await getDoc(doc(db, "stores", params.storeId, "categories", params.categoryId))).data() as Category

  const billboardsData = (
    await getDocs(
      collection(doc(db, "stores", params.storeId), "billboards")
    )
  ).docs.map(doc => doc.data()) as Billboards[]

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm initialData={category} billboards={billboardsData}/>
        </div>
    </div>
  )
}

export default CategoryPage