# Airport Management System (Frontend-only)

This is a frontend-only React application (Vite) that demonstrates a simple Airport Management System.

Features
- Splash screen
- Frontend-only authentication (login/register stored in localStorage)
- User CRUD (Create, Read, Update, Delete) via Context API
- Ticket/Flight CRUD via Context API
- Booking interlink: users can book flights; bookings are stored in localStorage
- Contexts: AuthContext, UserContext, TicketContext
- Routing with React Router v6
- Styling: Bootstrap 5 (CDN)
- Responsive layout

Getting started
1. Install dependencies

```powershell
cd "c:\Users\reach\Desktop\Airport_Management_System"
npm install
```

2. Start development server

```powershell
npm run dev
```

Project structure
- `index.html` – includes Bootstrap CDN and mounts React
- `src/main.jsx` – app entry
- `src/App.jsx` – context providers wrapping Router
- `src/routes/Router.jsx` – React Router configuration
- `src/context` – `AuthContext.jsx`, `UserContext.jsx`, `TicketContext.jsx`
- `src/pages` – splash, login, register, dashboard, users, tickets, bookings
- `src/components` – Navbar, Modal, Card
- `src/styles` – simple CSS helpers

Notes on Context usage
- `AuthContext` manages current user and handles login/register (front-end only).
- `UserContext` holds the users array and exposes add/update/delete.
- `TicketContext` holds flights/tickets, booking functions, and booking storage.
- All data is persisted to `localStorage` and therefore survives page refresh.

Next steps / enhancements
- Replace simple confirm() dialogs with styled Bootstrap modals for better UX
- Add unit and integration tests (Jest/React Testing Library)
- Add form validation library for richer checks
- Polish styling and add screenshots/demo video

Deadline
- The project deadline noted is 11 November 2025.

If you'd like, I can now run `npm install` in a terminal and start the dev server for you, or continue by improving forms/modals and adding tests.
