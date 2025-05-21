"use client"

import { useEffect, useRef } from "react"
import { ArrowUp, Users, ShoppingCart, FileText } from "lucide-react"

export default function ActiveBuyersChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Chart data
    const data = [400, 300, 200, 350, 250, 450, 300, 200, 350, 250]

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const graphWidth = chartWidth - padding.left - padding.right
    const graphHeight = chartHeight - padding.top - padding.bottom

    // Bar properties
    const barCount = data.length
    const barWidth = (graphWidth / barCount) * 0.6
    const barSpacing = (graphWidth / barCount) * 0.4

    // Y-axis scale
    const maxValue = Math.max(...data) * 1.1
    const yScale = graphHeight / maxValue

    // Draw bars
    for (let i = 0; i < data.length; i++) {
      const barHeight = data[i] * yScale
      const x = padding.left + i * (barWidth + barSpacing) + barSpacing / 2
      const y = padding.top + graphHeight - barHeight

      // Draw bar
      ctx.fillStyle = "#0066FF"
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
      ctx.fill()
    }

    // Y-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"

    for (let i = 0; i <= 5; i++) {
      const value = ((maxValue * i) / 5).toFixed(0)
      const y = padding.top + graphHeight - (i * graphHeight) / 5
      ctx.fillText(value, padding.left - 5, y + 3)
    }
  }, [])

  return (
    <div className="bg-[#0c1e3d]/80 rounded-lg p-5 backdrop-blur-sm h-full">
      <div className="mb-4">
        <h2 className="text-white text-lg font-semibold">Active Buyers</h2>
        <div className="flex items-center text-green-400 text-sm">
          <ArrowUp className="h-3 w-3 mr-1" />
          <span>(+23) than last week</span>
        </div>
      </div>

      <div className="h-40 w-full mb-6">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-[#1a2542] rounded-lg p-3 flex flex-col items-center">
          <div className="bg-blue-500 rounded-md p-1.5 mb-2">
            <Users className="h-4 w-4 text-white" />
          </div>
          <p className="text-white font-bold">3,258</p>
          <p className="text-gray-400 text-xs">Users</p>
        </div>

        <div className="bg-[#1a2542] rounded-lg p-3 flex flex-col items-center">
          <div className="bg-blue-500 rounded-md p-1.5 mb-2">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <p className="text-white font-bold">13,000$</p>
          <p className="text-gray-400 text-xs">Sales</p>
        </div>

        <div className="bg-[#1a2542] rounded-lg p-3 flex flex-col items-center">
          <div className="bg-blue-500 rounded-md p-1.5 mb-2">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <p className="text-white font-bold">12</p>
          <p className="text-gray-400 text-xs">Contracts</p>
        </div>
      </div>
    </div>
  )
}
