"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Server, Wifi, WifiOff } from "lucide-react"

export function ServerStatusHeader() {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Ultima Online Server Status
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Real-time monitoring of all Ultima Online servers including Login, Patch, and Game servers across all regions.
        </p>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-green-200 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Login Server</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                <Server className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Patch Server</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-400 bg-amber-50/50 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Last Updated</p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Just now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Lag/Issues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Offline</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Unknown</span>
        </div>
      </div>
    </div>
  )
}
