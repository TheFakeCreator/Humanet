# Deployment Guide

## Overview

This guide covers deploying Humanet to production environments with security, performance, and reliability considerations.

## Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **MongoDB**: 5.0 or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: 10GB available space
- **Network**: HTTPS capable

### Required Services
- Domain name with SSL certificate
- MongoDB Atlas or self-hosted MongoDB
- Email service (optional, for notifications)
- CDN (optional, for static assets)

## Environment Setup

### 1. Production Environment Variables

Create a `.env` file with production values:

```bash
# Environment
NODE_ENV=production

# Server Configuration
PORT=4000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/humanet

# Authentication
JWT_SECRET=your-super-secure-64-character-jwt-secret-generated-with-openssl
JWT_REFRESH_SECRET=your-super-secure-64-character-refresh-secret-generated-with-openssl
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
ENABLE_RATE_LIMITING=true
ENABLE_SECURITY_HEADERS=true
ENABLE_CORS=true
TRUST_PROXY=true
LOG_SECURITY_EVENTS=true
BLOCK_SUSPICIOUS_IPS=true
```

### 2. Generate Secure Secrets

```bash
# Generate JWT secrets
openssl rand -hex 64

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Backend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/index.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Deploy**
   ```bash
   cd backend
   pnpm run build
   vercel --prod
   ```

#### Frontend Deployment (Vercel)

1. **Configure next.config.js**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     env: {
       NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
     },
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY',
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff',
             },
           ],
         },
       ];
     },
   };

   module.exports = nextConfig;
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway link
   railway up
   ```

3. **Configure Environment**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=your-connection-string
   # Add all other environment variables
   ```

### Option 3: DigitalOcean App Platform

1. **Create app.yaml**
   ```yaml
   name: humanet
   services:
   - name: backend
     source_dir: backend
     github:
       repo: your-username/humanet
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: ${DATABASE_URL}
   - name: frontend
     source_dir: frontend
     github:
       repo: your-username/humanet
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

### Option 4: AWS (Production Scale)

#### Backend (AWS Lambda + API Gateway)

1. **Install Serverless Framework**
   ```bash
   npm i -g serverless
   ```

2. **Configure serverless.yml**
   ```yaml
   service: humanet-backend
   
   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
     
   functions:
     api:
       handler: dist/lambda.handler
       events:
         - http:
             path: /{proxy+}
             method: ANY
             cors: true
   ```

3. **Deploy**
   ```bash
   cd backend
   pnpm run build
   serverless deploy
   ```

#### Frontend (AWS S3 + CloudFront)

1. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   aws s3 sync out/ s3://your-bucket-name
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster
   - Choose region closest to your users
   - Select M0 (free tier) or higher

2. **Configure Security**
   ```bash
   # Create database user
   # Add IP whitelist (0.0.0.0/0 for cloud deployments)
   # Enable authentication
   ```

3. **Get Connection String**
   ```bash
   mongodb+srv://username:password@cluster.mongodb.net/humanet
   ```

### Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # CentOS/RHEL
   sudo yum install mongodb-server
   ```

2. **Configure Security**
   ```javascript
   // /etc/mongod.conf
   security:
     authorization: enabled
   
   net:
     bindIp: 127.0.0.1
     port: 27017
   ```

3. **Create Database User**
   ```javascript
   use humanet
   db.createUser({
     user: "humanet_user",
     pwd: "secure_password",
     roles: ["readWrite"]
   })
   ```

## SSL/TLS Setup

### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet
```

### Option 2: Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable "Always Use HTTPS"
4. Set SSL/TLS mode to "Full (strict)"

### Option 3: AWS Certificate Manager

```bash
# Request certificate
aws acm request-certificate --domain-name yourdomain.com
```

## Performance Optimization

### 1. Caching Strategy

```javascript
// Add to app.ts
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});
```

### 2. Database Indexing

```javascript
// Add to MongoDB
db.ideas.createIndex({ createdAt: -1 });
db.ideas.createIndex({ author: 1 });
db.ideas.createIndex({ "upvotes.user": 1 });
db.comments.createIndex({ ideaId: 1, createdAt: -1 });
```

### 3. Compression

```javascript
// Add to app.ts
import compression from 'compression';
app.use(compression());
```

## Monitoring & Logging

### 1. Application Monitoring

```bash
# Install monitoring tools
npm install @sentry/node @sentry/tracing
```

```javascript
// Add to app.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Health Checks

```javascript
// Enhanced health check
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### 3. Logging Setup

```javascript
// Install winston
npm install winston

// Configure logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## Security Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Secrets generated securely
- [ ] Database authentication enabled
- [ ] CORS origins restricted
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Input validation implemented
- [ ] SSL certificate obtained

### Post-Deployment
- [ ] Health checks responding
- [ ] Database connectivity verified
- [ ] Authentication working
- [ ] Rate limiting active
- [ ] Security headers present
- [ ] CORS properly configured
- [ ] Monitoring alerts configured
- [ ] Backup strategy implemented

## Backup Strategy

### Database Backups

```bash
# MongoDB Atlas - Automatic backups enabled
# Self-hosted MongoDB
mongodump --uri="mongodb://username:password@localhost:27017/humanet" --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR
```

### Application Backups

```bash
# Code repository - Use Git tags
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0

# Configuration backups
cp .env .env.backup.$(date +%Y%m%d)
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer Setup**
   ```nginx
   upstream backend {
       server backend1.yourdomain.com;
       server backend2.yourdomain.com;
   }
   
   server {
       listen 80;
       location / {
           proxy_pass http://backend;
       }
   }
   ```

2. **Database Replication**
   ```javascript
   // MongoDB replica set
   rs.initiate({
     _id: "humanet-rs",
     members: [
       { _id: 0, host: "db1:27017" },
       { _id: 1, host: "db2:27017" },
       { _id: 2, host: "db3:27017" }
     ]
   });
   ```

### Vertical Scaling

1. **Resource Monitoring**
   ```bash
   # Monitor CPU and memory usage
   htop
   free -h
   df -h
   ```

2. **Performance Tuning**
   ```javascript
   // Increase connection pool
   mongoose.connect(uri, {
     maxPoolSize: 20,
     minPoolSize: 5,
   });
   ```

## Rollback Strategy

### Quick Rollback

```bash
# Using Git tags
git checkout v1.0.0
npm run build
pm2 restart all

# Using Docker
docker pull humanet:v1.0.0
docker stop humanet-current
docker run -d --name humanet-current humanet:v1.0.0
```

### Database Rollback

```bash
# Restore from backup
mongorestore --uri="$MONGODB_URI" --drop /backup/20240101
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:4000 | xargs kill -9
   ```

2. **Database connection failed**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Check network connectivity
   telnet your-db-host 27017
   ```

3. **Memory issues**
   ```bash
   # Check memory usage
   free -h
   
   # Clear Node.js cache
   npm cache clean --force
   ```

### Log Analysis

```bash
# Search for errors
grep -i error /var/log/humanet/combined.log

# Monitor real-time logs
tail -f /var/log/humanet/combined.log

# Check security events
grep -i "security" /var/log/humanet/combined.log
```

---

*Last Updated: January 2025*
*Version: 1.0.0*
