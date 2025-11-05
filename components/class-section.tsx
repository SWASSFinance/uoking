"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"
import Link from "next/link"

// Gaming-style button component without canvas
const GamingButton = ({ 
  title, 
  description, 
  icon, 
  href, 
  color = "amber",
  isPopular = false 
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color?: string
  isPopular?: boolean
}) => {
  const colorMap = {
    amber: {
      primary: "#f59e0b",
      secondary: "#d97706",
      glow: "#fbbf24",
      bg: "rgba(251, 191, 36, 0.1)"
    },
    purple: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      glow: "#a78bfa",
      bg: "rgba(139, 92, 246, 0.1)"
    },
    green: {
      primary: "#10b981",
      secondary: "#059669",
      glow: "#34d399",
      bg: "rgba(16, 185, 129, 0.1)"
    },
    red: {
      primary: "#ef4444",
      secondary: "#dc2626",
      glow: "#f87171",
      bg: "rgba(239, 68, 68, 0.1)"
    },
    blue: {
      primary: "#3b82f6",
      secondary: "#2563eb",
      glow: "#60a5fa",
      bg: "rgba(59, 130, 246, 0.1)"
    },
    gray: {
      primary: "#6b7280",
      secondary: "#4b5563",
      glow: "#9ca3af",
      bg: "rgba(107, 114, 128, 0.1)"
    }
  }

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.amber

  return (
    <Link href={href} prefetch={href.startsWith('/class/') ? false : undefined} className="block w-full h-full">
      <div className="relative group cursor-pointer bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 rounded-lg p-6 h-48 flex flex-col justify-between transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105">
        {/* Animated background glow on hover */}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${colors.bg}, transparent 70%)`
          }}
        />
        
        {/* Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                {title}
              </h3>
              {isPopular && (
                <Badge className="bg-amber-500 text-black text-xs font-semibold mt-1">
                  Popular
                </Badge>
              )}
            </div>
          </div>
          
          {/* Glowing indicator */}
          <div 
            className="w-3 h-3 rounded-full group-hover:animate-pulse transition-all duration-300"
            style={{ backgroundColor: colors.primary }}
          />
        </div>

        {/* Description */}
        <div className="relative z-10">
          <p className="text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom section */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400">
        
          </div>
          
          <div className="relative">
            <div 
              className="absolute inset-0 rounded blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"
              style={{ backgroundColor: colors.glow }}
            />
            <Button 
              size="sm"
              className="relative bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-md border-0 transition-all duration-300"
            >
              Explore
            </Button>
          </div>
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
        </div>

        {/* Border glow effect */}
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${colors.glow}`,
            border: `1px solid ${colors.glow}`
          }}
        />
      </div>
    </Link>
  )
}

