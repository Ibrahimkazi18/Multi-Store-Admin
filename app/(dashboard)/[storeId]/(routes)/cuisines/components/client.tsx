"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CuisineColumn, columns } from "./columns"
import ApiList from "@/components/api-list"

interface CuisineClientProps  {
  data : CuisineColumn[]
}

const CuisineClient = ({ data } : CuisineClientProps ) => {

  const params = useParams()
  const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Cuisines (${data.length})`} description="Manage cuisines for your store"/>
            <Button onClick={() => router.push(`/${params.storeId}/cuisines/create`)}>
                <Plus className="h-4 w-4 mr-2"/>
                Add New
            </Button>
        </div>

        <Separator />

        <DataTable columns={columns} data={data} searchKey="name" />

        <Heading title="API" description="API calls for cuisines"/>
        <Separator />
        <ApiList entityName="cuisines" entityNameId="cuisineId"/>
    </>
  )
}

export default CuisineClient