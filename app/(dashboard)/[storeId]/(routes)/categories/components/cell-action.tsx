"use client"

import { useParams, useRouter } from "next/navigation"
import { CategoryColumn } from "./columns"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreVertical, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { deleteObject, ref } from "firebase/storage"
import { storage } from "@/lib/firebase"
import axios from "axios"
import { AlertModal } from "@/components/modal/alert-modal"

interface CellActionProps {
    data : CategoryColumn
}

const CellAction = ({ data } : CellActionProps) => {

  const router = useRouter()
  const params = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onCopy = (id : string) => {
    navigator.clipboard.writeText(id)
    toast.success("Category Id Copied to Clipboard")
  }
 
  const onDelete = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
      

      toast.success("Category Removed")
      router.refresh()
      router.push(`/${params.storeId}/categories`)

    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        router.refresh()
        setIsLoading(false)
        setOpen(false)
    }
  }


  return (
    <>
        <AlertModal
            isOpen={open}
            onClose={() => {setOpen(false)}}
            onConfirm={onDelete}
            loading={isLoading}
        />

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <span className="sr-only">Open</span>
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onCopy(data.id)}>
                    <Copy className="h-4 w-4 mr-2"/>
                    Copy Id
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
                    <Edit className="h-4 w-4 mr-2"/>
                    Update
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}

export default CellAction