'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '1rem' 
            }}>
              Application Error
            </h1>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              A critical error occurred. Please refresh the page or try again later.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '12px'
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}