// High-tech SVG icons for each class
const ClassIconSVG = ({ className, type }: { className: string, type: string }) => {
  const icons: { [key: string]: React.ReactElement } = {
    'mage': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="staffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#staffGrad)" strokeWidth="2" opacity="0.3"/>
        <circle cx="50" cy="25" r="8" fill="url(#orbGrad)" opacity="0.9"/>
        <circle cx="50" cy="25" r="5" fill="#60a5fa" opacity="0.6"/>
        <rect x="48" y="33" width="4" height="40" fill="url(#staffGrad)"/>
        <polygon points="44,70 56,70 54,78 46,78" fill="url(#staffGrad)"/>
        <path d="M42 20 Q50 15 58 20" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.7"/>
      </svg>
    ),
    'tamer': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#heartGrad)" strokeWidth="2" opacity="0.3"/>
        <path d="M50 35 C45 25, 30 25, 30 40 C30 55, 50 70, 50 70 C50 70, 70 55, 70 40 C70 25, 55 25, 50 35 Z" fill="url(#heartGrad)"/>
        <circle cx="40" cy="38" r="3" fill="#fbbf24"/>
        <circle cx="60" cy="38" r="3" fill="#fbbf24"/>
        <path d="M35 60 Q50 45 65 60" stroke="#fbbf24" strokeWidth="2" fill="none"/>
      </svg>
    ),
    'melee': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="swordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#swordGrad)" strokeWidth="2" opacity="0.3"/>
        <path d="M30 20 L70 20 L75 25 L75 35 L70 40 L30 40 L25 35 L25 25 Z" fill="url(#swordGrad)" filter="url(#glow)"/>
        <rect x="47" y="40" width="6" height="30" fill="url(#swordGrad)"/>
        <rect x="42" y="70" width="16" height="8" rx="2" fill="url(#swordGrad)"/>
        <circle cx="50" cy="30" r="3" fill="#fff" opacity="0.8"/>
      </svg>
    ),
    'ranged': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="bowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#bowGrad)" strokeWidth="2" opacity="0.3"/>
        <path d="M25 30 Q50 20 75 30 Q50 50 75 70 Q50 80 25 70 Q50 50 25 30" fill="none" stroke="url(#bowGrad)" strokeWidth="3"/>
        <line x1="35" y1="50" x2="65" y2="50" stroke="#fbbf24" strokeWidth="2"/>
        <polygon points="65,50 75,45 75,55" fill="#fbbf24"/>
        <circle cx="30" cy="35" r="2" fill="#10b981"/>
        <circle cx="30" cy="65" r="2" fill="#10b981"/>
      </svg>
    ),
    'thief': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="daggerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#daggerGrad)" strokeWidth="2" opacity="0.3"/>
        <path d="M45 20 L55 20 L60 25 L60 35 L55 40 L45 40 L40 35 L40 25 Z" fill="url(#daggerGrad)"/>
        <rect x="48" y="40" width="4" height="25" fill="url(#daggerGrad)"/>
        <rect x="46" y="65" width="8" height="6" rx="1" fill="url(#daggerGrad)"/>
        <circle cx="50" cy="30" r="2" fill="#fff" opacity="0.8"/>
      </svg>
    ),
    'crafter': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="hammerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#hammerGrad)" strokeWidth="2" opacity="0.3"/>
        <rect x="40" y="25" width="20" height="8" fill="url(#hammerGrad)"/>
        <rect x="45" y="33" width="10" height="25" fill="url(#hammerGrad)"/>
        <rect x="35" y="58" width="30" height="8" fill="url(#hammerGrad)"/>
        <circle cx="50" cy="30" r="2" fill="#fff" opacity="0.8"/>
      </svg>
    )
  };
  
  return icons[type] || icons['mage'];
}

export function ClassSection() {
  const classItems = [
    { 
      name: "Mage", 
      slug: "mage", 
      description: "Powerful spellcasters with devastating magical abilities",
      color: "purple",
      isPopular: true
    },
    { 
      name: "Tamer", 
      slug: "tamer", 
      description: "Masters of beasts and creatures, commanding powerful pets",
      color: "red"
    },
    { 
      name: "Melee", 
      slug: "melee", 
      description: "Close combat warriors with exceptional physical strength",
      color: "amber",
      isPopular: true
    },
    { 
      name: "Ranged", 
      slug: "ranged", 
      description: "Skilled archers and marksmen with precision accuracy",
      color: "green"
    },
    { 
      name: "Thief", 
      slug: "thief", 
      description: "Stealthy rogues with exceptional agility and cunning",
      color: "gray"
    },
    { 
      name: "Crafter", 
      slug: "crafter", 
      description: "Master artisans creating powerful equipment and items",
      color: "amber",
      isPopular: true
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ultima Online Classes</h2>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose your character class and find the perfect equipment
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {classItems.map((classData) => (
            <GamingButton
              key={classData.slug}
              title={classData.name}
              description={classData.description}
              icon={<ClassIconSVG className="h-8 w-8" type={classData.slug} />}
              href={`/class/${classData.name.toLowerCase()}`}
              color={classData.color}
              isPopular={classData.isPopular}
            />
          ))}
        </div>

        
      </div>
    </section>
  )
}
