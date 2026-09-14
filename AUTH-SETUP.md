# Afghan Power Customer Authentication Setup

This release adds real sign-up, sign-in, logout, session restore and Google sign-in. The account UI is already wired to `/api/auth/*`.

## 1. PostgreSQL on the VPS

```bash
apt update
apt install postgresql postgresql-contrib -y
sudo -u postgres psql
```

Inside PostgreSQL:

```sql
CREATE USER afghanpower WITH PASSWORD 'CHANGE_THIS_TO_A_STRONG_PASSWORD';
CREATE DATABASE afghanpower_web OWNER afghanpower;
\q
```

The API creates the `users` table and indexes automatically at startup.

## 2. Environment file

From the project root:

```bash
cp .env.example .env
nano .env
```

Set real values:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://afghanpower:YOUR_DB_PASSWORD@127.0.0.1:5432/afghanpower_web
SESSION_SECRET=PUT_A_LONG_RANDOM_SECRET_HERE
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

Generate a session secret if needed:

```bash
openssl rand -hex 48
```

Never commit `.env` to GitHub.

## 3. Google sign-in

In Google Cloud Console:

1. Create or select a project.
2. Configure OAuth consent screen.
3. Create an **OAuth 2.0 Client ID** for **Web application**.
4. Add these Authorized JavaScript origins:
   - `https://afghanpower.com`
   - `https://www.afghanpower.com`
   - `http://localhost:5173` for local development
5. Copy the Client ID into both `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`.

This implementation uses Google Identity Services ID tokens; no redirect URI is required for the rendered sign-in button.

## 4. Install, test and build

```bash
npm install
npm run test:auth
npm run build
```

For local development, run the API and Vite in separate terminals:

```bash
npm run dev:api
```

```bash
npm run dev
```

Vite proxies `/api` to `127.0.0.1:3001`.

## 5. Run the API with PM2

```bash
npm install -g pm2
pm2 delete afghanpower-web-api 2>/dev/null || true
pm2 start npm --name afghanpower-web-api -- run start:api
pm2 save
pm2 startup
```

After `pm2 startup`, run the command PM2 prints if it asks you to.

Check it:

```bash
curl http://127.0.0.1:3001/api/health
pm2 logs afghanpower-web-api --lines 50
```

Expected health response:

```json
{"ok":true}
```

## 6. Nginx API proxy

Edit:

```bash
nano /etc/nginx/sites-available/afghanpower.com
```

Inside the HTTPS server block that serves the website, add:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Keep the existing frontend block:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Then:

```bash
nginx -t
systemctl reload nginx
```

## 7. Updating later

After pushing to GitHub:

```bash
cd /var/www/Afghan-power-webiste
git pull origin main
npm install
npm run test:auth
npm run build
pm2 restart afghanpower-web-api
nginx -t && systemctl reload nginx
```

## API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Authentication uses an HttpOnly `ap_session` cookie. Passwords are hashed with Node.js `scrypt` and are never returned to the browser.
