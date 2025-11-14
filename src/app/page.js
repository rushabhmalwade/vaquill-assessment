import Link from 'next/link'
import { Scale, Users, FileText, Gavel, ArrowRight } from 'lucide-react'
import Navigation from '@/components/UI/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-legal-navy rounded-full mx-auto mb-6 flex items-center justify-center">
              <Scale className="h-8 w-8 text-white flex-shrink-0" />
            </div>
            <h1 className="text-4xl font-bold text-legal-navy mb-4">
              Vaquill
            </h1>
            <p className="text-xl text-legal-slate mb-8">
              AI Judge Legal Simulation Platform
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto mb-8">
              Making complex legal argumentation intuitive, transparent, and accessible through AI-powered mock trials.
            </p>
            <Link href="/case-setup" className="inline-flex items-center bg-legal-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
              Start New Case
              <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-legal-teal flex-shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Interface</h3>
              <p className="text-gray-600 text-sm">Separate interfaces for Party A, Party B, and AI Judge with clear visual distinction.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-legal-teal flex-shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Upload</h3>
              <p className="text-gray-600 text-sm">Drag-and-drop document upload with live preview for PDFs, Word docs, and images.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Gavel className="h-6 w-6 text-legal-teal flex-shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Verdicts</h3>
              <p className="text-gray-600 text-sm">Intelligent analysis and reasoning with transparent decision-making process.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}