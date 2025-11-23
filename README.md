# Heritage Naver - Frontend

React + Vite frontend application for Vietnamese historical heritage sites exploration with AI-powered chatbot.

## 🚀 Features

- **Heritage Discovery**: Browse and search Vietnamese historical sites
- **Interactive Map**: Google Maps integration for heritage locations
- **AI Chatbot**: Real-time RAG-powered chatbot for heritage Q&A
- **User System**: Authentication, favorites, reviews
- **Knowledge Tests**: Interactive quizzes about heritage sites
- **Leaderboard**: Competitive ranking system
- **Real-time Chat**: Socket.io for live discussions

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Maps**: @react-google-maps/api
- **Real-time**: Socket.io-client
- **Forms**: React Hook Form
- **HTTP Client**: RTK Query
- **UI Components**: Radix UI, Lucide Icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8017
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_SOCKET_URL=http://localhost:8017
```

## 🏃 Running the App

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── api/            # API integration & socket
├── assets/         # Static assets
├── components/     # Reusable components
│   ├── common/     # Shared UI components
│   ├── Footer/
│   ├── NavBar/
│   ├── Heritage/
│   └── Home/
├── config/         # Configuration files
├── constants/      # App constants
├── hooks/          # Custom React hooks
├── layout/         # Layout components
├── pages/          # Page components
│   ├── Admin/
│   ├── ChatHeritagePage/
│   ├── HeritageDetail/
│   └── GoogleMapHeritage/
├── routes/         # Route definitions
├── store/          # Redux store & slices
│   ├── apis/       # RTK Query APIs
│   └── slices/     # Redux slices
└── utils/          # Utility functions
```

## 🔗 Related Repositories

- **Backend API**: [heritage-naver-api](https://github.com/phanvanthuan06052004/heritage-naver-api)
- **ML Classifier**: [train-model-classifier](https://github.com/th4nh-phat09/Model_Classifier)

## Key Features

1. **Heritage Exploration**

   - View heritage list and details
   - Interactive Google Maps integration
   - Search nearby heritage sites
   - View detailed information and images

2. **User Features**

   - Take knowledge tests
   - View personal rankings
   - Rate and review heritage sites
   - Ask and answer questions about heritage sites

3. **Admin Features**
   - User management
   - Heritage site management
   - Quiz management

## Getting Started

1. **Installation**

```bash
npm install
```

2. **Development**

```bash
npm run dev
```

## Environment Variables (.env)

```env
APP_BACKEND_URL=http://localhost:8017
```

### 🌐 Deployed Link

[👉 Truy cập website tại đây](https://heritage.thuandev.id.vn)

## License

This project is licensed under the MIT License.
