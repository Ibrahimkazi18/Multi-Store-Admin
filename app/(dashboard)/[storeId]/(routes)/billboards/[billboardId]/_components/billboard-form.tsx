"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Billboards, Store } from "@/types-db"
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

interface BillboardFormProps {
  initialData : Billboards  
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

const BillboardForm = ({ initialData } : BillboardFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  const title = initialData ? "Edit Billboard" : "Create Billboard"
  const description = initialData ? "Edit a Billboard" : "Add a new Billboard"
  const toastMessage = initialData ? "Billboard Updated" : "Billboard Created"
  const action = initialData ? "Save Changes" : "Create Billboard"

  const onSubmit = async (data : z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if(initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);

      } else {
          await axios.post(`/api/${params.storeId}/billboards`, data);
      }

      toast.success(toastMessage)
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      
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

      const { imageUrl } = form.getValues()
      await deleteObject(ref(storage, imageUrl)).then(async () => {
        await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      })

      toast.success("Billboard Removed")
      router.refresh()
      router.push(`/${params.storeId}/billboards`)

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

            <FormField 
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Billboard Image</FormLabel>
                        <FormControl>
                            <ImageUpload 
                                disabled={isLoading}
                                value={field.value ? [field.value] : []}
                                onChange={(url) => field.onChange(url)}
                                onRemove={() => field.onChange("")}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-3 gap-8">
              <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input disabled={isLoading} placeholder="Your billboard label..." {...field} />
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

export default BillboardForm