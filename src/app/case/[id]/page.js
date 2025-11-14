'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '@/components/UI/Navigation'
import { Scale, Calendar, User, FileText, MessageSquare, Gavel } from 'lucide-react'
import { api } from '@/lib/api'

export default function PublicCasePage() {
  const params = useParams()
  const [caseData, setCaseData] = useState(null)
  const [argumentsList, setArgumentsList] = useState([])
  const [documents, setDocuments] = useState([])
  const [verdict, setVerdict] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCaseData = useCallback(async () => {
    try {
      const [caseResponse, argsResponse, docsResponse, verdictResponse] = await Promise.all([
        api.cases.getById(params.id),
        api.arguments.getByCaseId(params.id),
        api.documents.getByCaseId(params.id),
        api.verdicts.getByCaseId(params.id)
      ])

      if (caseResponse.success) setCaseData(caseResponse.data)
      if (argsResponse.success) setArgumentsList(argsResponse.data)
      if (docsResponse.success) setDocuments(docsResponse.data)
      if (verdictResponse.success) setVerdict(verdictResponse.data)
    } catch (error) {
      console.error('Error loading case data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadCaseData()
  }, [loadCaseData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading case details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Case Not Found</h1>
            <p className="text-gray-600">The requested case could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  const getArgumentsByParty = (partyId) => {
    return argumentsList.filter(arg => arg.partyId === partyId)
  }

  const getJudgeArguments = () => {
    return argumentsList.filter(arg => arg.partyId === 'judge')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Case Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Scale className="h-8 w-8 text-legal-navy" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
                <p className="text-gray-600">Case #{caseData._id.slice(-8)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Created: {new Date(caseData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                caseData.status === 'completed' ? 'bg-green-100 text-green-800' :
                caseData.status === 'active' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {caseData.status.toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Parties</h3>
              {caseData.parties.map((party, index) => (
                <div key={index} className="flex items-center space-x-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{party.name}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{party.role}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Trial Progress</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Round {caseData.currentRound}/{caseData.maxRounds}</span>
                <div className="flex space-x-1">
                  {Array.from({ length: caseData.maxRounds }, (_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${
                      i < caseData.currentRound ? 'bg-legal-teal' : 'bg-gray-300'
                    }`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        {documents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-legal-navy" />
              Evidence & Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.uploadedBy}</span>
                  </div>
                  {doc.analysis && (
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">{doc.analysis.summary}</p>
                      {doc.analysis.legalTerms && doc.analysis.legalTerms.length > 0 && (
                        <p className="text-xs">Legal terms: {doc.analysis.legalTerms.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trial Proceedings */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-legal-navy" />
            Trial Proceedings
          </h2>
          
          <div className="space-y-6">
            {Array.from({ length: caseData.currentRound }, (_, round) => (
              <div key={round} className="border-l-4 border-gray-200 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3">Round {round + 1}</h3>
                
                {/* Arguments for this round */}
                {argumentsList.filter(arg => arg.round === round + 1).map((arg, index) => (
                  <div key={index} className={`mb-3 p-4 rounded-lg border-l-4 ${
                    arg.partyId === 'judge' ? 'bg-purple-50 border-purple-500' :
                    arg.partyId === 'plaintiff' ? 'bg-blue-50 border-blue-500' :
                    'bg-green-50 border-green-500'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {arg.partyId === 'judge' ? (
                        <Gavel className="h-4 w-4 text-purple-600" />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                      <span className={`font-medium ${
                        arg.partyId === 'judge' ? 'text-purple-900' :
                        arg.partyId === 'plaintiff' ? 'text-blue-900' :
                        'text-green-900'
                      }`}>
                        {arg.partyId === 'judge' ? 'AI Judge' : `${arg.partyName} (${arg.partyId})`}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(arg.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-800">{arg.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Verdict */}
        {verdict && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-legal-navy" />
              Final Verdict
            </h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-500">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Decision</h3>
                <p className="text-purple-800">
                  <strong>Ruling in favor of:</strong> <span className="capitalize">{verdict.winner}</span>
                </p>
                {verdict.damages && (
                  <p className="text-purple-800">
                    <strong>Damages awarded:</strong> ₹{verdict.damages.toLocaleString()}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Reasoning</h3>
                <p className="text-purple-800 leading-relaxed">{verdict.reasoning}</p>
              </div>
              
              {verdict.keyPoints && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Key Findings</h3>
                  <ul className="space-y-1">
                    {verdict.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-600 font-bold">•</span>
                        <span className="text-purple-800">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {verdict.legalCitations && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Legal Citations</h3>
                  <div className="flex flex-wrap gap-2">
                    {verdict.legalCitations.map((citation, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                        {citation}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}