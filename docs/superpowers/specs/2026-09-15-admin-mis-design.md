# Afghan Power Admin MIS Design

## Goal
Add a dedicated `/admin` management area to the existing Afghan Power website with secure first-time administrator setup and subsequent administrator login.

## Authentication
- No default administrator email or password exists in source code or environment variables.
- When there are zero administrator records, `/admin` shows Initial Admin Setup.
- Initial setup requires email, password, and password confirmation.
- The backend accepts setup only while the administrator table is empty; later setup attempts are rejected.
- Administrator passwords are scrypt-hashed using the existing password helper.
- Administrator sessions use a separate HttpOnly cookie named `ap_admin_session` and never reuse the customer session.
- After setup, every new unauthenticated visit to `/admin` shows Admin Login.
- Admin login accepts email and password. Logout clears only the admin session.

## MIS Shell
After login, render an independent admin application rather than the public website navigation. It uses the Afghan Power blue/green identity and contains a fixed sidebar with exactly these sections:
1. Dashboard
2. Products
3. Services
4. News
5. About
6. Contact
7. Messages & Requests

Phase one is a management shell only. Dashboard shows static summary cards and quick actions. Other sections show structured placeholders explaining that their selected website content will be connected in later phases.

## Routing
`/admin` is selected using `window.location.pathname`. Public hash routes continue working unchanged. The admin page must not render the public header/footer/chatbot.

## Backend API
- `GET /api/admin/setup-status`
- `POST /api/admin/setup`
- `POST /api/admin/login`
- `GET /api/admin/me`
- `POST /api/admin/logout`

## Security
- No default credentials.
- Setup endpoint closes after first administrator is created.
- Admin email is normalized before storage/login.
- Password minimum is the same secure rule used by customer accounts.
- Admin session is signed with the existing SESSION_SECRET but has its own cookie and payload scope.
