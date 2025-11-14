'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/UI/Navigation'
import TrialInterface from '@/components/UI/TrialInterface'
import { api } from '@/lib/api'

export default function Trial() {
  const router = useRouter()
  const [caseData, setCaseData] = useState(null)
  const [trialArguments, setTrialArguments] = useState([])
  const [currentRound, setCurrentRound] = useState(1)
  const [currentTurn, setCurrentTurn] = useState('plaintiff')
  const [isLoading, setIsLoading] = useState(true)
  const [insights, setInsights] = useState([])
  const [initialVerdict, setInitialVerdict] = useState(null)
  const [hasStartedArguments, setHasStartedArguments] = useState(false)
  
  useEffect(() => {
    loadCaseData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Check if trial is complete and navigate to verdict
  useEffect(() => {
    if (caseData && currentRound > (caseData.maxRounds || 5)) {
      console.log('Trial rounds exceeded, navigating to verdict...')
      localStorage.setItem('verdictCaseId', caseData._id)
      router.push('/verdict')
    }
  }, [currentRound, caseData, router])
  
  const loadCaseData = async () => {
    try {
      const caseId = localStorage.getItem('currentCaseId')
      if (!caseId) {
        router.push('/case-setup')
        return
      }
      
      const response = await api.cases.getById(caseId)
      if (response.success) {
        setCaseData(response.data)
        setCurrentRound(response.data.currentRound || 1)
        
        // Load existing arguments
        const argsResponse = await api.arguments.getByCaseId(caseId)
        if (argsResponse.success) {
          setTrialArguments(argsResponse.data)
          setHasStartedArguments(argsResponse.data.length > 0)
          
          // Determine current turn based on last argument
          const lastArg = argsResponse.data[argsResponse.data.length - 1]
          if (lastArg && lastArg.partyId !== 'judge') {
            setCurrentTurn(lastArg.partyId === 'plaintiff' ? 'defendant' : 'plaintiff')
          }
        }
        
        // Load or generate initial verdict
        if (!response.data.hasInitialVerdict) {
          const initialResponse = await api.aiJudge.generateInitial(caseId)
          if (initialResponse.success) {
            setInitialVerdict(initialResponse.data)
          }
        } else {
          // Load existing initial verdict
          const verdictResponse = await api.verdicts.getByCaseId(caseId)
          if (verdictResponse.success && verdictResponse.data?.isInitial) {
            setInitialVerdict(verdictResponse.data)
          }
        }
      } else {
        router.push('/case-setup')
      }
    } catch (error) {
      console.error('Error loading case:', error)
      router.push('/case-setup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendArgument = async (content, partyId) => {
    if (!content || !content.trim() || !caseData || isLoading) return
    
    setIsLoading(true)
    
    try {
      const partyName = caseData.parties.find(p => p.role === partyId)?.name || partyId
      
      // Save argument to database
      const argumentData = {
        caseId: caseData._id,
        partyId,
        partyName,
        content: content.trim(),
        round: currentRound
      }
      
      const response = await api.arguments.create(argumentData)
      if (response.success) {
        // Refresh arguments from database to ensure we have the latest
        const refreshResponse = await api.arguments.getByCaseId(caseData._id)
        const newArguments = refreshResponse.success ? refreshResponse.data : [...trialArguments, response.data]
        setTrialArguments(newArguments)
        
        // Check if both parties have argued in this round
        const currentRoundArgs = newArguments.filter(arg => arg.round === currentRound && arg.partyId !== 'judge')
        
        if (currentRoundArgs.length === 2) {
          // Both parties have argued, get AI judge reconsideration
          const maxRounds = caseData.maxRounds || 5
          
          // Check if this is the final round
          if (currentRound >= maxRounds) {
            console.log('Final round completed, generating verdict...')
            try {
              await api.aiJudge.generateVerdict(caseData._id)
            } catch (verdictError) {
              console.error('Error generating verdict:', verdictError)
            }
            localStorage.setItem('verdictCaseId', caseData._id)
            router.push('/verdict')
            return
          }
          
          // Not final round, get judge response and continue
          try {
            const judgeResponse = await api.aiJudge.respond(caseData._id)
            if (judgeResponse.success) {
              setTrialArguments(prev => [...prev, judgeResponse.data])
            }
            
            // Generate insights based on arguments
            generateInsights(currentRoundArgs)
            
            // Move to next round
            const nextRound = currentRound + 1
            setCurrentRound(nextRound)
            setCurrentTurn('plaintiff')
            
            // Update case round in database
            await api.cases.update(caseData._id, { currentRound: nextRound })
            
          } catch (error) {
            console.error('Error getting judge response:', error)
            // Continue to next round even if judge response fails
            const nextRound = currentRound + 1
            setCurrentRound(nextRound)
            setCurrentTurn('plaintiff')
            await api.cases.update(caseData._id, { currentRound: nextRound })
          }

        } else {
          setCurrentTurn(currentTurn === 'plaintiff' ? 'defendant' : 'plaintiff')
        }
      }
    } catch (error) {
      console.error('Error sending argument:', error)
      alert('Failed to submit argument. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const startArguments = () => {
    setHasStartedArguments(true)
  }
  
  const generateInsights = (roundArgs) => {
    const newInsights = [
      `Round ${currentRound}: Both parties presented their arguments`,
      'AI is reconsidering its initial decision',
      'Consider strengthening evidence for next round'
    ]
    setInsights(prev => [...prev, ...newInsights])
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trial data...</p>
        </div>
      </div>
    )
  }
  
  if (!caseData) {
    return null
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 min-h-0">
        <TrialInterface
          arguments={trialArguments}
          onSendArgument={handleSendArgument}
          currentTurn={currentTurn}
          currentRound={currentRound}
          maxRounds={caseData.maxRounds || 5}
          parties={caseData.parties}
          initialVerdict={initialVerdict}
          hasStartedArguments={hasStartedArguments}
          onStartArguments={startArguments}
        />
      </div>
    </div>
  )
}