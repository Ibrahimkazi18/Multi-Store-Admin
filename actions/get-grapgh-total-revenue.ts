import { db } from "@/lib/firebase"
import { Order } from "@/types-db"
import { collection, doc, getDocs } from "firebase/firestore"

interface GraphData {
    name : string,
    total : number,
}

export const getGraphTotalRevenue = async (storeId : string) => {

    const ordersData = (
        await getDocs(collection(doc(db, "stores", storeId), "orders"))
    ).docs.map((doc) => doc.data()) as Order[]

    const paidOrders = ordersData.filter((order) => order.isPaid)   

    const monthlyRevenue : { [key : string] : number } = {}

    for(const order of paidOrders) {
        const month = order.createdAt?.toDate().toLocaleDateString("en-IN", { month : "short"})

        if(month) {
            let revnueForOrder = 0;

            for(const item of order.orderItems){
                if(item.qty !== undefined) {
                    revnueForOrder += item.price * item.qty
                } else {
                    revnueForOrder += item.price
                }
            }

            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revnueForOrder
        }
    }

    // Create a map to convert month names to numeric representation
    const monthMap: { [key: string]: number } = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
    };

    //update the grapghData

    const graphData: GraphData[] = Object.keys(monthMap).map((monthName) => ({
        name: monthName,
        total: monthlyRevenue[monthName] || 0,
      }));
    
    return graphData;
}