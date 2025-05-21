import SplitContractForm from "../components/SplitContractForm"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a1025] to-[#0f2e5c]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 md:p-10">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-2">
                Create a Split Contract
                <span className="inline-block animate-spin text-blue-400">◎</span>
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Deploy smart contracts that automatically distributes all incoming MNT and ERC20 tokens among recipients
                based on predefined ownership shares. Recipients can be any valid address, including other Split
                contracts. You&apos;ll be able to monitor all activity through the analytics dashboards.
              </p>
            </div>
            <SplitContractForm />
          </div>
        </main>
      </div>
    </div>
  )
}
