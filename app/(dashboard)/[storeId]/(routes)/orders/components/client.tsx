"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import ApiList from "@/components/api-list"

interface OrdersClientProps  {
  data : OrderColumn[]
}

const OrdersClient = ({ data } : OrdersClientProps ) => {

  const params = useParams()
  const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Orders (${data.length})`} description="Manage orders for your store"/>
        </div>

        <Separator />

        <DataTable columns={columns} data={data} searchKey="name" />
    </>
  )
}

export default OrdersClient