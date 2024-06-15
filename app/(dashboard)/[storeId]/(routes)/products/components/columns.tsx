"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import CellAction from "./cell-action"
import { cn } from "@/lib/utils"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id : string,
  name : string,
  price : string,
  isFeatured : boolean,
  isArchived : boolean,
  category : string,
  size : string,
  kitchen : string,
  cuisine : string,
  images : {url : string}[]
  createdAt?: string,
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "price",
    header : "Price"
  },
  {
    accessorKey: "isFeatured",
    header : "Featured",
    cell : ({row}) => {
      const { isFeatured } = row.original

      return (
        <p className={cn(isFeatured ? "text-emerald-500" : "text-red-500")}>{isFeatured ? "Yes" : "No"}</p>
      )
    }
  },
  {
    accessorKey: "isArchived",
    header : "Archived",
    cell : ({row}) => {
      const { isArchived } = row.original

      return (
        <p className={cn(isArchived ? "text-emerald-500" : "text-red-500")}>{isArchived ? "Yes" : "No"}</p>
      )
    }
  },
  {
    accessorKey: "category",
    header : "Category"
  },
  {
    accessorKey: "size",
    header : "Size"
  },
  {
    accessorKey: "kitchen",
    header : "Kitchen",
    cell : ({row}) => {
      const { kitchen } = row.original

      return (
        <p>{kitchen === "Vegetarian" ? "Veg" : "Non-veg"}</p>
      )
    }
  },
  {
    accessorKey: "cuisine",
    header : "Cuisines"
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id : "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
