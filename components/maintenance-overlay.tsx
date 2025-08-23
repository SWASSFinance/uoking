"use client"

import { useState, useEffect } from 'react'
import { AlertTriangle, Clock, Wrench } from 'lucide-react'

interface MaintenanceOverlayProps {
  isEnabled: boolean
  message?: string
}

export function MaintenanceOverlay({ isEnabled, message }: MaintenanceOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    if (isEnabled) {
      setShowOverlay(true)
    } else {
      setShowOverlay(false)
    }
  }, [isEnabled])

  if (!showOverlay) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-2xl p-8 border border-orange-200">
        {/* Maintenance Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4">
            <Wrench className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🛠️ Under Maintenance
        </h1>

        {/* Message */}
        <p className="text-xl text-gray-700 mb-6 leading-relaxed">
          {message || "We're currently performing some maintenance to improve your experience. We'll be back shortly!"}
        </p>

        {/* Status Info */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-orange-800">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Expected downtime: 15-30 minutes</span>
          </div>
        </div>

        {/* What's happening */}
        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
            What we're doing:
          </h3>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>• Updating our systems for better performance</li>
            <li>• Adding new features and improvements</li>
            <li>• Ensuring everything runs smoothly</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-600">
          <p>Need immediate assistance? Contact us at:</p>
          <p className="font-semibold text-orange-600">support@uoking.com</p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🔄 Check if we're back online
        </button>
      </div>
    </div>
  )
}
