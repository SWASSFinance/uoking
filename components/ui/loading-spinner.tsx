import { Crown } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className="relative">
        <Crown className={`${sizeClasses[size]} text-amber-600 animate-pulse`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin`}></div>
      </div>
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  )
} 