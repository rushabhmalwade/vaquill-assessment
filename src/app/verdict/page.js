'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VerdictDisplay from '@/components/UI/VerdictDisplay'
import Navigation from '@/components/UI/Navigation'
import { api } from '@/lib/api'

export default function Verdict() {
  const router = useRouter()
  const [verdict, setVerdict] = useState(null)
  const [caseData, setCaseData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    loadVerdict()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  const loadVerdict = async () => {
    try {
      const caseId = localStorage.getItem('verdictCaseId') || localStorage.getItem('currentCaseId')
      if (!caseId) {
        router.push('/case-setup')
        return
      }
      
      // Load case data
      const caseResponse = await api.cases.getById(caseId)
      if (caseResponse.success) {
        setCaseData(caseResponse.data)
      }
      
      // Load verdict
      const verdictResponse = await api.verdicts.getByCaseId(caseId)
      if (verdictResponse.success && verdictResponse.data) {
        setVerdict(verdictResponse.data)
      } else {
        // Generate verdict if not exists
        setTimeout(async () => {
          const newVerdictResponse = await api.aiJudge.generateVerdict(caseId)
          if (newVerdictResponse.success) {
            setVerdict(newVerdictResponse.data)
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Error loading verdict:', error)
      router.push('/case-setup')
    } finally {
      setTimeout(() => setIsLoading(false), 2000)
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Judge Deliberating...</h2>
            <p className="text-gray-600">Analyzing arguments and evidence</p>
          </div>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    try {
      if (verdict && caseData) {
        const verdictText = `
VERDICT - ${caseData.title}

Ruling: In favor of ${verdict.winner}
Damages: ${verdict.damages ? '$' + verdict.damages.toLocaleString() : 'None'}
Confidence: ${(verdict.confidence * 100).toFixed(1)}%

Reasoning:
${verdict.reasoning}

Key Points:
${verdict.keyPoints.map(point => '• ' + point).join('\n')}
        `
        
        const blob = new Blob([verdictText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `verdict-${caseData.title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading verdict:', error)
    }
  }

  const handleShare = () => {
    try {
      if (verdict && caseData && navigator.share) {
        navigator.share({
          title: `Verdict: ${caseData.title}`,
          text: `AI Judge ruled in favor of ${verdict.winner}. Confidence: ${(verdict.confidence * 100).toFixed(1)}%`,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        const shareText = `Verdict for ${caseData?.title}: AI Judge ruled in favor of ${verdict?.winner}`
        navigator.clipboard.writeText(shareText)
        alert('Verdict summary copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing verdict:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <VerdictDisplay
        verdict={verdict}
        onDownload={handleDownload}
        onShare={handleShare}
      />
    </div>
  )
}