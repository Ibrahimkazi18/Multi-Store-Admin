"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Category, Cuisine, Kitchen, Product, Size } from "@/types-db"
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
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ImageUpload from "@/components/image-upload"
import ImagesUpload from "@/components/images-upload"

interface ProductFormProps {
  initialData : Product;
  categories : Category[];
  sizes : Size[];
  kitchens : Kitchen[];
  cuisines : Cuisine[];
}

const formSchema = z.object({
  name : z.string().min(1),
  price : z.coerce.number().min(1),
  images : z.object({url : z.string()}).array(),
  isFeatured : z.boolean().default(false).optional(),
  isArchived : z.boolean().default(false).optional(),
  category : z.string().min(1),
  size : z.string().optional(),
  kitchen : z.string().optional(),
  cuisine : z.string().optional(),
})

const ProductForm = ({ initialData, categories, sizes, kitchens, cuisines } : ProductFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      images: [],
      isFeatured: false,
      isArchived: false,
      category: "",
      size: "",
      kitchen: "",
      cuisine: "",
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  const title = initialData ? "Edit Product" : "Create Product"
  const description = initialData ? "Edit a Product" : "Add a new Product"
  const toastMessage = initialData ? "Product Updated" : "Product Created"
  const action = initialData ? "Save Changes" : "Create Product"

  const onSubmit = async (data : z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if(initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);

      } else {
          await axios.post(`/api/${params.storeId}/products`, data);
      }

      toast.success(toastMessage)
      router.refresh()
      router.push(`/${params.storeId}/products`)

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

      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      

      toast.success("Product Removed")
      router.refresh()
      router.push(`/${params.storeId}/products`)

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

            {/* images */}
            <FormField 
                control={form.control}
                name="images"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                            <ImagesUpload 
                              value={field.value.map(image => image.url)}
                              onChange={(urls) => {
                                field.onChange(urls.map((url) => ({url})))
                              }}
                              onRemove={(url) => {
                                field.onChange(
                                  field.value.filter(current => current.url !== url)
                                )
                              }}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-3 gap-8">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input disabled={isLoading} placeholder="Product name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
              )}
              />
              <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input type="number" disabled={isLoading} placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
              )}
              />
              <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
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
                                    placeholder="Select a category"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                )}
                />
                <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size</FormLabel>
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
                                      placeholder="Select a size"
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sizes.map(size => (
                                    <SelectItem key={size.id} value={size.name}>
                                      {size.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                  )}
                  />
                  <FormField
                        control={form.control}
                        name="kitchen"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kitchen</FormLabel>
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
                                        placeholder="Select a kitchen"
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {kitchens.map(kitchen => (
                                      <SelectItem key={kitchen.id} value={kitchen.name}>
                                        {kitchen.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                    )}
                    />
                    <FormField
                          control={form.control}
                          name="cuisine"
                          render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cuisine</FormLabel>
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
                                          placeholder="Select a cuisine"
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {cuisines.map(cuisine => (
                                        <SelectItem key={cuisine.id} value={cuisine.name}>
                                          {cuisine.value}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                      )}
                      />
                      <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                  <FormControl>
                                    <Checkbox 
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>
                                      This product will be on home screen under feautured products
                                    </FormDescription>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                        )}
                        />
                        <FormField
                              control={form.control}
                              name="isArchived"
                              render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                    <FormControl>
                                      <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Archived</FormLabel>
                                      <FormDescription>
                                        This product will not be on displayed anywhere inside the store
                                      </FormDescription>
                                    </div>
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

export default ProductForm