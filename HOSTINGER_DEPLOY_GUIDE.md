# Hostinger Deployment Guide for suryadietfit.com

This guide provides step-by-step instructions to deploy **Surya Web** to **suryadietfit.com** on Hostinger.

---

## 📦 Ready-to-Upload Deployment Zip
The production bundle has been generated:
**`suryadietfit-hostinger-deploy.zip`**

This zip contains:
- Built frontend (`dist/`)
- Server files (`server/`)
- Media assets and public files (`public/`)
- PM2 configuration (`ecosystem.config.cjs`)
- Dependencies specification (`package.json`, `package-lock.json`)
- `.env.example`

*(Private databases and environment files are strictly excluded so live server data is never overwritten).*

---

## Option A: Hostinger Web / Cloud Hosting (hPanel Node.js)

If your Hostinger plan includes **Node.js support in hPanel**:

1. **Log in to Hostinger hPanel**:
   - Go to **Websites** and select **suryadietfit.com**.
2. **Access File Manager**:
   - Navigate to **Files** → **File Manager**.
   - Open your site folder (usually `public_html` or your designated project folder).
   - Upload `suryadietfit-hostinger-deploy.zip` and click **Extract**.
3. **Configure Node.js Application in hPanel**:
   - Go to **Advanced** → **Node.js** (or search "Node.js" in hPanel).
   - Click **Create Application**:
     - **Node.js Version**: Select **22.x** or newer (required for SQLite `DatabaseSync`).
     - **Application Root**: Path where files were extracted (e.g., `public_html`).
     - **Application Startup File**: `server/index.mjs`
4. **Environment Variables**:
   - In File Manager, create a `.env` file with:
     ```env
     NODE_ENV=production
     PORT=3000
     PUBLIC_URL=https://suryadietfit.com
     DATA_DIR=data
     ```
5. **Install Dependencies**:
   - In the Node.js management panel, click **Run NPM Install** (or open the Web Terminal and run `npm install --omit=dev`).
6. **Start/Restart Application**:
   - Click **Restart** or **Start Application**.
   - Open `https://suryadietfit.com/setup` to configure your first-time admin credentials using the token generated in `data/bootstrap-token.txt`.

---

## Option B: Hostinger VPS (SSH + PM2 + Nginx)

If you are using a **Hostinger VPS**:

1. **SSH into your VPS**:
   ```bash
   ssh root@<YOUR_VPS_IP>
   ```

2. **Clone the Repository**:
   ```bash
   cd /var/www
   git clone https://github.com/mentorsadda/surya-web.git suryadietfit
   cd suryadietfit
   ```

3. **Install Dependencies & Build**:
   ```bash
   npm ci
   npm run build
   ```

4. **Set Up `.env`**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Add:
   ```env
   NODE_ENV=production
   PORT=3040
   PUBLIC_URL=https://suryadietfit.com
   DATA_DIR=/var/www/suryadietfit/data
   ```

5. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx Reverse Proxy**:
   ```nginx
   server {
       server_name suryadietfit.com www.suryadietfit.com;

       location / {
           proxy_pass http://127.0.0.1:3040;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

7. **Install SSL Certificate**:
   ```bash
   certbot --nginx -d suryadietfit.com -d www.suryadietfit.com
   ```
