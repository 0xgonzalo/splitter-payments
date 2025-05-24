import DashboardHeader from "@/components/dashboard/DashboardHeader"
import MetricCards from "@/components/dashboard/MetricCards"
import WelcomeCard from "@/components/dashboard/WelcomeCard"
import DailyCollectorCard from "@/components/dashboard/DailyCollectorCard"
import DailySalesCard from "@/components/dashboard/DailySalesCard"
import SalesOverviewChart from "@/components/dashboard/SalesOverviewChart"
import ActiveBuyersChart from "@/components/dashboard/ActiveBuyersChart"

export default function Dashboard() {
  return (
    <div className="p-6 overflow-y-auto  bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950">
      <div className="max-w-7xl mx-auto">
        <MetricCards />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-5 mt-5">
          <div className="lg:col-span-3 rounded-xl h-[200px]">
            <WelcomeCard name="0xGonzalo" avatarUrl="/images/profile.jpg" />
          </div>
          <div className="lg:col-span-2">
            <DailyCollectorCard name="Memelord.eth" avatarUrl="/images/memelord.png" />
          </div>
          <div className="lg:col-span-2">
            <DailySalesCard percentage={80} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2">
            <SalesOverviewChart />
          </div>
          <div className="lg:col-span-1">
            <ActiveBuyersChart />
          </div>
        </div>
      </div>
    </div>
  )
}
