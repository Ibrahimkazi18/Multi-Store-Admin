"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Size } from "@/types-db"
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

interface SizeFormProps {
  initialData : Size  
}

const formSchema = z.object({
  name : z.string().min(1),
  value : z.string().min(1),
})

const SizeForm = ({ initialData } : SizeFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  const title = initialData ? "Edit Size" : "Create Size"
  const description = initialData ? "Edit a Size" : "Add a new Size"
  const toastMessage = initialData ? "Size Updated" : "Size Created"
  const action = initialData ? "Save Changes" : "Create Size"

  const onSubmit = async (data : z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if(initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);

      } else {
          await axios.post(`/api/${params.storeId}/sizes`, data);
      }

      toast.success(toastMessage)
      router.refresh()
      router.push(`/${params.storeId}/sizes`)

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

      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      

      toast.success("Size Removed")
      router.refresh()
      router.push(`/${params.storeId}/sizes`)

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
                            <Input disabled={isLoading} placeholder="Your size name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
              )}
              />
              <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                            <Input disabled={isLoading} placeholder="Your size value..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
              )}
              />


            </div>

            <Button disabled={isLoading} type="submit" size={"sm"}>
              Save Changes
            </Button>
          </form>
      </Form>

    </>
  )
}

export default SizeForm