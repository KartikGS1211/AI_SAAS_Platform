#  Nurox.ai - AI SaaS Platform

Nurox.ai is a comprehensive, full-stack AI-powered SaaS platform that brings multiple AI functionalities under one roof. Designed with a modern, sleek user interface and robust backend architecture, Nurox allows users to generate text, images, modify images, and even review resumes effortlessly. 

The application features a freemium model with secure authentication, seamless payment gateways, and highly optimized AI integrations.

---

##  Features

-  **AI Article Writer**: Generate detailed and engaging articles with AI.
-  **AI Blog Title Generator**: Instantly get catchy blog titles based on your niche.
-  **Text-to-Image Generation**: Create stunning images from text prompts using Clipdrop APIs.
-  **Image Background Removal**: Automatically remove backgrounds from images with high precision (powered by Cloudinary).
-  **Object Removal from Images**: Effortlessly erase unwanted objects from your photos.
-  **Smart Resume Reviewer**: Upload your PDF resume and receive intelligent, AI-driven feedback to improve your profile.
-  **Authentication & User Management**: Secure login and user management via **Clerk**.
-  **Subscription System**: Built-in tiered free & premium plan validation using an SQL database.

---

##  Tech Stack

### **Frontend (Client)**
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Clerk React (`@clerk/clerk-react`)
- **HTTP Client**: Axios

### **Backend (Server)**
- **Runtime**: Node.js + Express.js
- **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- **Authentication**: Clerk Express (`@clerk/express`)
- **AI Models**: Llama 3 (via Groq SDK config) & Clipdrop API
- **Image Processing/Storage**: Cloudinary & Multer
- **File Parsing**: PDF-Parse (for Resume Reviews)

---

##  Project Structure

```text
Nurox.ai/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, Sidebar, etc.)
│   │   ├── pages/          # Pages (Dashboard, Tools, Settings)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Express Backend
    ├── configs/            # Database & other configurations
    ├── controllers/        # Route Handlers (aiController, userController)
    ├── routes/             # API Routes
    ├── server.js           # Entry point
    └── package.json
```

---

##  Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- Accounts setup for: [Clerk](https://clerk.com/), [Neon Database](https://neon.tech/), [Cloudinary](https://cloudinary.com/), [Groq](https://console.groq.com/), and [Clipdrop](https://clipdrop.co/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Nurox.ai.git
cd Nurox.ai
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your keys:
```env
PORT=5000
DATABASE_URL=your_neon_postgres_database_url
GROQ_API_KEY=your_groq_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLERK_SECRET_KEY=your_clerk_secret_key
```

Run the backend server:
```bash
npm run server
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory and add:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

Run the frontend development server:
```bash
npm run dev
```

### 4. Open the App Let's create!
Head over to `http://localhost:5173` in your browser.

---

##  Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

##  License
This project is licensed under the ISC License.
