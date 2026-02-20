import { Link } from 'react-router-dom'

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}

export default function ToolCard({ title, description, href, icon, color }: ToolCardProps) {
  return (
    <Link
      to={href}
      className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center tool-card-hover cursor-pointer"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-base mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </Link>
  )
}
