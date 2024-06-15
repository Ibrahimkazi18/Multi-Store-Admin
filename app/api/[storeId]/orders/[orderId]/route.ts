import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";


export const PATCH = async (req : Request, {params} : {params : {storeId : string, orderId : string}}) => {
    try {
        const {userId} = auth() 
        const body = await req.json()

        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }

        const {order_status} = body;

        if(!order_status){
            return new NextResponse("order Value is missing", {status: 400})  
        }
        
        if(!params.storeId){
            return new NextResponse("Store Id is missing", {status: 400})  
        }

        if(!params.orderId){
            return new NextResponse("Billboard Id is missing", {status: 400})  
        }

        const store = await getDoc(doc(db, "stores", params.storeId));

        if(store.exists()){
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access", {status : 500}) 
            }
        }

        const orderRef = await getDoc(
            doc(db, "stores", params.storeId, "orders", params.orderId)
        )

        if(orderRef.exists()){
            await updateDoc(
                doc(db, "stores", params.storeId, "orders", params.orderId), {
                    ...orderRef.data(),
                    order_status,
                    updatedAt : serverTimestamp(),
                }
            )
        } else {
            return new NextResponse("order Not Found", {status: 404})
        }

        const order = (
            await getDoc(
                doc(db, "stores", params.storeId, "orders", params.orderId)
            )
        ).data() as Order

        return NextResponse.json(order)

    } catch (error) {
        console.log('ORDERS_POST', error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}   


export const DELETE = async (req : Request, {params} : {params : {storeId : string, orderId : string}}) => {
    try {
        const {userId} = auth() 

        if(!userId){
            return new NextResponse("Unauthorized", {status: 400})
        }
          
        if(!params.storeId){
            return new NextResponse("Store Id is missing", {status: 400})  
        }

        if(!params.orderId){
            return new NextResponse("Order Id is missing", {status: 400})  
        }

        const store = await getDoc(doc(db, "stores", params.storeId));

        if(store.exists()){
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authorized Access", {status : 500}) 
            }
        }

        const orderRef = doc(db, "stores", params.storeId, "orders", params.orderId)
        
        await deleteDoc(orderRef)

        return NextResponse.json({msg : "Order Deleted"})

    } catch (error) {
        
        console.log('ORDER_DELETE', error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}   
 