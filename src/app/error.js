'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-8">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <div className="text-sm text-gray-500">
            <a href="/" className="text-blue-600 hover:underline">
              Go Home
            </a>
            {' | '}
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:underline bg-none border-none cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}