# Repurposer Frontend

This is the frontend application for the Repurposer project, built with Next.js and designed to provide a user-friendly interface for generating repurposed content from audio transcripts.

## Features

*   **User Authentication**: Secure login and registration.
*   **Transcript Input**: Allows users to input audio transcripts.
*   **Content Generation Options**: Users can specify tone, format (e.g., Twitter, LinkedIn, Blog), and other parameters for content generation.
*   **Real-time Feedback**: Provides loading indicators and status updates during content generation.
*   **Display Generated Content**: Presents the generated content (title, keywords, various platform-specific outputs) in an organized manner.
*   **Responsive UI**: Designed to work across various devices.

## Getting Started

Follow these steps to set up and run the frontend application locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Access to the Repurposer Backend API

### Installation

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone <repository-url>
    cd repurposer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

Replace `http://localhost:5000/api` with the actual URL of your Repurposer Backend API.

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
repurposer/
├── public/                 # Static assets (images, fonts)
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Next.js pages and API routes
│   │   ├── api/            # Backend API routes (if any, for Next.js API)
│   │   └── index.tsx       # Main application page
│   └── styles/             # Global styles
├── .env.local              # Environment variables
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This README file
```

## Technologies Used

*   **Next.js**: React framework for production.
*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Superset of JavaScript that adds static typing.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Axios**: Promise-based HTTP client for the browser and Node.js.
*   **React Hook Form**: For flexible and extensible forms.
*   **Zod**: TypeScript-first schema declaration and validation library.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.
