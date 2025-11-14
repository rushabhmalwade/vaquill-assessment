import './globals.css'

export const metadata = {
  title: 'Vaquill - AI Judge Legal Simulation',
  description: 'AI-powered legal mock trial simulator making complex legal argumentation accessible',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}