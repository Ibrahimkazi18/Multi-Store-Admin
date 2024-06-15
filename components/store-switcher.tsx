"use client"

import { Check, ChevronsUpDown, StoreIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Store } from "@/types-db"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { CommandList, CommandSeparator } from "cmdk"
import StoreListItem from "./store-list-item"
import { useStoreModal } from "@/hooks/use-store-modal"
import CreateNewStoreItem from "@/components/create-new-store-item"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items : Store[]
}

const StoreSwitcher = ({ items } : StoreSwitcherProps) => {

    const params = useParams()
    const router = useRouter()
    const storeModal = useStoreModal()

    const formattedStores = items?.map(item => ({
        label : item.name,
        value : item.id
    }))

    const currentStores = formattedStores?.find(item => item.value === params.storeId)

    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filtered, setFiltered] = useState<{label : string, value : string}[]>([])

    const onStoreSelect = (store : {value: string, label: string}) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }


    const handleSearchTerm = (e : any) => {
      setSearchTerm(e.target.value)
      setFiltered(
        formattedStores.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    } 

    return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              <StoreIcon className="mr-2 h-4 w-4"/>
              {currentStores?.value
                ? formattedStores?.find((store) => store.value === currentStores?.value)?.label
                : "Select Store..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
                <StoreIcon className="mr-2 h-4 w-4 min-w-4"/>
                <input type="text" placeholder="Search Store..." onChange={handleSearchTerm} className="flex-1 w-full outline-none"/>
              </div>
              <CommandList>
                <CommandGroup heading="Stores">
                  {
                    searchTerm === "" ? (
                      formattedStores.map((item, i) => (
                        <StoreListItem store={item} key={i} onSelect={onStoreSelect} isChecked={currentStores?.value == item.value}/>
                      ))
                    ) : filtered.length > 0 ? (
                        filtered.map((item, i) => (
                          <StoreListItem store={item} key={i} onSelect={onStoreSelect} isChecked={currentStores?.value == item.value}/>
                        ))
                    ) : <CommandEmpty>No Store Found</CommandEmpty>
                  }
                </CommandGroup>
              </CommandList>
              <CommandSeparator />

              <CommandList>
                <CommandGroup>
                  <CreateNewStoreItem 
                      onClick={() => {
                        setOpen(false)
                        storeModal.onOpen()
                      }}
                  />
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>

        </Popover>
    )
}

export default StoreSwitcher