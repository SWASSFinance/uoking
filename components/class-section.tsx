import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"
import Link from "next/link"
import { getClasses } from "@/lib/db"

// High-tech SVG icons for each class
const ClassIconSVG = ({ className, type }: { className: string, type: string }) => {
  const icons: { [key: string]: React.ReactElement } = {
    'warrior': (
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
    'archer': (
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
    'paladin': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" opacity="0.3"/>
        <path d="M50 20 L65 30 L65 55 Q65 70 50 75 Q35 70 35 55 L35 30 Z" fill="url(#shieldGrad)"/>
        <path d="M47 30 L47 40 L42 40 L50 48 L58 40 L53 40 L53 30 Z" fill="#fff"/>
        <circle cx="50" cy="60" r="4" fill="#fff" opacity="0.8"/>
      </svg>
    ),
    'necromancer': (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="skullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#skullGrad)" strokeWidth="2" opacity="0.3"/>
        <ellipse cx="50" cy="45" rx="18" ry="20" fill="url(#skullGrad)"/>
        <circle cx="42" cy="40" r="4" fill="#dc2626"/>
        <circle cx="58" cy="40" r="4" fill="#dc2626"/>
        <polygon points="50,48 48,55 52,55" fill="#374151"/>
        <path d="M42 58 L46 62 L50 58 L54 62 L58 58" stroke="#374151" strokeWidth="2" fill="none"/>
        <path d="M35 65 Q50 55 65 65" stroke="#7c3aed" strokeWidth="2" fill="none" opacity="0.7"/>
      </svg>
    )
  };
  
  return icons[type] || icons['warrior'];
}

export async function ClassSection() {
  // Fetch classes from database
  const classes = await getClasses();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by Character Class</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find weapons, armor, and equipment specifically designed for your character class
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData: any) => {
            return (
              <Link key={classData.id} href={`/class/${classData.slug}`}>
                <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 cursor-pointer bg-gradient-to-b from-gray-50 to-white">
                  {/* Top Icon Section with High-tech Gradient */}
                  <div className="relative h-40 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_70%)]"></div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200 to-transparent rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-200 to-transparent rounded-full blur-lg"></div>
                    </div>
                    
                    {/* High-tech SVG Icon */}
                    <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <ClassIconSVG 
                        className="h-24 w-24 drop-shadow-lg" 
                        type={classData.slug}
                      />
                    </div>
                    
                    {/* Shop Category Badge */}
                    <Badge className="absolute top-3 right-3 bg-amber-500/90 text-black text-xs font-semibold backdrop-blur-sm">
                      Shop Items
                    </Badge>
                    
                    {/* Glowing Orb Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Dark Bottom Section with High Contrast Text */}
                  <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-5">
                    {/* Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                    
                    <div className="relative z-10">
                      {/* Class Name */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                        {classData.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {classData.description}
                      </p>
                      
                      {/* Shopping Info */}
                      <p className="text-amber-400 text-sm mb-4 font-medium">
                        Browse items specifically designed for {classData.name.toLowerCase()} characters
                      </p>
                      
                      {/* Browse Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                          Equipment & Items
                        </span>
                        
                        <Button 
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-md border-0 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
                        >
                          Shop Items
                        </Button>
                      </div>
                    </div>
                    
                    {/* Subtle Bottom Glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No item categories available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/class">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
            >
              Browse All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
