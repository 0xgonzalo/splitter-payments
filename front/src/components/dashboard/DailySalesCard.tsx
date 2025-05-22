"use client"

import { Smile } from "lucide-react"

interface DailySalesCardProps {
  percentage: number
}

export default function DailySalesCard({ percentage }: DailySalesCardProps) {
  // Calculate the circumference of the circle
  const radius = 70
  const circumference = 2 * Math.PI * radius

  // Calculate the dash offset based on the percentage
  const dashOffset = circumference - (circumference * percentage) / 100

  return (
    <div className="bg-[#0c1e3d]/80 rounded-lg h-full backdrop-blur-sm">
      <div className="p-5">
        <h2 className="text-white text-lg font-semibold">Daily sales</h2>
        <p className="text-gray-400 text-sm">From all projects</p>
      </div>
      <div className="flex flex-col items-center justify-center p-4 relative">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#1a2542" strokeWidth="8" />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#0066FF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 80 80)"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-blue-500 rounded-full p-2">
              <Smile className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-white text-3xl font-bold">{percentage}%</h3>
          <p className="text-gray-400 text-sm">Daily goal</p>
        </div>

        <div className="flex justify-between w-full mt-2 px-4">
          <span className="text-gray-400 text-xs">0%</span>
          <span className="text-gray-400 text-xs">100%</span>
        </div>
      </div>
    </div>
  )
}
