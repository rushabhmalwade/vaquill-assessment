'use client'
import { useState } from 'react'
import { Scale, Send, Paperclip, User, Gavel, MessageSquare, AlertCircle, CheckCircle2, Share2 } from 'lucide-react'
import Button from './Button'

export default function TrialInterface({ 
  arguments: argumentsList = [], 
  onSendArgument, 
  currentTurn = 'plaintiff',
  currentRound = 1,
  maxRounds = 5,
  parties = [],
  initialVerdict = null,
  hasStartedArguments = false,
  onStartArguments
}) {
  const [plaintiffMessage, setPlaintiffMessage] = useState('')
  const [defendantMessage, setDefendantMessage] = useState('')
  const [plaintiffAttachments, setPlaintiffAttachments] = useState([])
  const [defendantAttachments, setDefendantAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (partyId) => {
    const message = partyId === 'plaintiff' ? plaintiffMessage : defendantMessage
    const attachments = partyId === 'plaintiff' ? plaintiffAttachments : defendantAttachments
    
    if (!message.trim() || !onSendArgument || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onSendArgument(message.trim(), partyId, attachments)
      if (partyId === 'plaintiff') {
        setPlaintiffMessage('')
        setPlaintiffAttachments([])
      } else {
        setDefendantMessage('')
        setDefendantAttachments([])
      }
    } catch (error) {
      console.error('Error submitting argument:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (partyId, files) => {
    if (!files || files.length === 0) return
    
    const caseId = localStorage.getItem('currentCaseId')
    if (!caseId) return
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caseId', caseId)
        formData.append('uploadedBy', partyId)
        
        const response = await fetch('/api/documents', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        if (result.success) {
          return {
            id: result.data._id,
            name: file.name,
            size: file.size,
            uploaded: true
          }
        }
        return null
      })
      
      const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean)
      
      if (partyId === 'plaintiff') {
        setPlaintiffAttachments(prev => [...prev, ...uploadedFiles])
      } else {
        setDefendantAttachments(prev => [...prev, ...uploadedFiles])
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }



  const getPartyName = (partyId) => {
    const party = parties.find(p => p.role === partyId)
    return party ? party.name : partyId
  }

  const getArgumentsByParty = (partyId) => {
    return argumentsList.filter(arg => arg.partyId === partyId)
  }

  const getJudgeArguments = () => {
    return argumentsList.filter(arg => arg.partyId === 'judge')
  }

  const canSubmit = (partyId) => {
    return hasStartedArguments && currentTurn === partyId && currentRound <= maxRounds && !isSubmitting
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Professional Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-800 rounded">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getPartyName('plaintiff')} v. {getPartyName('defendant')}
                </h1>
                <p className="text-gray-600 text-sm">Virtual Courtroom Session</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Round</div>
                <div className="text-lg font-semibold text-gray-900">{currentRound}/{maxRounds}</div>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: maxRounds }, (_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${
                    i < currentRound ? 'bg-gray-800' : 
                    i === currentRound - 1 ? 'bg-gray-600' : 'bg-gray-300'
                  }`} />
                ))}
              </div>
              <button 
                onClick={() => {
                  const caseId = localStorage.getItem('currentCaseId')
                  const url = `${window.location.origin}/case/${caseId}`
                  navigator.clipboard.writeText(url)
                  alert('Case URL copied to clipboard!')
                }}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition-colors"
              >
                <Share2 className="h-3 w-3" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        
        {hasStartedArguments && currentRound <= maxRounds && (
          <div className="bg-gray-100 px-6 py-2 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <span className="text-sm font-medium text-gray-700">Current Speaker: {getPartyName(currentTurn)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Judge's Bench */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="bg-gray-800 text-white px-6 py-3">
          <div className="flex items-center justify-center space-x-2">
            <Gavel className="h-4 w-4" />
            <h2 className="text-sm font-semibold tracking-wide">PRESIDING JUDGE</h2>
          </div>
        </div>
        
        <div className="px-6 py-4 max-h-48 overflow-y-auto bg-gray-50">
          {initialVerdict && !hasStartedArguments ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow border border-gray-200">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded">
                    <AlertCircle className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-800 text-sm">PRELIMINARY RULING</span>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Initial Decision:</span> In favor of{' '}
                    <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {initialVerdict.winner}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">{initialVerdict.reasoning}</p>
                </div>
                <div className="text-center">
                  <Button onClick={onStartArguments} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded font-medium text-sm transition-colors">
                    Proceed to Oral Arguments
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3">
              {getJudgeArguments().map((arg, index) => {
                const formatJudgeResponse = (content) => {
                  // Split content into sections for better formatting
                  const sections = content.split(/\n\n+/)
                  return sections.map((section, idx) => {
                    if (section.trim().startsWith('**') || section.includes('COURT OBSERVES') || section.includes('LEGAL ANALYSIS')) {
                      return (
                        <div key={idx} className="mb-3">
                          <h4 className="font-semibold text-gray-800 text-sm mb-2 border-l-3 border-gray-600 pl-3">
                            {section.replace(/\*\*/g, '').trim()}
                          </h4>
                        </div>
                      )
                    } else if (section.includes('?')) {
                      return (
                        <div key={idx} className="mb-3 bg-gray-50 p-3 rounded border-l-3 border-blue-400">
                          <p className="text-gray-700 text-sm font-medium">
                            <span className="text-blue-600">⚖️ Judicial Questions:</span>
                          </p>
                          <p className="text-gray-700 text-sm mt-1">{section.trim()}</p>
                        </div>
                      )
                    } else {
                      return (
                        <div key={idx} className="mb-3">
                          <p className="text-gray-700 text-sm leading-relaxed">{section.trim()}</p>
                        </div>
                      )
                    }
                  })
                }
                
                return (
                  <div key={index} className="bg-white rounded-lg p-5 shadow-md border border-gray-200 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gray-800 rounded">
                          <Scale className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">Judicial Response - Round {arg.round}</span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date(arg.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      {formatJudgeResponse(arg.content)}
                    </div>
                  </div>
                )
              })}
              
              {!hasStartedArguments && argumentsList.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-white rounded-lg p-6 shadow border border-gray-200 max-w-2xl mx-auto">
                    <div className="p-3 bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Scale className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">Court is Now in Session</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p className="leading-relaxed">
                        <span className="font-medium">Honorable AI Judge presiding.</span> This virtual courtroom is equipped with advanced legal AI technology to ensure fair and comprehensive case analysis.
                      </p>
                      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-600">
                        <p className="font-medium text-gray-700 mb-2">⚖️ Judicial Notice:</p>
                        <ul className="text-left space-y-1 text-gray-600">
                          <li>• All arguments will be analyzed under Indian legal framework</li>
                          <li>• Evidence will be evaluated per Indian Evidence Act provisions</li>
                          <li>• Both parties are entitled to fair hearing and due process</li>
                          <li>• The Court maintains comprehensive case memory throughout proceedings</li>
                        </ul>
                      </div>
                      <p className="font-medium text-gray-700">
                        The Court is ready to hear opening arguments from both parties.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Courtroom Floor */}
      <div className="flex-1 flex relative">
        {/* Plaintiff's Table */}
        <div className="w-1/2 bg-white border-r border-gray-200 relative">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{getPartyName('plaintiff')}</h3>
                  <p className="text-gray-600 text-xs">PLAINTIFF</p>
                </div>
              </div>
              {currentTurn === 'plaintiff' && (
                <div className="flex items-center space-x-1 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Active</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3 overflow-y-auto" style={{height: '300px'}}>
              {getArgumentsByParty('plaintiff').map((arg, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Round {arg.round}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{arg.content}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(arg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
              
              {getArgumentsByParty('plaintiff').length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No arguments submitted</p>
                </div>
              )}
            </div>
          </div>

          {/* FIXED INPUT AREA */}
          <div className="absolute bottom-16 left-2 right-2 bg-white border-2 border-gray-400 rounded-lg shadow-xl p-4">
            <textarea
              value={plaintiffMessage}
              onChange={(e) => setPlaintiffMessage(e.target.value)}
              placeholder={`Enter your argument for Round ${currentRound}...`}
              className={`w-full resize-none border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 mb-3 ${
                canSubmit('plaintiff') 
                  ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white' 
                  : 'border-gray-200 bg-gray-100 text-gray-500'
              }`}
              rows="2"
              disabled={!canSubmit('plaintiff')}
            />
            
            <div className="flex space-x-2">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('plaintiff', e.target.files)}
                className="hidden"
                id="plaintiff-file"
              />
              <label htmlFor="plaintiff-file" className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-100">
                <Paperclip className="h-3 w-3" />
                <span>Attach</span>
              </label>
              
              <Button 
                onClick={() => handleSubmit('plaintiff')}
                disabled={!plaintiffMessage.trim() || !canSubmit('plaintiff')}
                className={`flex-1 py-2 rounded text-sm font-medium ${
                  canSubmit('plaintiff') && plaintiffMessage.trim()
                    ? 'bg-gray-800 hover:bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Submit</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Defendant's Table */}
        <div className="w-1/2 bg-white relative">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{getPartyName('defendant')}</h3>
                  <p className="text-gray-600 text-xs">DEFENDANT</p>
                </div>
              </div>
              {currentTurn === 'defendant' && (
                <div className="flex items-center space-x-1 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Active</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3 overflow-y-auto" style={{height: '300px'}}>
              {getArgumentsByParty('defendant').map((arg, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">Round {arg.round}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{arg.content}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(arg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
              
              {getArgumentsByParty('defendant').length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No arguments submitted</p>
                </div>
              )}
            </div>
          </div>

          {/* FIXED INPUT AREA */}
          <div className="absolute bottom-16 left-2 right-2 bg-white border-2 border-gray-400 rounded-lg shadow-xl p-4">
            <textarea
              value={defendantMessage}
              onChange={(e) => setDefendantMessage(e.target.value)}
              placeholder={`Enter your argument for Round ${currentRound}...`}
              className={`w-full resize-none border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 mb-3 ${
                canSubmit('defendant') 
                  ? 'border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white' 
                  : 'border-gray-200 bg-gray-100 text-gray-500'
              }`}
              rows="2"
              disabled={!canSubmit('defendant')}
            />
            
            <div className="flex space-x-2">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('defendant', e.target.files)}
                className="hidden"
                id="defendant-file"
              />
              <label htmlFor="defendant-file" className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-100">
                <Paperclip className="h-3 w-3" />
                <span>Attach</span>
              </label>
              
              <Button 
                onClick={() => handleSubmit('defendant')}
                disabled={!defendantMessage.trim() || !canSubmit('defendant')}
                className={`flex-1 py-2 rounded text-sm font-medium ${
                  canSubmit('defendant') && defendantMessage.trim()
                    ? 'bg-gray-800 hover:bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Submit</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentRound > maxRounds && (
        <div className="bg-gray-100 border-t border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center space-x-3">
            <Gavel className="h-5 w-5 text-gray-600" />
            <p className="font-medium text-gray-800">Trial Complete - Generating Final Verdict</p>
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  )
}