# GuardianEye Frontend

Welcome to the GuardianEye frontend project! This project is built using React and TypeScript, and it serves as the client-side application for the GuardianEye system.

## Project Structure

The project is organized as follows:

```
guardian-eye-frontend
├── public
│   └── favicon.svg          # Favicon for the application
├── src
│   ├── app
│   │   └── App.tsx          # Main application component
│   ├── assets
│   │   └── styles
│   │       └── globals.css  # Global CSS styles
│   ├── components
│   │   ├── common
│   │   │   └── index.ts     # Common components
│   │   └── layout
│   │       └── index.ts     # Layout components
│   ├── features
│   │   └── dashboard
│   │       └── index.ts     # Dashboard feature components
│   ├── hooks
│   │   └── useAuth.ts       # Custom hook for authentication
│   ├── lib
│   │   └── api.ts           # API utility functions
│   ├── pages
│   │   └── HomePage.tsx     # Main page component
│   ├── services
│   │   └── api.ts           # Service functions for API interaction
│   ├── store
│   │   └── index.ts         # State management store setup
│   ├── types
│   │   └── index.ts         # TypeScript types and interfaces
│   ├── main.tsx             # Entry point of the application
│   └── vite-env.d.ts        # TypeScript definitions for Vite
├── .gitignore                # Git ignore file
├── index.html                # Main HTML file
├── package.json              # NPM configuration file
├── tsconfig.json             # TypeScript configuration file
├── tsconfig.node.json        # Node.js specific TypeScript configuration
├── vite.config.ts            # Vite configuration file
├── README.md                 # Project documentation
└── eslint.config.js          # ESLint configuration file
```

## Getting Started

To get started with the GuardianEye frontend, follow these steps:

1. **Clone the repository:**
   ```
   git clone https://github.com/keshoreg06-beep/GuardianEye.git
   cd GuardianEye/guardian-eye-frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Features

- **Responsive Design:** The application is designed to be responsive and user-friendly.
- **Authentication:** Custom hooks for managing authentication state.
- **Dashboard:** A dedicated feature for dashboard components and logic.
- **API Integration:** Utility functions and services for seamless API interaction.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.