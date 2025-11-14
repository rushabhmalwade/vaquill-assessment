import { Scale, Download, Share } from 'lucide-react'
import Button from './Button'
import Card from './Card'

export default function VerdictDisplay({ verdict, onDownload, onShare }) {
  if (!verdict) return null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="text-center mb-6">
        <Scale className="h-16 w-16 text-legal-navy mx-auto mb-4 flex-shrink-0" />
        <h1 className="text-3xl font-bold text-legal-navy mb-2">Final Verdict</h1>
        <p className="text-legal-slate">AI Judge Decision</p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Decision</h2>
        <div className={`p-4 rounded-lg border-l-4 ${
          verdict.winner === 'plaintiff' 
            ? 'bg-blue-50 border-blue-500' 
            : 'bg-green-50 border-green-500'
        }`}>
          <p className="font-medium text-gray-900">
            Ruling in favor of: <span className="capitalize">{verdict.winner}</span>
          </p>
          {verdict.damages && (
            <p className="text-gray-700 mt-1">
              Damages awarded: ${verdict.damages.toLocaleString()}
            </p>
          )}
          {verdict.confidence && (
            <p className="text-gray-600 mt-2 text-sm">
              Confidence Level: {(verdict.confidence * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reasoning</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{verdict.reasoning}</p>
        </div>
      </Card>

      {verdict.keyPoints && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Legal Findings</h2>
          <ul className="space-y-2">
            {verdict.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-legal-teal font-bold">•</span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      
      {verdict.legalCitations && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal Citations</h2>
          <div className="space-y-2">
            {verdict.legalCitations.map((citation, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-mono text-sm text-blue-800">{citation}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {verdict.appliedStatutes && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Applied Legal Statutes</h2>
          <div className="flex flex-wrap gap-2">
            {verdict.appliedStatutes.map((statute, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {statute}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-center space-x-4 mb-8">
        <Button onClick={onDownload} variant="outline">
          <Download className="h-4 w-4 mr-2 flex-shrink-0" />
          Download PDF
        </Button>
        <Button onClick={onShare} variant="secondary">
          <Share className="h-4 w-4 mr-2 flex-shrink-0" />
          Share Results
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          This simulation is for educational purposes only and does not constitute legal advice.
        </p>
      </div>
    </div>
  )
}