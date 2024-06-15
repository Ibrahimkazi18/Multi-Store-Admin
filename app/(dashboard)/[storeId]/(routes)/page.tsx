import { getGraphTotalRevenue } from "@/actions/get-grapgh-total-revenue"
import { getTotalProducts } from "@/actions/get-total-products"
import { getTotalRevenue } from "@/actions/get-total-revenue"
import { getOrderTotalRevenueByCategory } from "@/actions/get-total-revenue-by-category"
import { getOrderTotalRevenueByStatus } from "@/actions/get-total-revenue-by-order_status"
import { getOrderStatusTotalRevenue } from "@/actions/get-total-revenue-by-status"
import { getTotalSales } from "@/actions/get-total-sale"
import BarGraph from "@/components/bar-graph"
import Heading from "@/components/heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import { formatter } from "@/lib/utils"
import { Store } from "@/types-db"
import { doc, getDoc } from "firebase/firestore"
import { IndianRupee } from "lucide-react"

interface DashboardOverviewProps {
  params : { storeId : string}
}

const DashboardOverview = async ({ params } : DashboardOverviewProps) => {

  const totalRevenue = await getTotalRevenue(params.storeId)
  const totalSales = await getTotalSales(params.storeId)
  const totalProducts = await getTotalProducts(params.storeId)

  const monthlyGraphRevenue = await getGraphTotalRevenue(params.storeId)
  const statusGraphRevenue = await getOrderTotalRevenueByStatus(params.storeId)
  const categoryGraphRevenue = await getOrderTotalRevenueByCategory(params.storeId)
  const orderStatusGraphRevenue = await getOrderStatusTotalRevenue(params.storeId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store"/>

        <Separator />

        <div className="grid grid-cols-4 gap-4">
          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <IndianRupee className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <IndianRupee className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Revenue By Month</CardTitle>
            </CardHeader>
            <CardContent>
              <BarGraph data={monthlyGraphRevenue}/>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Revenue By Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <BarGraph data={statusGraphRevenue}/>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Revenue By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <BarGraph data={categoryGraphRevenue}/>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">Revenue By Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <BarGraph data={orderStatusGraphRevenue}/>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default DashboardOverview