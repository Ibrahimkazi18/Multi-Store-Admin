import { db } from "@/lib/firebase";
import { Kitchen } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";


export const POST = async (req : Request, {params} : {params : {storeId : string}}) => {
    try {
        const {userId} = auth() 
        const body = await req.json()

        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }

        const {name, value} = body;

        if(!name){
            return new NextResponse("Kitchen Name is missing", {status: 400})  
        }
        
        if(!value){
            return new NextResponse("Kitchen Value is missing", {status: 400})  
        }
        
        if(!params.storeId){
            return new NextResponse("Store Id is missing", {status: 400})  
        }

        const store = await getDoc(doc(db, "stores", params.storeId));

        if(store.exists()){
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access", {status : 500}) 
            }
        }

        const kitchenData = {
            name,
            value,
            createdAt: serverTimestamp(),
        }

        const kitchenRef = await addDoc(
            collection(db, "stores", params.storeId, "kitchens"), 
            kitchenData
        )

        const id = kitchenRef.id;

        await updateDoc(doc(db, "stores", params.storeId, "kitchens", id), {
            ...kitchenData,
            id,
            updatedAt: serverTimestamp()
        })

        return NextResponse.json({id, ...kitchenData})

    } catch (error) {
        console.log('KITCHENS_POST', error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}   


export const GET = async (req : Request, {params} : {params : {storeId : string}}) => {
    try {
        
        if(!params.storeId){
            return new NextResponse("Store Id is missing", {status: 400})  
        }

        const kitchenData = (await getDocs(
                collection(doc(db, "stores", params.storeId), "kitchens")
            )).docs.map(doc => doc.data()) as Kitchen[]
        
        return NextResponse.json(kitchenData)
    } catch (error) {
        console.log('KITCHENS_GET', error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
} 