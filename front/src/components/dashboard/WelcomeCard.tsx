import Image from "next/image"

interface WelcomeCardProps {
  name: string
  avatarUrl: string
}

export default function WelcomeCard({ name, avatarUrl }: WelcomeCardProps) {
  return (
    <div className="bg-[#0c1e3d]/80 rounded-lg h-full backdrop-blur-sm overflow-hidden">
      <div className="p-5">
        <h2 className="text-gray-400 text-sm">Welcome back,</h2>
        <h1 className="text-white text-2xl font-bold mt-1">{name}</h1>
        <p className="text-gray-400 mt-4">Glad to see you again!</p>
        <p className="text-gray-400">Ask me anything.</p>
      </div>
      <div className="flex justify-center p-4">
        <div className="bg-white rounded-lg overflow-hidden w-40 h-40">
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt="Profile avatar"
            width={160}
            height={160}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
