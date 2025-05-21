import DashboardHeader from "@/components/dashboard/DashboardHeader"
import MetricCards from "@/components/dashboard/MetricCards"
import WelcomeCard from "@/components/dashboard/WelcomeCard"
import DailyCollectorCard from "@/components/dashboard/DailyCollectorCard"
import DailySalesCard from "@/components/dashboard/DailySalesCard"
import SalesOverviewChart from "@/components/dashboard/SalesOverviewChart"
import ActiveBuyersChart from "@/components/dashboard/ActiveBuyersChart"
import Sidebar from "@/components/Sidebar"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a1025] to-[#0f2e5c]">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <MetricCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
              <div className="lg:col-span-1">
                <WelcomeCard name="0xGonzalo" avatarUrl="/images/profile.jpg" />
              </div>
              <div className="lg:col-span-1">
                <DailyCollectorCard name="Memelord.eth" avatarUrl="/images/frog-nft.png" />
              </div>
              <div className="lg:col-span-1">
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
        </main>
      </div>
    </div>
  )
}
