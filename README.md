# A.I.D.A. - AI-Powered Instructional District Assistant

[![Convex](https://img.shields.io/badge/Backend-Convex-00D4AA?style=flat&logo=convex)](https://convex.dev)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat&logo=vite)](https://vitejs.dev)

> **Your Voice-Powered Educational Command Center**

A.I.D.A. is a voice-enabled, context-aware AI assistant designed to solve the critical problem of information overload faced by K-12 educators. It provides district-specific knowledge and intelligent instructional feedback through natural voice interactions.

## 🎯 Problem & Solution

**The Problem:** K-12 educators face perpetual information overload, navigating a constant deluge of district policies, curriculum guides, and professional development materials without a centralized, intelligent system to synthesize this information.

**The Solution:** A.I.D.A. provides instant access to district-specific information and personalized instructional feedback through voice-enabled AI that understands educational context and needs.

## ✨ Key Features

- 🎤 **Voice-Enabled District Assistant** - Real-time, hands-free interaction with district-specific knowledge
- 📚 **AI-Powered Instructional Feedback** - Intelligent analysis and suggestions for lesson plans
- 🏫 **Hyper-Contextualization** - District-specific knowledge that general-purpose tools cannot provide
- 🔒 **FERPA Compliance** - Self-hosted architecture with complete data ownership
- 🚀 **Integrated Command Center** - Cohesive workflow vs. fragmented single-purpose tools

## 🏗️ Technology Stack

### Frontend
- **React + TypeScript** - Modern, type-safe UI development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Vapi** - Real-time voice AI platform

### Backend
- **Convex** - Real-time database and serverless functions
- **OpenAI GPT-4o-mini** - AI reasoning and generation
- **Firecrawl** - District document scraping and processing
- **Better Auth** - Enterprise-grade, self-hosted authentication

### AI & Data
- **Convex RAG Component** - Document processing and intelligent search
- **Convex Resend Component** - Reliable email delivery
- **Convex Autumn Component** - Subscription and payment management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Convex account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/aida.git
   cd aida
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```bash
   # Vapi Configuration (Required for voice chat)
   VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
   
   # Convex Configuration (Required)
   VITE_CONVEX_URL=your_convex_url_here
   
   # OpenAI Configuration (Required for AI responses)
   CONVEX_OPENAI_API_KEY=your_openai_api_key_here
   CONVEX_OPENAI_BASE_URL=https://api.openai.com/v1
   
   # Other API Keys (Optional)
   FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   ```
   
   **Getting your API keys:**
   - **Vapi**: Sign up at [vapi.ai](https://vapi.ai) and get your public key from the dashboard
   - **Convex**: Run `npx convex dev` and follow the setup instructions
   - **OpenAI**: Get your API key from [platform.openai.com](https://platform.openai.com)
   - **Firecrawl**: Get your API key from [firecrawl.dev](https://firecrawl.dev) (optional)

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
aida/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── lib/               # Shared utilities and helpers
│   └── main.tsx           # Application entry point
├── convex/                # Backend Convex functions
│   ├── auth.config.ts     # Better Auth configuration
│   ├── chat.ts           # Voice conversation handling
│   ├── documents.ts      # Document management
│   ├── feedback.ts       # Lesson plan feedback system
│   └── schema.ts         # Database schema definitions
├── context/              # Project documentation
│   ├── project-guide.md  # Business strategy & planning
│   ├── technical-guide.md # Technical framework
│   ├── marketing-guide.md # Marketing & brand strategy
│   └── mvp_prd.md        # Product requirements
└── README.md             # This file
```

## 🎯 Target Users

- **K-12 Educators** - Primary users seeking quick access to district information
- **District Administrators** - B2B decision makers focused on teacher efficiency
- **Curriculum Coordinators** - Users needing curriculum guidance and support
- **New Teachers** - Early-career educators requiring policy clarification

## 📊 Performance Requirements

- **Voice Response Time:** <2s for voice queries
- **Load Time:** <3s for dashboard, <1s for cached content
- **API Response:** <500ms for standard queries
- **Uptime:** 99.9% availability target
- **Scalability:** Support 1000+ concurrent users

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run convex:dev` - Start Convex development server
- `npm run convex:deploy` - Deploy to Convex production

### Code Quality

- **TypeScript** - Strict mode enabled
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks

## 📚 Documentation

Comprehensive documentation is available in the `context/` directory:

- **[Project Guide](context/project-guide.md)** - Business strategy, personas, roadmap
- **[Technical Guide](context/technical-guide.md)** - Architecture, implementation, performance
- **[Marketing Guide](context/marketing-guide.md)** - Brand, messaging, go-to-market
- **[MVP PRD](context/mvp_prd.md)** - Product requirements and specifications

## 🚀 Deployment

### Convex Backend
This project is connected to the Convex deployment [`kindly-setter-935`](https://dashboard.convex.dev/d/kindly-setter-935).

### Production Deployment
1. Deploy Convex backend: `npm run convex:deploy`
2. Deploy frontend to Vercel: `vercel --prod`
3. Configure environment variables in production
4. Set up monitoring and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Convex](https://convex.dev) for the real-time backend platform
- [Vapi](https://vapi.ai) for voice AI capabilities
- [OpenAI](https://openai.com) for AI reasoning and generation
- [Firecrawl](https://firecrawl.dev) for document processing
- [Better Auth](https://better-auth.com) for authentication
- [Autumn](https://useautumn.com) for billing and subscriptions

---

**Built with ❤️ for educators everywhere**

*For detailed project information, see [context/README.md](context/README.md)*