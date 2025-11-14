'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, FileText, ArrowRight } from 'lucide-react'
import Card from '@/components/UI/Card'
import Button from '@/components/UI/Button'
import DocumentUpload from '@/components/UI/DocumentUpload'
import Navigation from '@/components/UI/Navigation'
import { api } from '@/lib/api'

export default function CaseSetup() {
  const router = useRouter()
  const [parties, setParties] = useState([
    { name: '', role: 'plaintiff' },
    { name: '', role: 'defendant' }
  ])
  const [caseTitle, setCaseTitle] = useState('')
  const [documents, setDocuments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePartyChange = (index, field, value) => {
    if (index >= 0 && index < parties.length) {
      setParties(prev => {
        const newParties = [...prev]
        newParties[index] = { ...newParties[index], [field]: value }
        return newParties
      })
    }
  }

  const handleDocumentUpload = (document) => {
    if (document && document.name) {
      setDocuments(prev => [...prev, document])
    }
  }
  
  const handleStartTrial = async () => {
    if (!canProceed || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      // Create case in database
      const caseData = {
        title: caseTitle,
        parties,
        documents,
        maxRounds: 5
      }
      
      const response = await api.cases.create(caseData)
      
      if (response.success) {
        // Store case ID and navigate to trial
        localStorage.setItem('currentCaseId', response.data._id)
        router.push('/trial')
      } else {
        console.error('Case creation failed:', response)
        alert('Failed to create case: ' + (response.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating case:', error)
      alert('Failed to create case. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = caseTitle.trim() && parties.every(p => p.name.trim())

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-legal-navy mb-2">Case Setup</h1>
          <p className="text-legal-slate">Configure your legal simulation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-legal-navy flex-shrink-0" />
              Case Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Title
                </label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g., Smith vs ABC Corp - Contract Dispute"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-legal-teal focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-legal-navy flex-shrink-0" />
              Parties
            </h2>
            <div className="space-y-4">
              {parties.map((party, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {party.role} Name
                  </label>
                  <input
                    type="text"
                    value={party.name}
                    onChange={(e) => handlePartyChange(index, 'name', e.target.value)}
                    placeholder={`Enter ${party.role} name`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-legal-teal focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Plaintiff Documents
            </h2>
            <DocumentUpload 
              documents={documents.filter(doc => doc.uploadedBy === 'plaintiff')} 
              onUpload={(doc) => handleDocumentUpload({...doc, uploadedBy: 'plaintiff'})} 
            />
          </Card>
          
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Defendant Documents
            </h2>
            <DocumentUpload 
              documents={documents.filter(doc => doc.uploadedBy === 'defendant')} 
              onUpload={(doc) => handleDocumentUpload({...doc, uploadedBy: 'defendant'})} 
            />
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleStartTrial}
            disabled={!canProceed || isSubmitting} 
            size="lg"
          >
            {isSubmitting ? 'Creating Case...' : 'Start Trial'}
            {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />}
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}