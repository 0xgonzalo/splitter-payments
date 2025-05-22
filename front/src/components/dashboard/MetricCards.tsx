import { DollarSign, Users, BarChart2, ShoppingCart } from "lucide-react"

const metrics = [
  {
    title: "Today's Money",
    value: "$53",
    change: "+3%",
    icon: DollarSign,
    color: "bg-blue-500",
  },
  {
    title: "Today's Buyers",
    value: "23",
    change: "+5%",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "New Transactions",
    value: "30",
    change: "+4%",
    icon: BarChart2,
    color: "bg-blue-500",
  },
  {
    title: "Total Sales",
    value: "$13,000",
    change: "+6%",
    icon: ShoppingCart,
    color: "bg-blue-500",
  },
]

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-[#0c1e3d]/80 rounded-lg p-4 flex items-center justify-between backdrop-blur-sm">
          <div>
            <p className="text-gray-400 text-sm">{metric.title}</p>
            <div className="flex items-center mt-1">
              <h3 className="text-white text-xl font-semibold">{metric.value}</h3>
              <span className="ml-2 text-green-400 text-sm">{metric.change}</span>
            </div>
          </div>
          <div className={`${metric.color} p-3 rounded-lg`}>
            <metric.icon className="h-5 w-5 text-white" />
          </div>
        </div>
      ))}
    </div>
  )
}
