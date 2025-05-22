"use client"

interface MonitoringSettingsProps {
  monitoring: string
  setMonitoring: React.Dispatch<React.SetStateAction<string>>
}

export default function MonitoringSettings({ monitoring, setMonitoring }: MonitoringSettingsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Split Monitoring</h2>
      <input
        type="text"
        placeholder="1%"
        value={`${monitoring}%`}
        onChange={(e) => {
          const value = e.target.value.replace(/%/g, "")
          setMonitoring(value)
        }}
        className="w-48 bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-gray-500 text-sm mt-2">Donate at least 0.1% to see advanced analytics.</p>
    </div>
  )
} 