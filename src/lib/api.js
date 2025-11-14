// Mock API for frontend demo - Replace with actual backend calls
const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

const mockCases = []
const mockArguments = []
const mockDocuments = []
const mockVerdicts = []

export const api = {
  cases: {
    async create(caseData) {
      await mockDelay(500)
      const newCase = {
        _id: Date.now().toString(),
        ...caseData,
        currentRound: 1,
        maxRounds: 5,
        status: 'setup',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockCases.push(newCase)
      return { success: true, data: newCase }
    },

    async getById(id) {
      await mockDelay(300)
      const caseData = mockCases.find(c => c._id === id)
      return caseData ? { success: true, data: caseData } : { success: false, error: 'Case not found' }
    },

    async update(id, updateData) {
      await mockDelay(300)
      const caseIndex = mockCases.findIndex(c => c._id === id)
      if (caseIndex !== -1) {
        mockCases[caseIndex] = { ...mockCases[caseIndex], ...updateData, updatedAt: new Date() }
        return { success: true, data: mockCases[caseIndex] }
      }
      return { success: false, error: 'Case not found' }
    }
  },

  arguments: {
    async create(argumentData) {
      await mockDelay(500)
      const newArgument = {
        _id: Date.now().toString(),
        ...argumentData,
        timestamp: new Date(),
        createdAt: new Date()
      }
      mockArguments.push(newArgument)
      return { success: true, data: newArgument }
    },

    async getByCaseId(caseId) {
      await mockDelay(300)
      const caseArguments = mockArguments.filter(arg => arg.caseId === caseId)
      return { success: true, data: caseArguments }
    }
  },

  documents: {
    async getByCaseId(caseId) {
      await mockDelay(300)
      const caseDocuments = mockDocuments.filter(doc => doc.caseId === caseId)
      return { success: true, data: caseDocuments }
    }
  },

  verdicts: {
    async getByCaseId(caseId) {
      await mockDelay(300)
      const verdict = mockVerdicts.find(v => v.caseId === caseId)
      return verdict ? { success: true, data: verdict } : { success: false, error: 'Verdict not found' }
    }
  },

  aiJudge: {
    async generateInitial(caseId) {
      await mockDelay(2000)
      const mockVerdict = {
        _id: Date.now().toString(),
        caseId,
        winner: 'Plaintiff',
        reasoning: 'Based on preliminary review of the case documents and pleadings, the Court has formed an initial assessment. This preliminary view is subject to change based on oral arguments and evidence presentation.',
        isInitial: true,
        confidence: 0.4
      }
      mockVerdicts.push(mockVerdict)
      return { success: true, data: mockVerdict }
    },

    async respond(caseId) {
      await mockDelay(3000)
      const mockResponse = {
        _id: Date.now().toString(),
        caseId,
        partyId: 'judge',
        partyName: 'AI Judge',
        content: '**COURT OBSERVES - CURRENT ROUND ANALYSIS:**\n\nThe Court has carefully reviewed the arguments presented by both parties. The legal issues center around contract interpretation and breach of terms.\n\n**LEGAL ANALYSIS UNDER INDIAN LAW:**\n\nUnder Section 73 of the Indian Contract Act, 1872, the aggrieved party is entitled to compensation for damages arising from breach of contract.\n\n**JUDICIAL QUESTIONS FOR CONSIDERATION:**\n\n1. What specific evidence supports the claim of breach?\n2. How does the defendant justify their actions under the contract terms?\n3. What damages can be proven with documentary evidence?',
        round: 1,
        timestamp: new Date()
      }
      mockArguments.push(mockResponse)
      return { success: true, data: mockResponse }
    },

    async generateVerdict(caseId) {
      await mockDelay(4000)
      const mockFinalVerdict = {
        _id: Date.now().toString(),
        caseId,
        winner: 'Plaintiff',
        reasoning: 'After comprehensive review of all arguments and evidence presented, the Court finds in favor of the Plaintiff based on strong legal arguments and supporting evidence.',
        keyPoints: [
          'Plaintiff presented compelling legal arguments',
          'Evidence supported the plaintiff\'s position',
          'Defendant failed to provide adequate defense'
        ],
        damages: 75000,
        confidence: 0.85,
        legalCitations: ['Section 73 - Indian Contract Act 1872'],
        appliedStatutes: ['Indian Contract Act'],
        operativeDecision: {
          winner: 'Plaintiff',
          ruling: 'Judgment in favor of Plaintiff'
        },
        finalOrder: [
          'Defendant is directed to pay damages',
          'Case is disposed of with costs'
        ],
        isFinal: true
      }
      mockVerdicts.push(mockFinalVerdict)
      return { success: true, data: mockFinalVerdict }
    }
  }
}