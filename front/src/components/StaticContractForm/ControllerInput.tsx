"use client"

interface ControllerInputProps {
  controller: string
  setController: React.Dispatch<React.SetStateAction<string>>
}

export default function ControllerInput({ controller, setController }: ControllerInputProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Controller</h2>
      <input
        type="text"
        placeholder="Enter address or ENS"
        value={controller}
        onChange={(e) => setController(e.target.value)}
        className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-gray-500 text-sm mt-2">* Controller is not defined, splits will remain immutable.</p>
    </div>
  )
} 