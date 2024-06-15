import { db } from "@/lib/firebase";
import { Category, Order } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getOrderTotalRevenueByStatus = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const statusRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    const status = order.isPaid ? "Paid" : "Not Paid"

      if (status) {
        let revnueForOrder = 0;

        for(const item of order.orderItems) { 
            if(item.qty !== undefined) {
                revnueForOrder += item.price * item.qty
            } else {
                revnueForOrder += item.price
            }
        }

        statusRevenue[status] = (statusRevenue[status] || 0) + revnueForOrder
    }
  }

  // Create a map to convert month names to numeric representation
  const statusMap: { [key: string]: number } = {
        Paid : 0,
        "Not Paid" : 1,
    };

    //update the grapghData

    const graphData: GraphData[] = Object.keys(statusMap).map((statusName) => ({
        name: statusName,
        total: statusRevenue[statusName] || 0,
    }));


  return graphData;
};