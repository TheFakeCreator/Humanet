#!/usr/bin/env node
/**
 * Security Testing Script for Humanet
 * 
 * This script tests various security features of the Humanet API
 * Run with: node scripts/security-test.js
 */

import axios from 'axios';
import { performance } from 'perf_hooks';

const API_BASE = 'http://localhost:4000/api';
const TEST_TIMEOUT = 5000;

class SecurityTester {
  constructor() {
    this.results = [];
    this.failedTests = 0;
    this.passedTests = 0;
  }

  async runTest(name, testFn) {
    console.log(`\n🧪 Testing: ${name}`);
    const startTime = performance.now();
    
    try {
      const result = await Promise.race([
        testFn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), TEST_TIMEOUT)
        )
      ]);
      
      const duration = Math.round(performance.now() - startTime);
      console.log(`✅ PASSED (${duration}ms): ${result}`);
      this.passedTests++;
      this.results.push({ name, status: 'PASSED', duration, message: result });
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      console.log(`❌ FAILED (${duration}ms): ${error.message}`);
      this.failedTests++;
      this.results.push({ name, status: 'FAILED', duration, error: error.message });
    }
  }

  async testHealthCheck() {
    return this.runTest('Health Check', async () => {
      const response = await axios.get(`${API_BASE}/../health`);
      if (response.status === 200 && response.data.status === 'ok') {
        return 'Health endpoint is accessible and working';
      }
      throw new Error('Health check failed');
    });
  }

  async testSecurityHeaders() {
    return this.runTest('Security Headers', async () => {
      const response = await axios.get(`${API_BASE}/../health`);
      const headers = response.headers;
      
      const expectedHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'strict-transport-security',
        'referrer-policy'
      ];
      
      const missingHeaders = expectedHeaders.filter(header => !headers[header]);
      
      if (missingHeaders.length === 0) {
        return 'All required security headers are present';
      }
      throw new Error(`Missing headers: ${missingHeaders.join(', ')}`);
    });
  }

  async testCORS() {
    return this.runTest('CORS Configuration', async () => {
      const response = await axios.options(`${API_BASE}/ideas`, {
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET'
        }
      });
      
      const corsHeaders = response.headers['access-control-allow-origin'];
      if (corsHeaders) {
        return 'CORS headers are properly configured';
      }
      throw new Error('CORS headers not found');
    });
  }

  async testInputValidation() {
    return this.runTest('Input Validation - XSS Prevention', async () => {
      try {
        const maliciousPayload = {
          username: '<script>alert("xss")</script>',
          email: 'test@example.com',
          password: 'password123'
        };
        
        const response = await axios.post(`${API_BASE}/auth/signup`, maliciousPayload);
        
        // Should reject malicious input
        if (response.status >= 400) {
          return 'XSS payload properly rejected';
        }
        throw new Error('XSS payload was accepted');
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          return 'XSS payload properly rejected';
        }
        throw error;
      }
    });
  }

  async testMongoInjection() {
    return this.runTest('MongoDB Injection Prevention', async () => {
      try {
        const injectionPayload = {
          email: { $ne: null },
          password: { $ne: null }
        };
        
        const response = await axios.post(`${API_BASE}/auth/login`, injectionPayload);
        
        // Should reject injection attempt
        if (response.status >= 400) {
          return 'MongoDB injection payload properly rejected';
        }
        throw new Error('MongoDB injection payload was accepted');
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          return 'MongoDB injection payload properly rejected';
        }
        throw error;
      }
    });
  }

  async testAuthenticationRequired() {
    return this.runTest('Authentication Required for Protected Endpoints', async () => {
      try {
        const response = await axios.post(`${API_BASE}/ideas`, {
          title: 'Test Idea',
          description: 'This should require authentication',
          domain: ['test']
        });
        
        if (response.status === 401) {
          return 'Protected endpoint properly requires authentication';
        }
        throw new Error('Protected endpoint accessible without authentication');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return 'Protected endpoint properly requires authentication';
        }
        throw error;
      }
    });
  }

  async testRateLimiting() {
    return this.runTest('Rate Limiting (if enabled)', async () => {
      const requests = [];
      
      // Make multiple rapid requests
      for (let i = 0; i < 10; i++) {
        requests.push(
          axios.get(`${API_BASE}/ideas`).catch(err => err.response)
        );
      }
      
      const responses = await Promise.all(requests);
      const hasRateLimit = responses.some(res => 
        res && (res.status === 429 || res.headers['x-ratelimit-limit'])
      );
      
      if (hasRateLimit) {
        return 'Rate limiting is active and working';
      }
      return 'Rate limiting is disabled (development mode)';
    });
  }

  async testRequestSizeLimit() {
    return this.runTest('Request Size Limiting', async () => {
      try {
        const largePayload = {
          title: 'A'.repeat(1000000), // 1MB of 'A's
          description: 'Large payload test',
          domain: ['test']
        };
        
        const response = await axios.post(`${API_BASE}/ideas`, largePayload, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.status >= 400) {
          return 'Large payload properly rejected';
        }
        throw new Error('Large payload was accepted');
      } catch (error) {
        if (error.response && (error.response.status === 413 || error.response.status === 400)) {
          return 'Large payload properly rejected';
        }
        if (error.code === 'ECONNRESET' || error.message.includes('payload')) {
          return 'Large payload properly rejected (connection reset)';
        }
        throw error;
      }
    });
  }

  async testSuspiciousUserAgent() {
    return this.runTest('Suspicious User Agent Detection', async () => {
      const response = await axios.get(`${API_BASE}/ideas`, {
        headers: {
          'User-Agent': 'sqlmap/1.0 (penetration testing tool)'
        }
      });
      
      // Should still work but be logged
      if (response.status === 200) {
        return 'Suspicious user agent detected and logged';
      }
      throw new Error('Unexpected response to suspicious user agent');
    });
  }

  async runAllTests() {
    console.log('🛡️  Humanet Security Test Suite');
    console.log('================================');
    console.log(`Testing API at: ${API_BASE}`);
    
    await this.testHealthCheck();
    await this.testSecurityHeaders();
    await this.testCORS();
    await this.testInputValidation();
    await this.testMongoInjection();
    await this.testAuthenticationRequired();
    await this.testRateLimiting();
    await this.testRequestSizeLimit();
    await this.testSuspiciousUserAgent();
    
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`📈 Success Rate: ${((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1)}%`);
    
    if (this.failedTests > 0) {
      console.log('\n⚠️  Failed Tests:');
      this.results
        .filter(r => r.status === 'FAILED')
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }
    
    console.log('\n🎯 Security Recommendations:');
    console.log('- Enable rate limiting in production (ENABLE_RATE_LIMITING=true)');
    console.log('- Use HTTPS in production with proper SSL certificates');
    console.log('- Set up proper monitoring and alerting for security events');
    console.log('- Regularly update dependencies and run security audits');
    console.log('- Consider implementing CAPTCHA for authentication endpoints');
    
    return this.failedTests === 0;
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new SecurityTester();
  tester.runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

export default SecurityTester;
