import ActivityHeader from "@/components/activity/ActivityHeader"
import TransactionsCard from "@/components/activity/TransactionsCard"
import InteractionsCard from "@/components/activity/InteractionsCard"
import ContractsTable from "@/components/activity/ContractsTable"
import Sidebar from "@/components/Sidebar"

export default function Activity() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a1025] to-[#0f2e5c]">
      <Sidebar activePage="activity" />
      <div className="flex-1 flex flex-col overflow-auto">
        <ActivityHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <TransactionsCard />
              <InteractionsCard />
            </div>
            <ContractsTable />
          </div>
        </main>
      </div>
    </div>
  )
}
