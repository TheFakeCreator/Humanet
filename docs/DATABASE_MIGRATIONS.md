# 🔄 Database Migration System

This document explains how to handle database schema changes safely in production using our comprehensive migration system.

## 📋 Overview

Our migration system provides:
- ✅ **Version tracking** - Track which migrations have been applied
- ✅ **Rollback capability** - Safely undo migrations if needed
- ✅ **Atomic operations** - All-or-nothing execution with transactions
- ✅ **Progress tracking** - Monitor execution time and status
- ✅ **Validation** - Prevent duplicate or invalid migrations

## 🚀 Quick Start

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback a specific migration
npm run migrate:rollback 1.0.1

# Create a new migration
npm run migrate:create "Add user preferences"
```

## 📖 Migration Lifecycle

### 1. Creating a Migration

```bash
npm run migrate:create "Add email notifications"
```

This creates a new migration file with a template:

```typescript
export class AddEmailNotificationsMigration extends BaseMigration {
  version = '1.0.4';
  name = 'AddEmailNotifications';
  description = 'Add email notification preferences to users';

  async up(): Promise<void> {
    // Forward migration logic
  }

  async down(): Promise<void> {
    // Rollback migration logic
  }
}
```

### 2. Implementing Migration Logic

```typescript
async up(): Promise<void> {
  console.log('Adding email notification fields...');
  
  // Add new fields
  await UserModel.updateMany(
    {},
    {
      $set: {
        emailNotifications: {
          ideas: true,
          comments: true,
          mentions: true,
          followers: false
        },
        notificationFrequency: 'immediate'
      }
    }
  );

  // Add indexes
  await UserModel.collection.createIndex(
    { 'emailNotifications.ideas': 1 },
    { name: 'idx_email_notifications_ideas' }
  );
}
```

### 3. Register Migration

Add your migration to `src/migrations/migrate.ts`:

```typescript
import { AddEmailNotificationsMigration } from './versions/004-add-email-notifications.js';

runner.register(new AddEmailNotificationsMigration());
```

### 4. Test and Deploy

```bash
# Test locally
npm run migrate

# Check status
npm run migrate:status

# In production
NODE_ENV=production npm run migrate
```

## 🛠️ Migration Types

### 1. Adding New Fields

```typescript
async up(): Promise<void> {
  await UserModel.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: defaultValue } }
  );
}

async down(): Promise<void> {
  await UserModel.updateMany(
    {},
    { $unset: { newField: '' } }
  );
}
```

### 2. Data Transformation

```typescript
async up(): Promise<void> {
  const users = await UserModel.find({ oldField: { $exists: true } });
  
  for (const user of users) {
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: { newField: transformFunction(user.oldField) },
        $unset: { oldField: '' }
      }
    );
  }
}
```

### 3. Index Management

```typescript
async up(): Promise<void> {
  // Add compound index
  await UserModel.collection.createIndex(
    { field1: 1, field2: -1 },
    { name: 'idx_field1_field2', unique: true }
  );
}

async down(): Promise<void> {
  await UserModel.collection.dropIndex('idx_field1_field2');
}
```

### 4. Collection Restructuring

```typescript
async up(): Promise<void> {
  // Create new collection
  await mongoose.connection.createCollection('new_collection');
  
  // Migrate data
  const docs = await OldModel.find();
  await NewModel.insertMany(docs.map(transformDoc));
  
  // Update references
  await RelatedModel.updateMany(
    {},
    [{ $set: { refField: { $toString: '$refField' } } }]
  );
}
```

## 🔒 Best Practices

### 1. Safety First

```typescript
// ✅ Always check if field exists before adding
await Model.updateMany(
  { newField: { $exists: false } },
  { $set: { newField: defaultValue } }
);

