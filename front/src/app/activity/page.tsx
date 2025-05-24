import TransactionsCard from "@/components/activity/TransactionsCard"
import InteractionsCard from "@/components/activity/InteractionsCard"


export default function Activity() {
  return (
    <div className="flex h-screen  bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950">
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <TransactionsCard />
              <InteractionsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
