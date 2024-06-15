"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Store } from "@/types-db"
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

interface SettingsFormProps {
  initialData : Store
}

const formSchema = z.object({
  name: z.string().min(3, {message: "Store name should be minimum 3 characters"}),
})

const SettingsForm = ({ initialData } : SettingsFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const origin = UseOrigin()

  const onSubmit = async (data : z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const response = await axios.patch(`/api/stores/${params.storeId}`, data);
      toast.success("Store Updated")
      router.refresh()
    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        setIsLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)

      const response = await axios.delete(`/api/stores/${params.storeId}`);
      toast.success("Store Removed")
      router.refresh()
      router.push("/")
    } catch (error) {
        toast.error("Something went wrong")
    } finally {
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
        <Heading title="Settings" description="Manage Store Preferences" />
        <Button variant={"destructive"} size={"icon"} onClick={() => setOpen(true)}>
          <Trash className="w-4 h-4"/>
        </Button>
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                          <Input disabled={isLoading} placeholder="Your store name..." {...field} />
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

      <Separator />

      <ApiAlert 
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}

export default SettingsForm