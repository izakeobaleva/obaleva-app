# ObaLeva — AI Rules & Tech Stack

## Tech Stack

- **React 18** with **TypeScript** for the UI layer.
- **Vite 5** as the build tool and development server.
- **Tailwind CSS 3** for all styling — no plain CSS or CSS-in-JS libraries.
- **React Router v6** for client-side routing (pages in `src/pages/`).
- **shadcn/ui** component library (built on Radix UI primitives) for reusable UI components.
- **Lucide React** for icons.
- **Supabase JS SDK** for database and auth (if a backend is configured).
- **Sonner** for toast notifications.

## Library Usage Rules

- **Styling**: Never use inline `style` props or CSS modules. Always use Tailwind utility classes.
- **Routing**: Always use `react-router-dom` for navigation. Keep route definitions in `src/App.tsx`.
- **UI Components**: Use shadcn/ui components when available. Do not create custom components that duplicate existing shadcn/ui functionality. Import from `src/components/ui/`.
- **Icons**: Always use `lucide-react`. Do not use emoji, raw SVG, or other icon libraries.
- **Toasts**: Always use `sonner` (`toast` from `sonner`) for user notifications. Do not use `window.alert` or console logs for user-facing messages.
- **State Management**: Use React's built-in hooks (`useState`, `useContext`, `useReducer`). Do not add external state management libraries.
- **HTTP / Data Fetching**: Use Supabase SDK or standard `fetch`. Do not add Axios or React Query.
- **Forms**: Use plain React state. Do not add formik or react-hook-form.
- **Dates**: Use `Intl.DateTimeFormat` or plain JavaScript. Do not add date libraries like dayjs or date-fns.

## Project Structure

```
src/
├── components/     # Shared UI components (not from shadcn)
│   └── ui/         # shadcn/ui generated components (do not edit manually)
├── pages/          # Route page components
├── lib/            # Utility functions and shared helpers
├── hooks/          # Custom React hooks
├── App.tsx         # Route definitions
├── main.tsx        # App entry point
└── index.css       # Tailwind directives only
```

## Code Style

- Components must be small (≤100 lines) and focused. Ask the user before refactoring.
- Always create a new file for each component/hook.
- Use named exports for pages, default exports for components.
- File names: `PascalCase.tsx` for components, `camelCase.ts` for utilities.