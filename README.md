# Vaquill - AI Judge Legal Simulation Platform (Frontend)

An AI-powered legal mock trial simulator that makes complex legal argumentation intuitive, transparent, and accessible.

## 🚀 Features

- **Virtual Courtroom Interface**: Professional three-panel courtroom layout
- **Progressive Legal Analysis**: Round-based argument system with AI judge responses
- **Evidence Management**: Document upload and analysis system
- **Responsive Design**: Mobile-friendly legal-focused styling
- **Mock Trial Simulation**: Complete legal proceeding simulation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Icons**: Lucide React
- **Styling**: Custom legal theme with professional gradients

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd vaquill-frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── case-setup/   # Case setup page
│   ├── case/         # Case viewing page
│   ├── trial/        # Trial interface
│   ├── verdict/      # Verdict display
│   └── page.js       # Home page
├── components/       # Reusable UI components
│   └── UI/           # UI components
└── lib/              # Utility functions
    ├── api.js        # Mock API functions
    └── utils.js      # Helper functions
```

## 🎯 Usage

1. **Case Setup**: Create a new case with parties and documents
2. **Trial Simulation**: Engage in structured arguments across multiple rounds
3. **AI Judge Responses**: Receive detailed legal analysis and guidance
4. **Final Verdict**: Get comprehensive judgment with legal reasoning

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Note

This is a frontend-only demo version with mock API responses. For full functionality, integrate with a backend API that provides:
- Case management
- Document processing
- AI judge responses
- Verdict generation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.