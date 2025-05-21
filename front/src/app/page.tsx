"use client"

import { useState } from "react"
import SplitContractForm from "../components/SplitContractForm"
import DynamicForm from "../components/DynamicForm"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { Providers } from "./providers"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"split" | "dynamic">("split")

  return (
    <Providers>
      <div className="flex h-screen bg-gradient-to-br from-[#0a1025] to-[#0f2e5c]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <Header />
          <main className="flex-1 flex items-center justify-center p-4 md:p-10">
            <div className="w-full max-w-2xl">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-2">
                  {activeTab === "split" ? "Create a Split Contract" : "Dynamic Form"}
                  <span className="inline-block animate-spin text-blue-400">◎</span>
                </h1>
                {activeTab === "split" ? (
                  <p className="text-gray-300 max-w-2xl">
                    Deploy smart contracts that automatically distributes all incoming MNT and ERC20 tokens among recipients
                    based on predefined ownership shares. Recipients can be any valid address, including other Split
                    contracts. You&apos;ll be able to monitor all activity through the analytics dashboards.
                  </p>
                ) : (
                  <p className="text-gray-300 max-w-2xl">
                    Configure dynamic settings for your split contract with additional parameters and options.
                  </p>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("split")}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "split"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  Split Contract
                </button>
                <button
                  onClick={() => setActiveTab("dynamic")}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "dynamic"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  Dynamic Settings
                </button>
              </div>

              {/* Form Content */}
              {activeTab === "split" ? <SplitContractForm /> : <DynamicForm />}
            </div>
          </main>
        </div>
      </div>
    </Providers>
  )
}
