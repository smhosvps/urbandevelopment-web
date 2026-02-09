import MonthlySalesChart from "@/components/salesChart/MonthlySalesChart";
import {
  useOderCountQuery
} from "@/redux/features/storeOrder/storeOrderApi";
import { Link } from "react-router-dom";

type Props = {};


export default function DashboardStore({}: Props) {
  const { data: income } = useOderCountQuery({});
  return <div>
    <div>
      <div className="flex flex-row item-center justify-between">
      <div>
        <div className="text-lg font-bold mb-2">Total Purchased: {income?.ordersCount}</div>
      </div>
      <Link to="/store-dashboard/yearly-sales">
      <button className="bg-gray-800 p-1.5 rounded-md text-white text-sm mb-2">Yearly Sales</button>
      </Link>
      </div>
    
     
    </div>
    <MonthlySalesChart/>
  </div>;
}
