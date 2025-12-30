# Travian Legends Lobby

A React-based implementation of the Travian Legends game lobby interface. This application provides user authentication, gameworld browsing, news display, and account management functionality.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Build](#build)
- [Architecture](#architecture)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Internationalization](#internationalization)
- [Components](#components)
- [Utilities](#utilities)
- [License](#license)

## Overview

This project is a modern React implementation of the Travian Legends game lobby. It serves as the entry point for players to manage their accounts, browse available gameworlds, read news, and join games. The application is built with TypeScript for type safety and uses React Router for client-side navigation.

## Features

- User authentication (login, registration, password recovery)
- Social login integration (Google, Facebook, Apple)
- Gameworld calendar with upcoming server listings
- News feed with article previews
- Multi-language support with RTL language handling
- Responsive design for desktop and mobile devices
- PKCE-based OAuth2 authentication flow
- Session management and account settings

## Technology Stack

- React 18.3
- TypeScript 5.7
- React Router 7.11
- Vite 6.0 (build tool)
- CSS (custom styling)

## Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Reusable UI components (Button, SVGIcon)
│   ├── Footer/          # Footer components
│   ├── Header/          # Header and navigation components
│   ├── MainContent/     # Main content area components
│   │   └── CTA/         # Call-to-action components (NewsPreview, CalendarPreview)
│   └── Modal/           # Modal dialogs (Login, Registration, etc.)
├── config/              # Application configuration
├── data/                # Static data (locales)
├── hooks/               # Custom React hooks
├── localization/        # Internationalization (i18n)
├── pages/               # Page components
├── services/            # API service modules
├── styles/              # CSS stylesheets
│   ├── base/           # Base styles and variables
│   ├── components/     # Component-specific styles
│   ├── layout/         # Layout styles
│   └── views/          # Page-specific styles
└── utils/               # Utility functions
```

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd travian-lobby
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see Configuration section)

4. Start the development server:
```bash
npm run dev
```

## Configuration

The application requires configuration for API endpoints and third-party integrations. Configuration is managed through the global `Config` object.

### Required Configuration

Create or modify `src/config/config.ts`:

```typescript
export const config = {
  lobby: {
    host: 'https://lobby.example.com'
  },
  identity: {
    host: 'https://identity.example.com',
    client_id: 'your-client-id'
  },
  google: {
    client_id: 'your-google-client-id'
  },
  facebook: {
    client_id: 'your-facebook-app-id'
  },
  apple: {
    client_id: 'your-apple-client-id'
  },
  captcha: {
    v2: 'your-recaptcha-v2-site-key',
    v3: 'your-recaptcha-v3-site-key'
  }
};
```

### Global Config Object

The application expects a global `Config` object to be available on the `window` object. This is typically injected by the server or set in the HTML template.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Development Server

The development server runs on `http://localhost:5173` by default. It supports hot module replacement (HMR) for rapid development.

## Build

To create a production build:

```bash
npm run build
```

The build output will be in the `dist/` directory. The build process:
1. Runs TypeScript compilation
2. Bundles and optimizes assets with Vite
3. Generates static files ready for deployment

## Architecture

### Component Architecture

The application follows a component-based architecture with clear separation of concerns:

- **Pages**: Top-level route components
- **Components**: Reusable UI elements
- **Hooks**: Custom React hooks for shared logic
- **Services**: API communication layer
- **Utils**: Pure utility functions

### State Management

State is managed through:
- React Context for global state (authentication, i18n)
- Local component state for UI-specific state
- URL parameters for navigation state

### Routing

React Router handles client-side routing with the following structure:
- `/:locale` - Locale-prefixed routes
- `/:locale/news` - News listing
- `/:locale/news/:year/:month/:day/:slug` - News article
- `/:locale/calendar` - Gameworld calendar
- `/:locale/game-rules` - Game rules
- `/:locale/imprint` - Legal information

## API Integration

### Services

The application communicates with two main API endpoints:

#### Identity Service (`src/services/identity.ts`)

Handles authentication operations:
- `register(email, options)` - Register new account
- `authenticateLogin(login, password)` - Email/password login
- `authenticateProvider(provider, data)` - Social login
- `activate(code, options)` - Account activation
- `resendActivationEmail(code)` - Resend activation

#### Lobby Service (`src/services/lobby.ts`)

Handles game-related operations:
- `authorize(code, codeVerifier)` - Exchange auth code for session
- `getCalendar()` - Get gameworld calendar
- `getNews(after, amount)` - Get news articles
- `getMetadata()` - Get lobby metadata
- `playAvatar(uuid)` - Play existing avatar
- `registerAvatar(wuid, adCode, invitedBy, registrationKey)` - Register new avatar
- `graphql(query)` - Execute GraphQL queries

### Authentication Flow

The application uses PKCE (Proof Key for Code Exchange) for secure OAuth2 authentication:

1. Generate code verifier and challenge
2. Send authentication request with challenge
3. Receive authorization code
4. Exchange code + verifier for session

## Authentication

### Login Methods

1. **Email/Password**: Traditional login with email and password
2. **Google**: OAuth2 login via Google Identity Services
3. **Facebook**: OAuth2 login via Facebook SDK
4. **Apple**: Sign in with Apple

### Session Management

Sessions are managed through HTTP-only cookies set by the lobby API. The `useAuth` hook provides:
- `account` - Current user account info
- `refreshSession()` - Refresh session state
- `logout()` - End session

## Internationalization

### Supported Languages

The application supports 40+ locales including RTL languages (Arabic, Hebrew).

### Usage

```typescript
import { useI18n } from '../localization/i18n';

const Component = () => {
  const { translate, locale } = useI18n();
  return <div>{translate('Welcome')}</div>;
};
```

### Translation Keys

Translations are loaded dynamically based on the current locale. The `translate` function supports parameter interpolation:

```typescript
translate('Hello {name}', { name: 'Player' })
```

## Components

### Common Components

#### Button

A versatile button component matching the original implementation:

```typescript
<Button
  appearance="green"        // green, gold, etc.
  secondaryButton={false}   // Primary or secondary style
  iconButton={false}        // Icon-only button
  withLoadingIndicator      // Show loading state
  isLoading={false}         // Loading state
  href="/path"              // Navigate on click
  onClick={handler}         // Click handler
>
  Button Text
</Button>
```

#### SVGIcon

Wrapper for SVG icons with outline support:

```typescript
<SVGIcon viewBox="0 0 20 20" outline>
  <path d="..." />
</SVGIcon>
```

### Modal Components

- **LoginModal**: User login form
- **RegistrationModal**: New account registration
- **PasswordRecoveryModal**: Password reset flow
- **CalendarGameworldModal**: Gameworld details and join flow
- **SocialLoginBlock**: Social login buttons

### Page Components

- **HomePage**: Main landing page with news and calendar previews
- **NewsPage**: News article listing
- **NewsArticlePage**: Individual news article
- **CalendarPage**: Gameworld calendar
- **GameRulesPage**: Game rules display
- **ImprintPage**: Legal information

## Utilities

### FormValidator

Client-side form validation utility:

```typescript
const validator = new FormValidator(formRef);
validator.attach();
validator.validateForm();
if (validator.formValid) {
  // Submit form
}
```

Validation rules:
- `NOT_EMPTY` - Field must have value
- `IS_EMAIL` - Valid email format
- `AT_LEAST` - Minimum length
- `SHORTER_THAN` - Maximum length
- `CHECKED` - Checkbox must be checked

### DateFormatter

Date formatting utilities with timezone support:

```typescript
// Base formatter
const formatter = new DateFormatter(timestamp, locale, timezone);
formatter.getDateTime();      // Full date and time
formatter.getDateTimeShort(); // Date and time without seconds
formatter.getDate();          // Date only

// UTC formatter (Europe/London timezone)
const utcFormatter = new UTCDateFormatter(timestamp, locale);

// Gameworld start formatter (hides midnight times)
const gwFormatter = new GameworldStartDateFormatter(timestamp, locale);
```

### Crypto Utilities

PKCE and encoding utilities:

```typescript
import { generatePKCE, generateRandomString, base64UrlEncode } from './crypto';

const { code_verifier, code_challenge, code_challenge_method } = await generatePKCE();
```

### Navigation

Custom navigation hook preserving query parameters:

```typescript
const navigate = useNavigateWithParams();
navigate('/path'); // Preserves server, uc, ad params
```

## Custom Hooks

### useAuth

Authentication state and actions:

```typescript
const { account, refreshSession, logout } = useAuth();
```

### usePlayFlow

Handles gameworld join flow after authentication:

```typescript
const playFlow = usePlayFlow();
await playFlow(searchParams);
```

### useLatestNews

Fetches latest news article:

```typescript
const { news, loading, error } = useLatestNews();
```

### useNextGameworld

Fetches next upcoming gameworld:

```typescript
const { nextGameworld, loading, error } = useNextGameworld();
```