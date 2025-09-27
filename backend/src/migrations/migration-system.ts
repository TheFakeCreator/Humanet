/**
 * Database Migration System for Humanet
 * 
 * This system handles schema changes and data migrations in a production-safe way.
 * 
 * Features:
 * - Version tracking
 * - Rollback capability
 * - Atomic operations
 * - Progress tracking
 * - Validation
 */

import mongoose, { Schema, model, Document } from 'mongoose';

// Migration document to track applied migrations
export interface IMigration extends Document {
  version: string;
  name: string;
  description: string;
  appliedAt: Date;
  rollbackScript?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
  error?: string;
  executionTime?: number; // in milliseconds
}

const MigrationSchema = new Schema<IMigration>({
  version: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  rollbackScript: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'rolled_back'],
    default: 'pending'
  },
  error: {
    type: String
  },
  executionTime: {
    type: Number
  }
});

export const MigrationModel = model<IMigration>('Migration', MigrationSchema);

// Base Migration Class
export abstract class BaseMigration {
  abstract version: string;
  abstract name: string;
  abstract description: string;

  abstract up(): Promise<void>;
  abstract down(): Promise<void>;
  
  // Validation method to check if migration can be applied
  async canApply(): Promise<boolean> {
    const existing = await MigrationModel.findOne({ version: this.version });
    return !existing || existing.status === 'failed';
  }

  // Validation method to check if migration can be rolled back
  async canRollback(): Promise<boolean> {
    const existing = await MigrationModel.findOne({ version: this.version });
    return !!(existing && existing.status === 'completed');
  }
}

// Migration Runner
export class MigrationRunner {
  private migrations: BaseMigration[] = [];

  register(migration: BaseMigration) {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version.localeCompare(b.version));
  }

  async runMigrations() {
    console.log('🚀 Starting database migrations...');
    
    for (const migration of this.migrations) {
      await this.runMigration(migration);
    }
    
    console.log('✅ All migrations completed successfully');
  }

  async runMigration(migration: BaseMigration) {
    const startTime = Date.now();
    
    try {
      // Check if migration can be applied
      if (!(await migration.canApply())) {
        console.log(`⏭️  Skipping migration ${migration.version} - already applied`);
        return;
      }

      console.log(`🔄 Running migration: ${migration.version} - ${migration.name}`);

      // Create or update migration record
      await MigrationModel.findOneAndUpdate(
        { version: migration.version },
        {
          version: migration.version,
          name: migration.name,
          description: migration.description,
          status: 'running',
          appliedAt: new Date()
        },
        { upsert: true }
      );

      // Run the migration in a transaction for atomicity
      await mongoose.connection.transaction(async (session) => {
        await migration.up();
      });

      const executionTime = Date.now() - startTime;

      // Mark as completed
      await MigrationModel.findOneAndUpdate(
        { version: migration.version },
        {
          status: 'completed',
          executionTime
        }
      );

      console.log(`✅ Migration ${migration.version} completed in ${executionTime}ms`);

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Mark as failed
      await MigrationModel.findOneAndUpdate(
        { version: migration.version },
        {
          status: 'failed',
          error: errorMessage,
          executionTime
        }
      );

      console.error(`❌ Migration ${migration.version} failed:`, errorMessage);
      throw error;
    }
  }

  async rollbackMigration(version: string) {
    const migration = this.migrations.find(m => m.version === version);
    if (!migration) {
      throw new Error(`Migration ${version} not found`);
    }

    if (!(await migration.canRollback())) {
      throw new Error(`Migration ${version} cannot be rolled back`);
    }

    const startTime = Date.now();

    try {
      console.log(`🔄 Rolling back migration: ${version} - ${migration.name}`);

      await mongoose.connection.transaction(async (session) => {
        await migration.down();
      });

      const executionTime = Date.now() - startTime;

      await MigrationModel.findOneAndUpdate(
        { version },
        {
          status: 'rolled_back',
          executionTime
        }
      );

      console.log(`✅ Migration ${version} rolled back successfully in ${executionTime}ms`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Rollback failed for ${version}:`, errorMessage);
      throw error;
    }
  }

  async getMigrationStatus() {
    const migrations = await MigrationModel.find().sort({ version: 1 });
    return migrations.map(m => ({
      version: m.version,
      name: m.name,
      status: m.status,
      appliedAt: m.appliedAt,
      executionTime: m.executionTime,
      error: m.error
    }));
  }
}

// Schema Version Manager
export class SchemaVersionManager {
  private static readonly SCHEMA_VERSION_KEY = 'schema_version';

  static async getCurrentVersion(): Promise<string> {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const doc = await db
      .collection('system_metadata')
      .findOne({ key: this.SCHEMA_VERSION_KEY });
    
    return doc?.value || '0.0.0';
  }

  static async setCurrentVersion(version: string): Promise<void> {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    await db
      .collection('system_metadata')
      .replaceOne(
        { key: this.SCHEMA_VERSION_KEY },
        { key: this.SCHEMA_VERSION_KEY, value: version, updatedAt: new Date() },
        { upsert: true }
      );
  }

  static compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }
}