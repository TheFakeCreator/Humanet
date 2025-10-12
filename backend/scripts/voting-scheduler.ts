#!/usr/bin/env tsx
/**
 * Voting Scheduler for Automated Voting Conclusion
 *
 * This script automatically concludes expired voting periods.
 * It runs periodically to check for voting that has passed the 7-day deadline
 * and processes them automatically to ensure timely ownership transfers.
 *
 * Usage:
 *   npx tsx scripts/voting-scheduler.ts [--once] [--verbose]
 *
 * Options:
 *   --once      Run once and exit (useful for testing)
 *   --verbose   Enable detailed logging
 *
 * As a cron job (runs every hour):
 *   0 * * * * cd /path/to/humanet/backend && npx tsx scripts/voting-scheduler.ts
 */

import mongoose from 'mongoose';
import config from '../src/config/index.js';
import { VotingService } from '../src/services/voting.service.js';

// Configuration
interface SchedulerConfig {
  runOnce: boolean;
  verbose: boolean;
  intervalMinutes: number;
}

const DEFAULT_CONFIG: SchedulerConfig = {
  runOnce: false,
  verbose: false,
  intervalMinutes: 60, // Run every hour by default
};

// Parse command line arguments
function parseArgs(): SchedulerConfig {
  const args = process.argv.slice(2);
  const config = { ...DEFAULT_CONFIG };

  for (const arg of args) {
    switch (arg) {
      case '--once':
        config.runOnce = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--help':
        console.log(`
Voting Scheduler - Automated Voting Conclusion

Usage: npx tsx scripts/voting-scheduler.ts [options]

Options:
  --once      Run once and exit (default: false)
  --verbose   Enable detailed logging (default: false)
  --help      Show this help message

Examples:
  npx tsx scripts/voting-scheduler.ts --once
  npx tsx scripts/voting-scheduler.ts --verbose
        `);
        process.exit(0);
        break;
      default:
        if (arg.startsWith('--')) {
          console.warn(`Unknown option: ${arg}`);
        }
    }
  }

  return config;
}

// Utility function for logging
function log(message: string, config: SchedulerConfig, level: 'info' | 'error' | 'warn' = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [VOTING-SCHEDULER]`;

  switch (level) {
    case 'error':
      console.error(`${prefix} ERROR: ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} WARN: ${message}`);
      break;
    case 'info':
    default:
      if (config.verbose || level !== 'info') {
        console.log(`${prefix} ${message}`);
      }
      break;
  }
}

// Database connection functions
async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.MONGO_URL);
}

async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
}

// Main scheduler function
async function processExpiredVoting(config: SchedulerConfig): Promise<void> {
  try {
    log('Starting expired voting check...', config);

    await VotingService.concludeExpiredVoting();

    log('Expired voting check completed successfully', config);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Failed to process expired voting: ${errorMessage}`, config, 'error');

    // Don't throw in scheduled mode to prevent the scheduler from stopping
    if (config.runOnce) {
      throw error;
    }
  }
}

// Scheduler loop
async function runScheduler(config: SchedulerConfig): Promise<void> {
  log(
    `Starting voting scheduler (runOnce: ${config.runOnce}, interval: ${config.intervalMinutes}m)`,
    config
  );

  if (config.runOnce) {
    await processExpiredVoting(config);
    log('Single run completed', config);
    return;
  }

  // Continuous mode
  log('Running in continuous mode. Press Ctrl+C to stop.', config);

  const intervalMs = config.intervalMinutes * 60 * 1000;
  let isRunning = true;

  // Graceful shutdown handling
  process.on('SIGINT', () => {
    log('Received SIGINT, shutting down gracefully...', config);
    isRunning = false;
  });

  process.on('SIGTERM', () => {
    log('Received SIGTERM, shutting down gracefully...', config);
    isRunning = false;
  });

  // Initial run
  await processExpiredVoting(config);

  // Schedule subsequent runs
  while (isRunning) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));

    if (isRunning) {
      await processExpiredVoting(config);
    }
  }

  log('Scheduler stopped', config);
}

// Enhanced error monitoring with retry logic
async function runWithRetry(config: SchedulerConfig): Promise<void> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await connectDB();
      log('Database connected successfully', config);

      await runScheduler(config);
      break; // Success, exit retry loop
    } catch (error) {
      retryCount++;
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (retryCount < maxRetries) {
        log(
          `Attempt ${retryCount} failed: ${errorMessage}. Retrying in 30 seconds...`,
          config,
          'warn'
        );
        await new Promise((resolve) => setTimeout(resolve, 30000));
      } else {
        log(`All ${maxRetries} attempts failed. Final error: ${errorMessage}`, config, 'error');
        throw error;
      }
    } finally {
      try {
        await disconnectDB();
        log('Database disconnected', config);
      } catch (disconnectError) {
        log(`Error disconnecting from database: ${disconnectError}`, config, 'warn');
      }
    }
  }
}

// Health check function for monitoring
async function healthCheck(): Promise<boolean> {
  try {
    await connectDB();
    // Simple query to verify connection
    const connectionState = mongoose.connection.readyState;
    await disconnectDB();

    return connectionState === 1; // 1 = connected
  } catch {
    return false;
  }
}

// Main execution
async function main(): Promise<void> {
  const config = parseArgs();

  try {
    // Health check before starting
    if (!config.runOnce) {
      log('Performing health check...', config);
      const healthy = await healthCheck();
      if (!healthy) {
        throw new Error('Health check failed: Unable to connect to database');
      }
      log('Health check passed', config);
    }

    await runWithRetry(config);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Scheduler failed to start: ${errorMessage}`, config, 'error');
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[VOTING-SCHEDULER] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[VOTING-SCHEDULER] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Export for testing
export { processExpiredVoting, healthCheck, parseArgs };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
