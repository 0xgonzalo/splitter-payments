import Image from "next/image"

interface DailyCollectorCardProps {
  name: string
  avatarUrl: string
}

export default function DailyCollectorCard({ name, avatarUrl }: DailyCollectorCardProps) {
  return (
    <div className="bg-[#0c1e3d]/80 rounded-lg h-full backdrop-blur-sm">
      <div className="p-5">
        <h2 className="text-white text-lg font-semibold">Daily Collector</h2>
        <p className="text-gray-400 text-sm">From all projects</p>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="rounded-full overflow-hidden w-32 h-32 border-4 border-blue-500">
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt="Collector avatar"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
        <h3 className="text-white text-lg font-semibold mt-4">{name}</h3>
      </div>
    </div>
  )
}
