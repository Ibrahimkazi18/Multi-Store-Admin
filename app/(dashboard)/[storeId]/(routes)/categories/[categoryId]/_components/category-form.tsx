"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Billboards, Category, Store } from "@/types-db"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import axios from "axios"
import toast from "react-hot-toast"
import { AlertModal } from "@/components/modal/alert-modal"
import { ApiAlert } from "@/components/api-alert"
import { UseOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/image-upload"
import { deleteObject, ref } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryFormProps {
  initialData : Category  
  billboards : Billboards[]
}

const formSchema = z.object({
  name : z.string().min(1),
  billboardId: z.string().min(1),
})

const CategoryForm = ({ initialData, billboards } : CategoryFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  const title = initialData ? "Edit Category" : "Create Category"
  const description = initialData ? "Edit a Category" : "Add a new Category"
  const toastMessage = initialData ? "Category Updated" : "Category Created"
  const action = initialData ? "Save Changes" : "Create Category"

  const onSubmit = async (data : z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const {billboardId : formBillId} = form.getValues()
      const matchingBillboard = billboards.find((item) => item.id === formBillId)

      if(initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, {
          ...data,
          billboardLabel : matchingBillboard?.label,
        });

      } else {
          await axios.post(`/api/${params.storeId}/categories`, {
            ...data,
            billboardLabel : matchingBillboard?.label,
          });
      }

      toast.success(toastMessage)
      router.refresh()
      router.push(`/${params.storeId}/categories`)

    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        router.refresh()
        setIsLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      

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

      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
            <Button disabled={isLoading} variant={"destructive"} size={"icon"} onClick={() => setOpen(true)}>
                <Trash className="w-4 h-4"/>
            </Button>
        )}
      </div>
      
      <Separator />

      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">

            <div className="grid grid-cols-3 gap-8">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input disabled={isLoading} placeholder="Your category name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
              )}
              />

              <FormField
                  control={form.control}
                  name="billboardId"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billboard</FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a billboard"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {billboards.map(billboard => (
                                <SelectItem key={billboard.id} value={billboard.id}>
                                  {billboard.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
              )}
              />
            </div>

            <Button disabled={isLoading} type="submit" size={"sm"}>
              {action}
            </Button>
          </form>
      </Form>

    </>
  )
}

export default CategoryForm