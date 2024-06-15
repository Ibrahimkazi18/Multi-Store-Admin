import { db } from "@/lib/firebase";
import { Category, Order } from "@/types-db";
import { collection, doc, getDocs } from "firebase/firestore";

interface GraphData {
  name: string;
  total: number;
}

export const getOrderTotalRevenueByCategory = async (storeId: string) => {
  const ordersData = (
    await getDocs(collection(doc(db, "stores", storeId), "orders"))
  ).docs.map((doc) => doc.data()) as Order[];

  const categories = (
    await getDocs(collection(doc(db, "stores", storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const categoryRevenue: { [key: string]: number } = {};

  for (const order of ordersData) {
    for (const item of order.orderItems) {
      const category = item.category;

      if (category) {
        let revenueForItem = 0;

        if (item.qty !== undefined) {
          revenueForItem = item.price * item.qty;
        } else {
          revenueForItem = item.price;
        }

        categoryRevenue[category] =
          (categoryRevenue[category] || 0) + revenueForItem;
      }
    }
  }

  for (const category of categories) {
    categoryRevenue[category.name] = categoryRevenue[category.name] || 0; // Set the initial value to 0 for each category
  }

  // Update graphData using the categories array
  const graphData: GraphData[] = categories.map((category) => ({
    name: category.name,
    total: categoryRevenue[category.name] || 0,
  }));

  return graphData;
};