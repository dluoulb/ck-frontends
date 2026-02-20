# GitHub Copilot Instructions for CK Frontends

## Project Overview

CK Frontends is a Next.js-based monorepo housing all Credit Key frontend UIs and shared components. It uses SuperTokens for SSO authentication across multiple frontend applications including:
- TPS Reporting Dashboard (not currently used)
- Borrower Portal

## Tech Stack

- **Framework**: Next.js (latest)
- **Language**: TypeScript (with strict mode disabled for gradual migration)
- **UI Library**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom theme configuration
- **Testing**: Jest with React Testing Library
- **State Management**: React Context API
- **API Client**: Axios with React Query (@tanstack/react-query)
- **Authentication**: SuperTokens
- **Icons**: FontAwesome Pro
- **Linting**: ESLint with Next.js configuration
- **Formatting**: Prettier with import sorting

## Code Structure

### File Organization
- Organize files by feature, not by type
- Use the monorepo structure:
  - `/apps/*` - Application-specific components and logic
  - `/shared/components/*` - Reusable components
  - `/shared/contexts/*` - React Context providers
  - `/shared/hooks/*` - Custom React hooks
  - `/shared/lib/*` - Utility functions and helpers
  - `/pages/*` - Next.js page routes
  - `/__tests__/*` - Test files mirroring the source structure

### Module Resolution
Always use path aliases defined in `tsconfig.json`:
- `@components/*` for shared components
- `@contexts/*` for context providers
- `@hooks/*` for custom hooks
- `@lib/*` for utilities and libraries
- `@records/*` for data records/types
- `@apps/[app-name]/*` for app-specific code
- `@pages/[app-name]/*` for app-specific pages

## Coding Standards

### TypeScript
- Use TypeScript for all new files (`.tsx` for components, `.ts` for utilities)
- Define interfaces for component props
- Use `FC` (FunctionComponent) type for React components
- Avoid using `any` type when possible (though allowed by ESLint config)
- Prefix unused variables with underscore: `_unused`

### React Components
- Use functional components exclusively
- Use React hooks (useState, useEffect, etc.)
- Define prop interfaces at the top of the component file
- Export default for components
- Use proper TypeScript typing for all props

Example component structure:
```tsx
import React, { FC } from 'react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
  isActive?: boolean;
}

const MyComponent: FC<MyComponentProps> = ({ title, onClick, isActive }) => {
  return (
    <div onClick={onClick}>
      <h1>{title}</h1>
    </div>
  );
};

export default MyComponent;
```

### Import Order
Follow the Prettier import order configuration:
1. React imports first
2. Built-in Node modules
3. Third-party modules
4. Empty line
5. Internal imports in this order:
   - `@apps/*`
   - `@components/*`
   - `@contexts/*`
   - `@hooks/*`
   - `@lib/*`
   - `@pages/*`
   - `@records/*`
   - Relative imports (`./`, `../`)

### Styling with Tailwind CSS
- Use Tailwind CSS utility classes for all styling
- Use the `classnames` package (imported as `classNames`) for conditional classes
- Reference custom colors from the Tailwind config:
  - Primary colors: `primary`, `primary-blue`, `primary-blue-hover`
  - Gray variants: `secondary-gray`, `tertiary-gray`, `primary-gray-border`
  - Status colors: `success`, `error`, `warning`, `disabled`
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Custom breakpoints available: `2xs:`, `xs:`, `mid:`, `3xl:`

Example:
```tsx
<button className={classNames(
  'w-full font-semibold transition duration-150',
  'text-white py-2 px-3 rounded-lg',
  isActive ? 'bg-primary-blue' : 'bg-disabled',
  { '!cursor-not-allowed': disabled }
)}>
  Click Me
</button>
```

## API and Data Fetching

### React Query
- Use React Query for all API calls
- Follow the pattern used in the codebase with custom hooks
- Handle loading, error, and success states
- Use proper query keys for caching

### Error Handling
- Display user-friendly error messages using the Notification component
- Handle both loading and error states in components
- Use try-catch blocks for async operations

## Testing

### Test Structure
- Place tests in `__tests__` directory mirroring source structure
- Name test files: `[ComponentName].test.tsx` or `[fileName].test.ts`
- Use Jest with React Testing Library
- Use the custom `customRender` utility from `@lib/testing/test-utils`

### Test Conventions
- Use `describe` blocks to group related tests
- Use `test` (not `it`) for individual test cases
- Use `waitFor` for async operations
- Mock dependencies using global mocks when appropriate
- Test user interactions and component behavior, not implementation details

Example test:
```tsx
import MyComponent from '@components/MyComponent';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

describe('MyComponent', () => {
  test('renders correctly', async () => {
    customRender(<MyComponent title="Test" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});
```

## Build and Development

### Commands
- **Build**: `npm run build` - Build the Next.js application
- **Dev**: `npm run dev` - Start development server
- **Test**: `npm test` - Run Jest tests
- **Lint**: `npm run lint` - Run ESLint with auto-fix
- **Lint CI**: `npm run lint:ci` - Run ESLint without auto-fix (for CI)
- **Format**: `npm run format` - Format code with Prettier
- **Format Check**: `npm run format:check` - Check formatting without changes

### Dependency Management
- **Do not commit `package-lock.json`** unless `package.json` has been modified
- If you need to install new dependencies, update `package.json` and then run `npm install`
- When reviewing changes before committing, verify that `package-lock.json` is only included if `package.json` was changed
- Use `.gitignore` or selective staging to exclude `package-lock.json` from unintended commits

### Protected Files
- **Do not modify `shared/components/Scripts.tsx`** - This file contains third-party analytics scripts and should not be changed
- If linting or formatting tools suggest changes to this file, ignore or suppress those suggestions

### Docker Development
The application runs in Docker containers for local development to support SuperTokens SSO across domains. Always use Docker Compose for local development:
```bash
docker compose up
```

## Best Practices

### General
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Use Context API for sharing state across components
- Avoid prop drilling - use contexts when appropriate
- Keep business logic separate from presentation components

### Performance
- Use React.memo for expensive components when appropriate
- Avoid unnecessary re-renders
- Use proper dependency arrays in useEffect and useMemo

### Accessibility
- Use semantic HTML elements
- Include `aria-label` attributes for buttons and interactive elements
- Ensure keyboard navigation works properly
- Use proper heading hierarchy

### Code Quality
- Write clear, descriptive variable and function names
- Add comments only when necessary to explain complex logic
- Keep functions small and focused
- Follow the single responsibility principle
- Maintain consistency with existing code patterns

## Security
- Never commit sensitive data or API keys
- Use environment variables for configuration
- Sanitize user inputs
- Follow OWASP security best practices

## Response Format
When suggesting code changes:
1. Explain the change briefly (1-2 sentences)
2. Provide code in a Markdown code block
3. Add inline comments for complex logic
4. Note any potential side effects or considerations
