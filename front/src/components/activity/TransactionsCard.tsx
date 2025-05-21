"use client"

import { useState } from "react"
import { Calendar, Plus, Clock, AlertCircle } from "lucide-react"

// Sample transaction data
const transactions = [
  {
    id: "0x42cd4f...",
    date: "15 May 2025, at 12:30 PM",
    amount: "+25 MNT",
    status: "completed",
    isNew: true,
  },
  {
    id: "0xgonzalo.eth",
    date: "15 May 2025, at 11:30 PM",
    amount: "+20 MNT",
    status: "completed",
    isNew: true,
  },
  {
    id: "0xDe905f...",
    date: "14 May 2025, at 13:45 PM",
    amount: "+8.01 MNT",
    status: "completed",
    isYesterday: true,
  },
  {
    id: "vitalik.eth",
    date: "14 May 2025, at 12:30 PM",
    amount: "+17 MNT",
    status: "completed",
    isYesterday: true,
  },
  {
    id: "0x63eF99...",
    date: "14 May 2025, at 05:00 AM",
    amount: "Pending",
    status: "pending",
    isYesterday: true,
  },
  {
    id: "0x9945f...",
    date: "14 May 2025, at 16:30 PM",
    amount: "+9.87 MNT",
    status: "completed",
    isYesterday: true,
  },
]

export default function TransactionsCard() {
  const [dateRange, setDateRange] = useState("08 - 15 May 2025")

  return (
    <div className="bg-[#0c1e3d]/80 rounded-lg backdrop-blur-sm h-full">
      <div className="p-5 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-white text-lg font-semibold">Your Transactions</h2>
        <button className="flex items-center space-x-2 text-gray-300 bg-[#1a2542] rounded-md px-3 py-1.5 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{dateRange}</span>
        </button>
      </div>

      <div className="divide-y divide-gray-800">
        <div className="px-5 py-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NEWEST</h3>
        </div>

        {transactions
          .filter((tx) => tx.isNew)
          .map((transaction) => (
            <div key={transaction.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.status === "pending" ? "bg-gray-700" : "bg-blue-500/20"
                  }`}
                >
                  {transaction.status === "pending" ? (
                    <Clock className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Plus className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{transaction.id}</p>
                  <p className="text-gray-400 text-xs">{transaction.date}</p>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${
                  transaction.status === "pending" ? "text-gray-400" : "text-green-400"
                }`}
              >
                {transaction.amount}
              </div>
            </div>
          ))}

        <div className="px-5 py-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">YESTERDAY</h3>
        </div>

        {transactions
          .filter((tx) => tx.isYesterday)
          .map((transaction) => (
            <div key={transaction.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.status === "pending" ? "bg-gray-700" : "bg-blue-500/20"
                  }`}
                >
                  {transaction.status === "pending" ? (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Plus className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{transaction.id}</p>
                  <p className="text-gray-400 text-xs">{transaction.date}</p>
                </div>
              </div>
              <div
                className={`text-sm font-medium ${
                  transaction.status === "pending" ? "text-gray-400" : "text-green-400"
                }`}
              >
                {transaction.amount}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
