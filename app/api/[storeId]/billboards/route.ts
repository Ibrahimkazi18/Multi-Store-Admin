import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
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

        const {label, imageUrl} = body;

        if(!label){
            return new NextResponse("Billboard Label is missing", {status: 400})  
        }
        
        if(!imageUrl){
            return new NextResponse("Billboard Image is missing", {status: 400})  
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

        const billboardData = {
            label,
            imageUrl,
            createdAt: serverTimestamp(),
        }

        const billboardRef = await addDoc(
            collection(db, "stores", params.storeId, "billboards"), 
            billboardData
        )

        const id = billboardRef.id;

        await updateDoc(doc(db, "stores", params.storeId, "billboards", id), {
            ...billboardData,
            id,
            updatedAt: serverTimestamp()
        })

        return NextResponse.json({id, ...billboardData})

    } catch (error) {
        console.log('STORE_POST', error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}   


export const GET = async (req : Request, {params} : {params : {storeId : string}}) => {
    try {
        
        if(!params.storeId){
            return new NextResponse("Store Id is missing", {status: 400})  
        }

        const billboardData = (await getDocs(
                collection(doc(db, "stores", params.storeId), "billboards")
            )).docs.map(doc => doc.data()) as Billboards[]
        
        return NextResponse.json(billboardData)
    } catch (error) {
        console.log('STORE_GET', error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
} 