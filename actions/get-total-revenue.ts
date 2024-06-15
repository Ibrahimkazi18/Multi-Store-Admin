import { db } from "@/lib/firebase"
import { Order } from "@/types-db"
import { collection, doc, getDocs } from "firebase/firestore"

export const getTotalRevenue = async (storeId : string) => {
    const ordersData = (
        await getDocs(collection(doc(db, "stores", storeId), "orders"))
    ).docs.map((doc) => doc.data()) as Order[]
    
    const paidOrders = ordersData.filter((order) => order.isPaid)   
    
    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            if(item.qty !== undefined){
                return orderSum + item.price * item.qty
            } else {
                return orderSum + item.price
            }
        }, 0)

        return total + orderTotal
    }, 0)

    return totalRevenue
}