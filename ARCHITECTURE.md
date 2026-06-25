# CK Frontends Architecture

This document provides a comprehensive overview of the Credit Key Frontends architecture, including system design, technology stack, application structure, and key architectural decisions.

## Table of Contents

- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Monorepo Structure](#monorepo-structure)
- [Application Architecture](#application-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [Routing & Middleware](#routing--middleware)
- [State Management](#state-management)
- [Data Flow & API Integration](#data-flow--api-integration)
- [Styling System](#styling-system)
- [Testing Strategy](#testing-strategy)
- [Development Workflow](#development-workflow)
- [Deployment Architecture](#deployment-architecture)
- [Key Architectural Decisions](#key-architectural-decisions)

## System Overview

CK Frontends is a Next.js-based monorepo that consolidates all Credit Key frontend applications and shared components into a single, version-controlled repository. The system provides a unified platform for multiple user-facing applications while maintaining code reusability and consistency.

### Core Applications

The monorepo houses the following applications:

1. **Borrower Portal** (`/apps/borrower`, `/pages/borrower`) - Customer-facing application for managing credit accounts, including orders, payment methods, virtual cards, and CK Plus subscriptions
2. **TPS Reporting Dashboard** (`/apps/reports`, `/pages/reports`) - Internal reporting interface (currently not in use)
3. **Admin Dashboard** (`/pages/admin.tsx`) - Internal administrative interface (single-page application)
4. **Merchant Instore Portal** (routed via middleware) - In-store order management for merchants
5. **Demo Checkout** (routed via middleware) - Demonstration e-commerce experience

### Design Principles

- **Monorepo Architecture**: Single repository for all frontend applications
- **Component Reusability**: Shared components library across applications
- **Single Sign-On (SSO)**: Unified authentication across all applications
- **Feature-based Organization**: Code organized by features rather than technical layers
- **Type Safety**: TypeScript for enhanced developer experience and code quality
- **Mobile-First Responsive Design**: Tailwind CSS for consistent, responsive UI

## Technology Stack

### Core Framework & Language

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | ^16.2.6 | React framework with SSR/SSG capabilities |
| React | 18.3.1 | UI library for building components |
| TypeScript | 5.4.5 | Type-safe JavaScript development |
| Node.js | 22.22.3 | Runtime environment |

### UI & Styling

| Technology | Version | Purpose |
|-----------|---------|---------|
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| SASS | 1.82.0 | CSS preprocessor for custom styles |
| Radix UI | Various | Headless UI components |
| Headless UI | 2.1.2 | Unstyled accessible components |
| FontAwesome Pro | 6.5.2 | Icon library |

### State Management & Data Fetching

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Context API | - | Global state management |
| TanStack React Query | 5.37.1 | Server state management & caching |
| Axios | 1.7.2 | HTTP client for API requests |
| Formik | 2.4.6 | Form state management |

### Authentication & Authorization

| Technology | Version | Purpose |
|-----------|---------|---------|
| SuperTokens | 0.41.1 | SSO authentication framework |

### Search & Data

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Instantsearch | 7.11.1 | Search UI components |
| Typesense Adapter | 2.8.0 | Search engine integration |
| TanStack React Table | 8.20.5 | Table component library |

### Development & Testing

| Technology | Version | Purpose |
|-----------|---------|---------|
| Jest | 29.7.0 | Testing framework |
| React Testing Library | 16.0.0 | Component testing utilities |
| MSW | 2.3.5 | API mocking for tests |
| ESLint | 9.39.2 | Code linting |
| Prettier | 3.8.0 | Code formatting |

### Monitoring & Analytics

| Technology | Purpose |
|-----------|---------|
| FullStory | Session replay and analytics |
| Rollbar | Error tracking and monitoring |
| Customer.io CDP | Customer data platform |
| PostHog | Product analytics & NPS person targeting (borrower portal) |

## Monorepo Structure

The repository follows a feature-based monorepo structure with clear separation between application-specific and shared code:

```
ck-frontends/
├── apps/                          # Application-specific code
│   ├── borrower/                 # Borrower Portal components & logic
│   │   ├── components/          # App-specific components
│   │   ├── hooks/               # App-specific hooks
│   │   └── lib/                 # App-specific utilities
│   └── reports/                 # TPS Reporting components & logic
│       ├── components/
│       ├── hooks/
│       └── lib/
│
├── shared/                       # Shared code across all apps
│   ├── components/              # Reusable React components
│   │   ├── Buttons/
│   │   ├── Forms/
│   │   ├── Layout/
│   │   ├── Navigation/
│   │   └── ...
│   ├── contexts/                # React Context providers
│   │   ├── NotificationContext.tsx
│   │   ├── UserContext.tsx
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAPI.ts
│   │   └── ...
│   └── lib/                     # Utility functions & helpers
│       ├── api/                 # API client configuration
│       ├── constants/           # Application constants
│       ├── helpers/             # Utility functions
│       ├── images/              # Shared images
│       └── testing/             # Testing utilities
│
├── pages/                        # Next.js routing
│   ├── api/                     # API routes (Next.js backend)
│   ├── borrower/                # Borrower Portal pages
│   │   ├── documents.tsx
│   │   ├── index.tsx
│   │   ├── orders/
│   │   ├── payment_methods.tsx
│   │   ├── plus.tsx
│   │   ├── profile.tsx
│   │   └── ...
│   ├── reports/                 # Reporting Dashboard pages
│   ├── _app.tsx                 # Root App component
│   ├── index.tsx                # Home page
│   ├── admin.tsx                # Admin dashboard page
│   └── unauthorized.tsx         # Unauthorized access page
│
├── __tests__/                    # Test files
│   ├── apps/                    # App-specific tests
│   ├── shared/                  # Shared component tests
│   └── pages/                   # Page tests
│
├── __mocks__/                    # Global mocks for testing
├── public/                       # Static assets
├── types/                        # TypeScript type definitions
├── middleware.ts                 # Next.js middleware for routing
├── jest.config.ts               # Jest configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── next.config.js               # Next.js configuration
```

### Module Resolution (Path Aliases)

The repository uses TypeScript path aliases for clean imports:

```typescript
// Instead of: import Button from '../../../shared/components/Button'
import Button from '@components/Button';

// Path aliases:
@apps/*          → /apps/*
@components/*    → /shared/components/*
@contexts/*      → /shared/contexts/*
@hooks/*         → /shared/hooks/*
@lib/*           → /shared/lib/*
@pages/*         → /pages/*
@records/*       → /types/records/*
```

## Application Architecture

### Next.js Architecture

CK Frontends leverages Next.js capabilities:

- **Pages Router**: File-based routing in `/pages` directory
- **API Routes**: Backend API endpoints in `/pages/api`
- **Middleware**: Custom routing logic in `middleware.ts`
- **Server-Side Rendering (SSR)**: Dynamic page generation
- **Static Site Generation (SSG)**: Pre-rendered pages where applicable

### Component Architecture

Components follow a hierarchical structure:

```
Pages (Routes)
    ↓
Layout Components (Shells, Navigation)
    ↓
Feature Components (Business Logic)
    ↓
Shared Components (Reusable UI)
    ↓
Primitive Components (Buttons, Inputs)
```

### Component Design Pattern

All components follow a consistent functional component pattern:

```tsx
import React, { FC } from 'react';

interface ComponentProps {
  // Props definition
}

const Component: FC<ComponentProps> = ({ ...props }) => {
  // Component logic
  return (
    // JSX
  );
};

export default Component;
```

## Authentication & Authorization

### SuperTokens Integration

The application uses SuperTokens for unified SSO authentication across all frontend applications.

#### Authentication Flow

1. **Unauthenticated Access**: User attempts to access any CK Frontends application
2. **Middleware Check**: Next.js middleware inspects `st-access-token` cookie
3. **Redirect to Login**: If no valid token, redirect to `ck-login` application
4. **Authentication**: User authenticates via ck-login (two-step verification)
5. **Token Issuance**: SuperTokens issues JWT access token stored as cookie
6. **Return to Application**: User redirected back to original destination
7. **Access Granted**: Middleware validates token and grants access

#### JWT Token Structure

```typescript
{
  sub: string;              // User ID
  isImpersonating: boolean; // Impersonation flag
  parentUserId: string;     // Original user ID (if impersonating)
  'st-role': {             // User role
    v: string;             // Role value
  }
}
```

#### Role-Based Access Control (RBAC)

- Roles are managed in SuperTokens backend
- Middleware parses JWT to determine user permissions
- UI elements conditionally render based on user roles
- Routes are protected based on role requirements

### Cross-Domain Cookie Management

Since applications run on different subdomains (e.g., `borrower.creditkey.com`, `admin.creditkey.com`), SuperTokens manages cookies at the parent domain level (`.creditkey.com`) to enable SSO.

**Development Environment**: Docker setup required to properly handle cross-domain cookies using `.creditkey.localhost` domains.

## Routing & Middleware

### Subdomain-Based Routing

The application uses custom middleware to route users to different UIs based on subdomain:

```typescript
// middleware.ts determines routing
const sites = [
  { domain: 'reports.creditkey.localhost', shortname: 'reports' },
  { domain: 'admin.creditkey.localhost', shortname: 'admin' },
  { domain: 'borrower.creditkey.localhost', shortname: 'borrower' },
];
```

### Environment-Based URLs

| Environment | Application | URL |
|-------------|------------|-----|
| **Production** | Borrower Portal | https://borrower.creditkey.com |
| | Admin Dashboard | https://admin.creditkey.com |
| | Reports Dashboard | https://reports.creditkey.com |
| | Instore Portal | https://merchant-instore.creditkey.com |
| **Staging** | Borrower Portal | https://staging-borrower.creditkey.com |
| | Admin Dashboard | https://staging-admin.creditkey.com |
| | Reports Dashboard | https://staging-reports.creditkey.com |
| | Instore Portal | https://staging-merchant-instore.creditkey.com |
| | Demo Checkout | https://demo.creditkey.tech |
| **Development** | Borrower Portal | http://borrower.creditkey.localhost |
| | Admin Dashboard | http://admin.creditkey.localhost |
| | Reports Dashboard | http://reports.creditkey.localhost |
| | Instore Portal | http://merchant-instore.creditkey.localhost |
| | Demo Checkout | http://demo.creditkey.localhost |

### Middleware Logic

1. **Host Detection**: Extract subdomain from request headers
2. **Site Resolution**: Map subdomain to application shortname
3. **Authentication Check**: Verify SuperTokens session token
4. **Route Protection**: Redirect unauthenticated users to login
5. **Role Validation**: Ensure user has required permissions
6. **Request Forwarding**: Pass authenticated requests to appropriate pages

## State Management

The application uses a hybrid state management approach:

### 1. React Context API (Global State)

Used for application-wide state that needs to be accessible across multiple components:

- **UserContext**: Current user information and authentication state
- **NotificationContext**: Toast notifications and alerts
- **ThemeContext**: UI theme and preferences (if applicable)

```tsx
// Example: NotificationContext
const NotificationContext = createContext<NotificationContextType>({});

export const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  // Context logic
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
```

### 2. React Query (Server State)

Used for managing server-side data with caching, background updates, and optimistic updates:

```tsx
// Example: Data fetching with React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### 3. Component State (Local State)

Used for UI-specific state that doesn't need to be shared:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({});
```

### 4. Form State (Formik)

Used for complex form management:

```tsx
<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {/* Form components */}
</Formik>
```

## Data Flow & API Integration

### API Client Architecture

```
React Components
    ↓
Custom Hooks (useAPI, useAuth)
    ↓
React Query (Caching & State Management)
    ↓
Axios Client (HTTP Requests)
    ↓
Backend APIs (ck-tps, ck-web, ck-auth)
```

### API Client Configuration

- **Base URL**: Environment-specific configuration
- **Authentication**: Automatic token injection via SuperTokens
- **Error Handling**: Global error interceptors
- **Request/Response Transformation**: Axios interceptors

### Data Fetching Pattern

```tsx
// Custom hook pattern
export const useUserData = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

// Component usage
const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useUserData(userId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <UserDetails user={user} />;
};
```

### Backend Integration

The frontend integrates with multiple backend services:

- **ck-tps**: TPS-specific business logic and data
- **ck-web**: Core application logic and merchant data
- **ck-auth**: SuperTokens authentication server
- **evenmoresql**: Typesense search service

### Borrower Request Increase Flow

The borrower dashboard `Stats` feature component (`apps/borrower/components/home/Stats.tsx`) owns the entry point for credit line increase requests. When `NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED=true`, it reads the current credit limit from the existing company entity (`credit_line.amount` / `max_purchase_amount`) and opens an in-app first-step modal that collects the additional amount requested plus optional comments while keeping `Continue` disabled until the amount is a valid positive number. When the flag is disabled, the tile falls back to the legacy external `Request Increase` link.

Continuing from that first step branches into one of two real downstream paths. Approved companies whose entity data reports `is_bank_connected=true` see a connected-bank review step that can submit the request immediately with the existing bank or route to `Change connected bank`. Approved companies without an active bank connection go directly to the verification-method selection screen, where the default Plaid option renders `apps/borrower/components/payment_methods/Plaid.tsx` and the manual option renders a request-scoped bank-statement upload step inside `apps/borrower/components/home/RequestIncreaseModal.tsx`. The manual step requires exactly three selected PDF, Word, Excel, JPG, or PNG bank statement files under 10MB each plus a disclaimer confirming the statements match the existing payment method on file. After completing Plaid verification or the manual upload step, both paths advance to an in-modal review step that requires the borrower to authorize a soft credit pull before the `Submit request` button is enabled. On final submission, the manual path uploads each selected file through `shared/lib/actions/companies.ts#uploadCompanyDocument` with `file_type=bank_statements` and then calls `shared/lib/actions/companies.ts#createLimitIncreaseRequest`; the Plaid path calls only `createLimitIncreaseRequest`. Successful Plaid, connected-bank, and manual-statement paths transition to an in-modal under-review confirmation that displays the requested increase, pending review status, and current limit before the borrower closes the modal.

Deployment enforces the same tier split at build time. `.github/workflows/deploy.yml` fetches the tier secret, then `deploy/bin/write-build-env.sh` strips `NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED` from the secret-derived env payload for every tier and appends `NEXT_PUBLIC_BORROWER_REQUEST_INCREASE_MODAL_ENABLED=true` only for `development` before Docker bakes `.env.production` into the Next.js bundle. That keeps deployed development aligned with local/test defaults while leaving staging and production on the legacy link path by default.

### PostHog Analytics

The borrower portal is instrumented with PostHog (`posthog-js`) for product analytics and NPS person targeting, following PostHog's Next.js 15.3+ pattern.

- **Initialization**: `instrumentation-client.ts` (repo root) initializes the SDK on the client before hydration via `posthog.init()` with `defaults`, `person_profiles: 'identified_only'`, and `autocapture: true`. Session replay uses **selective masking** rather than a blanket blur: the manual bank-entry form (`BankForm`) and the Qolo virtual/physical card widgets carry the `ph-no-capture` class — the PostHog equivalent of FullStory's `fs-exclude` — and the card widgets are cross-origin iframes that rrweb does not record at all. Everything else in the portal is visible in replays. It is token-guarded, so it no-ops when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is unset (e.g., local dev without a key).
- **Identification**: `shared/hooks/usePosthogIdentify.ts` (mounted in `PortalLayout`) calls `shared/lib/posthog.ts#identifyUser` once the user and company entity have loaded, setting `name`, `companyName`, `companyId`, `totalOrders`, and `tier`. Admin and impersonated sessions are skipped, and the identify fires once per session.
- **Reset**: `resetPostHog()` is called on sign-out (`TopNav`/`MobileNav`) to unlink subsequent events from the previous user.
- **Per-environment projects**: local dev and staging point at the "Credit Key Web (Staging)" PostHog project; production uses its own project. Only the `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` value differs per environment (committed in `.env.*` for local, AWS Secrets Manager for deployed tiers) — no code change is needed for the split.

## Styling System

### Tailwind CSS Configuration

The application uses Tailwind CSS with custom theme extensions:

#### Custom Colors

```javascript
// tailwind.config.js
colors: {
  primary: '#15191F',
  'secondary-gray': '#677283',
  'tertiary-gray': '#8A94A3',
  'primary-gray-border': '#E5E7EB',
  'primary-blue': '#0066ff',
  'primary-blue-hover': '#094DB3',
  'secondary-blue': '#ECF3FE',
  disabled: '#ACB5C3',
  success: '#257436',
  'background-success': '#D9F2DF',
  error: '#A72525',
  'background-error': '#F6D5D5',
  'icon-error': '#7D1C1C',
  warning: '#907309',
  'background-warning': '#EBE3AD',
  'primary-beige': '#e0bf9f',
}
```

#### Custom Breakpoints

```javascript
screens: {
  '2xs': '375px',
  'xs': '480px',
  'sm': '640px',
  'md': '768px',
  'mid': '856px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
  '3xl': '1575px',
}
```

### Styling Best Practices

1. **Utility-First**: Use Tailwind utilities for all styling
2. **Conditional Classes**: Use `classnames` package for dynamic styling
3. **Custom SCSS**: Only for complex animations or third-party overrides
4. **Responsive Design**: Mobile-first approach with responsive prefixes
5. **Consistency**: Reference theme colors rather than arbitrary values

```tsx
// Example: Conditional styling
<button className={classNames(
  'w-full font-semibold transition duration-150',
  'text-white py-2 px-3 rounded-lg',
  isActive ? 'bg-primary-blue' : 'bg-disabled',
  { '!cursor-not-allowed': disabled }
)}>
  Submit
</button>
```

## Testing Strategy

### Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Custom Test Utils**: Wrapper around RTL with providers

### Test Organization

Tests mirror the source structure:

```
__tests__/
├── apps/
│   └── borrower/
│       └── components/
│           └── MyComponent.test.tsx
├── shared/
│   └── components/
│       └── Button.test.tsx
└── pages/
    └── index.test.tsx
```

### Testing Conventions

```tsx
import { customRender, screen, waitFor } from '@lib/testing/test-utils';
import MyComponent from '@components/MyComponent';

describe('MyComponent', () => {
  test('renders correctly with props', async () => {
    customRender(<MyComponent title="Test" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
  
  test('handles user interaction', async () => {
    const handleClick = jest.fn();
    customRender(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Types

1. **Unit Tests**: Individual component and function testing
2. **Integration Tests**: Component interaction testing
3. **API Mocking**: MSW for mocking backend responses
4. **Snapshot Tests**: Limited use for stable components

## Development Workflow

### Local Development Setup

#### Prerequisites

- Node.js 22.22.0 (managed via nvm)
- Docker & Docker Compose
- Access to Credit Key infrastructure

#### Required Repositories

For full local development, clone and run the following:

1. **ck-ecosystem**: DNS and reverse proxy (dnsmasq, traefik)
2. **ck-frontends**: This repository
3. **ck-tps**: TPS backend server
4. **ck-web**: Core backend server
5. **ck-auth**: SuperTokens authentication server
6. **ck-login**: Login UI application
7. **evenmoresql**: Typesense search service

#### Development Commands

```bash
# Install dependencies
npm install

# Start development server
docker compose up

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Docker Development

The application **must** run in Docker for local development to support:

- Cross-domain SSO cookie handling
- Subdomain-based routing (`.creditkey.localhost`)
- Integration with other services

```bash
# Start all services
docker compose up

# Rebuild after dependency changes
docker compose up --build

# Stop services
docker compose down
```

### Code Quality Tools

- **ESLint**: Automatic linting on save (configured in IDE)
- **Prettier**: Automatic formatting with import sorting
- **TypeScript**: Type checking during development
- **Husky**: Pre-commit hooks (if configured)

### Import Order Convention

```typescript
// 1. React imports
import React, { FC, useState } from 'react';

// 2. Node built-ins
import path from 'path';

// 3. Third-party packages
import axios from 'axios';
import classNames from 'classnames';

// 4. Internal imports (by alias)
import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@lib/helpers/dateHelpers';

// 5. Relative imports
import { LocalComponent } from './LocalComponent';
```

## Deployment Architecture

### Deployment Pipeline

```
Code Push (GitHub)
    ↓
GitHub Actions (CI/CD)
    ↓
Build Docker Image
    ↓
Run Tests & Linting
    ↓
Push to Container Registry
    ↓
Deploy to Environment
    ↓
Health Checks
```

### CI/CD Workflows

The repository uses GitHub Actions for continuous integration and deployment:

- **format-lint-test.yml**: Runs code formatting checks, linting, and tests on pull requests
- **deploy.yml**: Handles deployment to development, staging, and production environments

### Environment Configuration

- **Development**: Docker Compose locally
- **Staging**: Dedicated staging environment
- **Production**: Production infrastructure

### Environment Variables

Environment-specific configuration is managed through:

- `.env.development`: Local development
- `.env.docker`: Docker development (Docker Compose)
- **Deployed builds**: All `NEXT_PUBLIC_*` environment variables are fetched from AWS Secrets Manager during the GitHub Actions deploy workflow and baked into the Next.js bundle at image build time via a Docker BuildKit secret mount (`--secret id=app-env`). No runtime injection occurs; the ECS task receives no app-level secrets.
- **Marketplace API**: `NEXT_PUBLIC_MARKET_API_URL` should be configured per GitHub Environment (`development`, `staging`, `production`) and is appended during deploy builds.

### Build Optimization

- **Next.js Optimizations**: Automatic code splitting, image optimization
- **Static Asset Caching**: Long-term caching for immutable assets
- **Compression**: Gzip/Brotli compression in production

## Key Architectural Decisions

### 1. Monorepo vs. Multiple Repositories

**Decision**: Use monorepo structure

**Rationale**:
- Shared component library across applications
- Consistent versioning and dependencies
- Simplified development workflow
- Atomic commits across applications
- Easier refactoring and code sharing

### 2. Next.js Framework

**Decision**: Use Next.js instead of Create React App or vanilla React

**Rationale**:
- Server-side rendering capabilities
- Built-in routing
- API routes for backend functionality
- Optimized production builds
- Active community and ecosystem

### 3. TypeScript Adoption

**Decision**: Migrate to TypeScript (strict mode disabled during transition)

**Rationale**:
- Enhanced developer experience with autocomplete
- Compile-time error detection
- Better refactoring support
- Industry standard for modern React applications
- **Note**: Gradual migration strategy with strict mode disabled

### 4. SuperTokens for Authentication

**Decision**: Use SuperTokens instead of building custom auth

**Rationale**:
- SSO across multiple applications
- Security best practices built-in
- Reduces development and maintenance burden
- Flexible role-based access control
- Session management handled automatically

### 5. Tailwind CSS for Styling

**Decision**: Use Tailwind CSS over CSS-in-JS or traditional CSS

**Rationale**:
- Utility-first approach improves development speed
- Consistent design system
- Small production bundle sizes
- No runtime overhead
- Excellent responsive design support

### 6. React Query for Data Fetching

**Decision**: Use React Query instead of Redux or Redux Toolkit

**Rationale**:
- Optimized for server state management
- Built-in caching and background updates
- Less boilerplate than Redux
- Excellent TypeScript support
- Automatic request deduplication

### 7. Feature-Based Organization

**Decision**: Organize by feature instead of technical layer

**Rationale**:
- Easier to locate related code
- Better encapsulation
- Scales better with application growth
- Aligns with component-based architecture

### 8. Subdomain-Based Multi-Tenancy

**Decision**: Use subdomains to separate applications

**Rationale**:
- Clear application boundaries
- SEO-friendly URLs
- Easier to manage permissions
- Simpler deployment strategies
- Better analytics and monitoring

---

## Maintenance

This architecture document should be updated whenever:

- New applications are added to the monorepo
- Major technology stack changes occur
- Significant architectural patterns change
- New development workflows are established
- Deployment processes are modified

For questions about this architecture, please contact the Credit Key Engineering team.

**Last Updated**: 2026-06-24
