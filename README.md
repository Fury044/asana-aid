# 🧘‍♂️ Asana Aid: Personalized Yoga for Wellness

Asana Aid is a premium, full-stack yoga application designed to bridge the gap between physical health goals and personalized digital guidance. Using a "Local-First" architecture for asana content and a cloud architecture for user progress, it provides a seamless, high-performance experience for practitioners of all levels.

![Asana Aid Dashboard](https://asana-aid-production.up.railway.app/preview.png) *(Placeholder: Replace with your screenshot link)*

## ✨ Key Features

*   **Custom Recommendation Engine**: Generates specialized routines based on medical conditions (Back Pain, Navel Correction, Stress, Posture, etc.).
*   **Premium Visual Guides**: High-quality GIF demonstrations for every pose, ensuring proper form and safety.
*   **Local-First Architecture**: Yoga poses, instructions, and media are served from a high-performance backend library, ensuring 100% media reliability and speed.
*   **Progress Tracking**: Cloud-synced streaks, session logs, and health profiles.
*   **Modern Design**: Sleek "Glassmorphism" UI built with Tailwind CSS v4 and Motion (Framer Motion) for a fluid, premium feel.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Deployment**: Netlify

### Backend
- **Server**: Node.js + Express
- **Logic**: TypeScript
- **Database**: PostgreSQL (Managed on Railway)
- **ORM/Query**: Direct SQL with `pg` for maximum performance

## 🚀 Getting Started

### Prerequisites
*   Node.js (v20+)
*   PostgreSQL Instance

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Fury044/asana-aid.git
    cd asana-aid
    ```

2.  **Install Frontend Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Backend**:
    ```bash
    cd asana-aid-backend
    npm install
    ```

4.  **Environment Variables**:
    Create a `.env` in `asana-aid-backend`:
    ```env
    PORT=5000
    DATABASE_URL=your_postgres_url
    JWT_SECRET=your_secret_key
    ```

5.  **Initialize Database**:
    ```bash
    npx tsx migrate.js
    ```

6.  **Run with Local-Dev**:
    ```bash
    # Run Backend (from asana-aid-backend)
    npm run dev
    
    # Run Frontend (from root)
    npm run dev
    ```

## 📦 Deployment

*   **Frontend**: Configured for Netlify via `netlify.toml`.
*   **Backend**: Production-ready for Railway with automated migrations/seeding.

## 📄 License
MIT License - Created for professional wellness development.