#!/usr/bin/env tsx

/**
 * Migration CLI Tool
 * 
 * Usage:
 *   npm run migrate                    # Run all pending migrations
 *   npm run migrate:status             # Check migration status
 *   npm run migrate:rollback <version> # Rollback specific migration
 *   npm run migrate:create <name>      # Create new migration template
 */

import mongoose from 'mongoose';
import { MigrationRunner, SchemaVersionManager } from './migration-system.js';
import config from '../config/index.js';

// Import all migration versions
import { AddEmailVerificationMigration } from './versions/001-add-email-verification.js';
import { EnhanceUserModelMigration } from './versions/002-enhance-user-model.js';
import { AddIdeaFamilyTreeMigration } from './versions/003-add-idea-family-tree.js';

// Create migration runner and register all migrations
const runner = new MigrationRunner();
runner.register(new AddEmailVerificationMigration());
runner.register(new EnhanceUserModelMigration());
runner.register(new AddIdeaFamilyTreeMigration());

// CLI Commands
const commands = {
  async migrate() {
    console.log('🚀 Running database migrations...\n');
    
    await mongoose.connect(config.MONGO_URL);
    console.log('✅ Connected to MongoDB\n');
    
    const currentVersion = await SchemaVersionManager.getCurrentVersion();
    console.log(`📊 Current schema version: ${currentVersion}\n`);
    
    await runner.runMigrations();
    
    // Update schema version to latest
    await SchemaVersionManager.setCurrentVersion('1.2.0');
    
    console.log('\n🎉 Migration process completed successfully!');
    await mongoose.connection.close();
  },

  async status() {
    console.log('📊 Migration Status Report\n');
    
    await mongoose.connect(config.MONGO_URL);
    
    const currentVersion = await SchemaVersionManager.getCurrentVersion();
    console.log(`Current Schema Version: ${currentVersion}\n`);
    
    const migrations = await runner.getMigrationStatus();
    
    console.log('Migration History:');
    console.log('==================');
    
    if (migrations.length === 0) {
      console.log('No migrations have been run yet.');
    } else {
      migrations.forEach(migration => {
        const status = migration.status.toUpperCase().padEnd(10);
        const time = migration.executionTime ? `(${migration.executionTime}ms)` : '';
        const date = migration.appliedAt.toISOString().split('T')[0];
        
        console.log(`${status} | ${migration.version.padEnd(8)} | ${migration.name.padEnd(25)} | ${date} ${time}`);
        
        if (migration.error) {
          console.log(`         Error: ${migration.error}`);
        }
      });
    }
    
    console.log('==================\n');
    await mongoose.connection.close();
  },

  async rollback(version: string) {
    if (!version) {
      console.error('❌ Please specify a version to rollback');
      console.log('Usage: npm run migrate:rollback <version>');
      process.exit(1);
    }
    
    console.log(`🔄 Rolling back migration: ${version}\n`);
    
    await mongoose.connect(config.MONGO_URL);
    
    try {
      await runner.rollbackMigration(version);
      console.log('\n✅ Rollback completed successfully!');
    } catch (error) {
      console.error('\n❌ Rollback failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
    
    await mongoose.connection.close();
  },

  async create(name: string) {
    if (!name) {
      console.error('❌ Please specify a migration name');
      console.log('Usage: npm run migrate:create <name>');
      process.exit(1);
    }

    const fs = await import('fs');
    const path = await import('path');
    
    // Generate next version number
    const migrations = await fs.promises.readdir('./src/migrations/versions/');
    const nextVersion = String(migrations.length + 1).padStart(3, '0');
    
    const fileName = `${nextVersion}-${name.toLowerCase().replace(/\s+/g, '-')}.ts`;
    const filePath = path.join('./src/migrations/versions/', fileName);
    
    const template = `/**
 * Migration: ${name}
 * Version: ${nextVersion}
 * 
 * Description: TODO - Describe what this migration does
 */

import { BaseMigration } from '../migration-system.js';

export class ${name.replace(/\s+/g, '')}Migration extends BaseMigration {
  version = '${nextVersion}';
  name = '${name.replace(/\s+/g, '')}';
  description = 'TODO - Add description';

  async up(): Promise<void> {
    console.log('Running ${name} migration...');
    
    // TODO: Implement migration logic here
    
    console.log('${name} migration completed');
  }

  async down(): Promise<void> {
    console.log('Rolling back ${name} migration...');
    
    // TODO: Implement rollback logic here
    
    console.log('${name} rollback completed');
  }
}
`;

    await fs.promises.writeFile(filePath, template);
    console.log(`✅ Created migration: ${filePath}`);
    console.log(`📝 Don't forget to register it in migrate.ts!`);
  }
};

// Parse command line arguments
const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  try {
    switch (command) {
      case 'status':
        await commands.status();
        break;
      case 'rollback':
        await commands.rollback(args[0]);
        break;
      case 'create':
        await commands.create(args.join(' '));
        break;
      case undefined:
      case 'migrate':
        await commands.migrate();
        break;
      default:
        console.log('Available commands:');
        console.log('  migrate          - Run all pending migrations');
        console.log('  status           - Show migration status');
        console.log('  rollback <ver>   - Rollback specific migration');
        console.log('  create <name>    - Create new migration');
        break;
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();