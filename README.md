# 🏢 Hierarchy App
The Hierarchy App is a take home challenge for a software engineer position at Gong.io.

Author: Thales Andrade
Email: thandrade88@gmail.com

## Project Overview

The Hierarchy App is a single-page application designed to visualize an organizational structure (hierarchy tree) by consuming test data from a Firebase backend. It features custom user authentication, session management using local storage, and protected routing.

This project was built with a focus on modern React practices, robust testing (Vitest/RTL), and clear separation of concerns using custom hooks and context providers.

## ✨ Key Features

  * **Custom Authentication:** Secure login using a custom `encode` utility that combines email and password via XOR encryption against a predefined "Poison Array."
  * **Organizational Hierarchy:** Displays complex user relationships (managers and reports) in an interactive, accessible tree structure (`role="tree"`).
  * **Protected Routing:** Utilizes a custom `ProtectedRoute` component and the `useAuth` hook to restrict access to the `/dashboard`.
  * **API Utility:** Includes dedicated modules for fetching and transforming raw user data into the expected hierarchy format.
  * **Session Persistence:** Maintains user session state using `localStorage`.
  * **State Management:** Centralized authentication state managed via the `AuthContext` and `AuthProvider`.

## 💻 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React** (TSX) | Core UI Library |
| **State/Hooks** | **React Context**, Custom Hooks (`useAuth`, `useLoginForm`) | Global state management and logic abstraction |
| **Routing** | **React Router DOM** | Client-side routing |
| **Styling** | **Tailwind CSS** (Inferred) | Utility-first CSS framework |
| **Testing** | **Vitest** and **React Testing Library (RTL)** | Unit and integration testing |
| **Data Source** | **Firebase** (Read-Only Test Data) | External API for user and secret data |

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

  * Node.js (LTS recommended)
  * npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/thandrade88/hierarchy-app.git
    cd hierarchy-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will be accessible at `http://localhost:5173` (or the port specified by your environment).

## 🔑 Usage & Test Credentials

### Data Source

The application fetches user data and authentication secrets from the following public read-only endpoints:

  * `https://gongfetest.firebaseio.com/secrets.json`
  * `https://gongfetest.firebaseio.com/users.json`

### Login

Since the application uses live test data, you must use credentials that are valid in the provided Firebase data structure.

| Email | Password | Role |
| :--- | :--- | :--- |
| `rick@gongfe.com` | `123456` | Example Manager |
| `morty@gongfe.com` | `123456` | Example Report |

Upon successful login, the application calculates and displays the organizational hierarchy tree.

## 🧪 Testing

The project includes comprehensive unit and integration tests using Vitest and React Testing Library to ensure the reliability of hooks, context, routing, and API utilities.

### Test Commands

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Key Test Coverage

| Module | Focus |
| :--- | :--- |
| **`AuthProvider.test.tsx`** | Initialization, `login` success/failure, `logout`, and `localStorage` persistence. |
| **`useAuth.test.tsx`** | Ensures correct context exposure and throws an error if used outside the `AuthProvider`. |
| **`useLoginForm.test.ts`** | Handles form state changes, validation, and delegates to the `login` function correctly. |
| **`api.test.ts`** | Mocks `fetch` to verify `getUserBySecret` and `fetchAllUsers` handle success, non-existent users, and network errors. |
| **`auth.test.ts`** | Unit tests the core `make32` padding/truncation and `encode` (XOR) encryption logic. |
| **`App.test.tsx`** | Integration test for the `ProtectedRoute` and overall routing logic based on the mock authentication state. |

## 📂 Project Structure

```
hierarchy-app/
├── public/
├── src/
│   ├── components/       # Reusable UI components (e.g., HierarchyItem, Avatar)
│   ├── context/          # Context definition (AuthContext, AuthProvider)
│   ├── hooks/            # Custom React hooks (useAuth, useLoginForm)
│   ├── pages/            # Main application pages (LoginPage, DashboardPage)
│   ├── types/            # TypeScript interface definitions (UserData, HierarchyUser)
│   ├── utils/            # Non-React utilities (api.ts, auth.ts, hierarchy.ts)
│   ├── __tests__/        # All test files (fully mocked environment)
│   ├── App.tsx           # Main routing component
│   └── main.tsx          # Application entry point
├── package.json
└── vite.config.ts
```

