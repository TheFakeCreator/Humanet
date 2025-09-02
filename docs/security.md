# Security Implementation Guide

## Overview

Humanet implements comprehensive security measures to protect against common web application vulnerabilities and ensure data integrity.

## Security Features

### 1. Rate Limiting

#### General Rate Limiting
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Purpose**: Prevent DoS attacks and abuse

#### Authentication Rate Limiting
- **Window**: 15 minutes  
- **Limit**: 5 attempts per IP
- **Purpose**: Prevent brute force attacks
- **Features**: 
  - Automatic blocking after 5 failed attempts
  - 30-minute lockout period
  - Progressive delays

#### Endpoint-Specific Limits
- **Idea Creation**: 10 per hour per user
- **Comments**: 20 per 15 minutes per user
- **Upvotes**: 30 per minute per user
- **Password Reset**: 3 per hour per IP

### 2. Input Validation & Sanitization

#### MongoDB Injection Prevention
- Uses `express-mongo-sanitize` to remove dangerous operators
- Removes `$` prefixed keys and `.` characters
- Validates all input with Zod schemas

#### XSS Protection
- Content Security Policy headers
- Input validation for script tags and event handlers
- HTML entity encoding

#### Request Size Limiting
- Maximum payload size: 10MB
- Parameter limit: 100 per request
- Protection against memory exhaustion

### 3. Security Headers

#### Helmet.js Implementation
- **Content Security Policy**: Prevents XSS attacks
- **HSTS**: Forces HTTPS in production
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer Policy**: Controls referrer information

#### Custom Headers
- **X-XSS-Protection**: Browser XSS filtering
- **Permissions-Policy**: Restricts device access
- **Cache-Control**: Prevents sensitive data caching

### 4. CORS Configuration

#### Allowed Origins
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://humanet.vercel.app',
  'https://www.humanet.com'
];
```

#### Features
- Credential support enabled
- Specific method allowlist
- Header restrictions
- Configurable via environment variables

### 5. Authentication Security

#### JWT Implementation
- Secure token generation
- HttpOnly cookies for web clients
- Bearer token fallback for APIs
- Automatic token expiration

#### Password Security
- bcryptjs hashing (Windows compatible)
- Minimum complexity requirements
- Salt rounds: 12 (configurable)

### 6. Security Monitoring

#### Logging
- Failed authentication attempts
- Suspicious user agents
- Rate limit violations
- Security header violations

#### Detection Patterns
```javascript
const suspiciousAgents = [
  'sqlmap', 'nikto', 'nessus', 'openvas',
  'nmap', 'masscan', 'zap', 'burp'
];
```

## Configuration

### Environment Variables

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
ENABLE_RATE_LIMITING=true

# Security Headers
ENABLE_SECURITY_HEADERS=true
ENABLE_CORS=true
TRUST_PROXY=true

# CORS Origins (comma-separated)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://myapp.com

# Monitoring
LOG_SECURITY_EVENTS=true
BLOCK_SUSPICIOUS_IPS=false
```

### Production Recommendations

1. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Redirect HTTP to HTTPS
   - Set `TRUST_PROXY=true` behind load balancers

2. **Database Security**
   - Use MongoDB authentication
   - Enable database encryption
   - Restrict network access

3. **API Keys** (Future Implementation)
   - Implement API key validation
   - Rate limit by API key
   - Monitor API usage

4. **Monitoring & Alerting**
   - Set up log aggregation
   - Monitor failed requests
   - Alert on suspicious patterns

## Security Testing

### Automated Scans
```bash
# Install security audit tools
npm audit

# Check for vulnerabilities
pnpm audit

# Use security linting
npx eslint --ext .ts src/ --config .eslintrc.security.js
```

### Manual Testing
1. **Rate Limiting**: Test with multiple rapid requests
2. **Input Validation**: Test with malicious payloads
3. **Authentication**: Test with invalid credentials
4. **CORS**: Test with unauthorized origins

## Incident Response

### Rate Limit Violations
1. Check logs for patterns
2. Identify source IP addresses
3. Temporary IP blocking if needed
4. Scale rate limits if legitimate traffic

### Authentication Attacks
1. Monitor failed login attempts
2. Implement progressive delays
3. Notify users of suspicious activity
4. Consider CAPTCHA implementation

### Input Validation Bypasses
1. Update validation schemas
2. Patch security middleware
3. Review input sanitization
4. Update security tests

## Security Checklist

- [ ] Rate limiting configured and tested
- [ ] Security headers implemented
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] Authentication properly secured
- [ ] Logging and monitoring enabled
- [ ] SSL/TLS certificates installed
- [ ] Database access restricted
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented

## Compliance

### OWASP Top 10 Coverage
1. **Injection**: Input validation & sanitization ✅
2. **Broken Authentication**: Secure JWT implementation ✅
3. **Sensitive Data Exposure**: HTTPS & secure headers ✅
4. **XML External Entities**: Not applicable (no XML) ✅
5. **Broken Access Control**: Role-based authorization ✅
6. **Security Misconfiguration**: Secure defaults ✅
7. **Cross-Site Scripting**: CSP headers & validation ✅
8. **Insecure Deserialization**: JSON only, validated ✅
9. **Known Vulnerabilities**: Regular audits ✅
10. **Insufficient Logging**: Comprehensive logging ✅

## Updates & Maintenance

### Regular Tasks
- Update dependencies monthly
- Review security logs weekly
- Test security measures quarterly
- Update incident response plan annually

### Monitoring Tools
- `npm audit` for dependency vulnerabilities
- Custom security event logging
- Rate limit violation tracking
- Failed authentication monitoring

---

*Last Updated: January 2025*
*Version: 1.0.0*
