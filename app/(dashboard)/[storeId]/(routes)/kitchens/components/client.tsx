"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { KitchenColumn, columns } from "./columns"
import ApiList from "@/components/api-list"

interface KitchenClientProps  {
  data : KitchenColumn[]
}

const KitchenClient = ({ data } : KitchenClientProps ) => {

  const params = useParams()
  const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Kitchens (${data.length})`} description="Manage kitchens for your store"/>
            <Button onClick={() => router.push(`/${params.storeId}/kitchens/new`)}>
                <Plus className="h-4 w-4 mr-2"/>
                Add New
            </Button>
        </div>

        <Separator />

        <DataTable columns={columns} data={data} searchKey="name" />

        <Heading title="API" description="API calls for kitchens"/>
        <Separator />
        <ApiList entityName="kitchens" entityNameId="kitchenId"/>
    </>
  )
}

export default KitchenClient