// ✅ Use transactions for multi-step operations
await mongoose.connection.transaction(async (session) => {
  await Model1.updateMany({}, update1, { session });
  await Model2.updateMany({}, update2, { session });
});
```

### 2. Backward Compatibility

```typescript
// ✅ Handle both old and new field formats
const query = {
  $or: [
    { oldField: value },
    { newField: value }
  ]
};
```

### 3. Performance Considerations

```typescript
// ✅ Process large datasets in batches
const batchSize = 1000;
let skip = 0;

while (true) {
  const batch = await Model.find().skip(skip).limit(batchSize);
  if (batch.length === 0) break;
  
  // Process batch
  for (const doc of batch) {
    await processDocument(doc);
  }
  
  skip += batchSize;
}
```

### 4. Validation and Testing

```typescript
async up(): Promise<void> {
  // Validate preconditions
  const existingCount = await Model.countDocuments({ newField: { $exists: true } });
  if (existingCount > 0) {
    throw new Error('Migration already partially applied');
  }

  // Apply migration
  const result = await Model.updateMany(/* ... */);
  
  // Validate results
  const updatedCount = await Model.countDocuments({ newField: { $exists: true } });
  console.log(`Updated ${updatedCount} documents`);
}
```

## 🚨 Production Deployment Strategy

### 1. Blue-Green Deployment

```bash
# 1. Deploy new code (blue) without running migrations
# 2. Test that old schema works with new code
# 3. Run migrations
npm run migrate
# 4. Switch traffic to blue environment
# 5. Monitor and rollback if needed
```

### 2. Rolling Deployment

```bash
# 1. Ensure migrations are backward compatible
# 2. Deploy code gradually
# 3. Run migrations during low traffic
npm run migrate
# 4. Monitor application health
```

### 3. Maintenance Window

```bash
# 1. Schedule maintenance window
# 2. Put application in maintenance mode
# 3. Run migrations
npm run migrate
# 4. Test thoroughly
# 5. Remove maintenance mode
```

## 🔄 Rollback Procedures

### Emergency Rollback

```bash
# Check which migrations to rollback
npm run migrate:status

# Rollback specific migration
npm run migrate:rollback 1.2.0

# Verify data integrity
npm run migrate:status
```

### Manual Rollback

If automated rollback fails:

```javascript
// Connect to MongoDB directly
use humanet_production;

// Restore from backup
// ... manual data restoration

// Update migration status
db.migrations.updateOne(
  { version: "1.2.0" },
  { $set: { status: "rolled_back" } }
);
```

## 📊 Monitoring and Logging

### Migration Status Dashboard

```bash
# Get detailed status
npm run migrate:status

# Example output:
# COMPLETED  | 1.0.1    | AddEmailVerification     | 2024-01-15 (1250ms)
# COMPLETED  | 1.1.0    | EnhanceUserModel         | 2024-01-16 (5430ms)
# FAILED     | 1.2.0    | AddIdeaFamilyTree        | 2024-01-17 (890ms)
#            Error: Connection timeout
```

### Logging Integration

```typescript
import { logger } from '../utils/logger.js';

async up(): Promise<void> {
  logger.info('Starting AddEmailVerification migration');
  
  try {
    // Migration logic
    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Migration failed', { error, version: this.version });
    throw error;
  }
}
```

## 🎯 Migration Checklist

Before deploying migrations:

- [ ] **Tested locally** with production-like data
- [ ] **Backup created** of production database
- [ ] **Rollback procedure** tested and documented
- [ ] **Performance impact** estimated and acceptable
- [ ] **Backward compatibility** verified
- [ ] **Team notified** of deployment window
- [ ] **Monitoring** set up for migration execution
- [ ] **Validation queries** prepared to verify success

## 📚 Example Migration Scenarios

See the following example migrations:
- `001-add-email-verification.ts` - Adding new fields
- `002-enhance-user-model.ts` - Complex data transformation
- `003-add-idea-family-tree.ts` - Relationship building and indexes

Each example demonstrates different patterns and best practices for safe schema evolution.