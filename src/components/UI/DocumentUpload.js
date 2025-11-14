import { Upload, FileText, X } from 'lucide-react'
import { useState } from 'react'
import { formatFileSize } from '@/lib/utils'

export default function DocumentUpload({ onUpload, documents = [] }) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files) => {
    if (!files || !onUpload) return
    
    Array.from(files).forEach(file => {
      if (file && file.name) {
        onUpload({
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type || 'unknown',
          size: file.size || 0,
          file
        })
      }
    })
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive ? 'border-legal-teal bg-teal-50' : 'border-gray-300 hover:border-legal-teal'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          try {
            const input = document.getElementById('file-upload')
            if (input) input.click()
          } catch (error) {
            console.error('Error opening file dialog:', error)
          }
        }}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2 flex-shrink-0" />
        <p className="text-sm text-gray-600">Drop files here or click to upload</p>
        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, Images</p>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => {
            try {
              if (e.target.files) handleFiles(e.target.files)
            } catch (error) {
              console.error('Error handling file selection:', error)
            }
          }}
          className="hidden"
        />
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-legal-slate flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(doc.size)}</div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500">
                <X className="h-4 w-4 flex-shrink-0" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}