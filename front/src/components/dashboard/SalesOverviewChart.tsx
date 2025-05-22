"use client"

import { useEffect, useRef } from "react"
import { ArrowUp } from "lucide-react"

export default function SalesOverviewChart() {
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
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const data1 = [200, 150, 300, 250, 400, 350, 300, 450, 300, 250, 350, 400]
    const data2 = [150, 100, 200, 300, 250, 200, 250, 350, 200, 150, 250, 300]

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const padding = { top: 20, right: 20, bottom: 40, left: 40 }
    const graphWidth = chartWidth - padding.left - padding.right
    const graphHeight = chartHeight - padding.top - padding.bottom

    // Y-axis scale
    const maxValue = Math.max(...data1, ...data2) * 1.1
    const yScale = graphHeight / maxValue

    // X-axis scale
    const xScale = graphWidth / (months.length - 1)

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + graphHeight - (i * graphHeight) / 5
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + graphWidth, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText(((maxValue * i) / 5).toFixed(0), padding.left - 10, y + 3)
    }

    // Draw area for data1
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + graphHeight)

    for (let i = 0; i < data1.length; i++) {
      const x = padding.left + i * xScale
      const y = padding.top + graphHeight - data1[i] * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        // Create curved lines
        const prevX = padding.left + (i - 1) * xScale
        const prevY = padding.top + graphHeight - data1[i - 1] * yScale
        const cpX1 = prevX + (x - prevX) / 2
        const cpX2 = prevX + (x - prevX) / 2

        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y)
      }
    }

    // Complete the area by drawing to the bottom right and then bottom left
    ctx.lineTo(padding.left + graphWidth, padding.top + graphHeight)
    ctx.lineTo(padding.left, padding.top + graphHeight)
    ctx.closePath()

    // Fill with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, graphHeight)
    gradient.addColorStop(0, "rgba(0, 102, 255, 0.5)")
    gradient.addColorStop(1, "rgba(0, 102, 255, 0.0)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line for data1
    ctx.beginPath()

    for (let i = 0; i < data1.length; i++) {
      const x = padding.left + i * xScale
      const y = padding.top + graphHeight - data1[i] * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        // Create curved lines
        const prevX = padding.left + (i - 1) * xScale
        const prevY = padding.top + graphHeight - data1[i - 1] * yScale
        const cpX1 = prevX + (x - prevX) / 2
        const cpX2 = prevX + (x - prevX) / 2

        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y)
      }
    }

    ctx.strokeStyle = "#0066FF"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw line for data2
    ctx.beginPath()

    for (let i = 0; i < data2.length; i++) {
      const x = padding.left + i * xScale
      const y = padding.top + graphHeight - data2[i] * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        // Create curved lines
        const prevX = padding.left + (i - 1) * xScale
        const prevY = padding.top + graphHeight - data2[i - 1] * yScale
        const cpX1 = prevX + (x - prevX) / 2
        const cpX2 = prevX + (x - prevX) / 2

        ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y)
      }
    }

    ctx.strokeStyle = "#00BFFF"
    ctx.lineWidth = 2
    ctx.stroke()

    // X-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"

    for (let i = 0; i < months.length; i++) {
      if (i % 2 === 0) {
        // Show every other month to avoid crowding
        const x = padding.left + i * xScale
        ctx.fillText(months[i], x, padding.top + graphHeight + 15)
      }
    }
  }, [])

  return (
    <div className="bg-[#0c1e3d]/80 rounded-lg p-5 backdrop-blur-sm h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-white text-lg font-semibold">Sales overview</h2>
          <div className="flex items-center text-green-400 text-sm">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span>(+4) more in 2024</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  )
}
