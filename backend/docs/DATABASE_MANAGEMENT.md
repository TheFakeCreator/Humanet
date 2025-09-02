# Database Management Documentation

This documentation covers the comprehensive database management tools available for the Humanet project, including seeding, backup/restore, analysis, and maintenance utilities.

## 🌱 Database Seeding

The seeding system provides realistic test data for development and testing environments.

### Quick Start

```bash
# Seed with default medium dataset
npm run seed

# Clear database and seed with fresh data
npm run seed:clear

# Seed with specific data sizes
npm run seed:small    # ~50 users, ~200 ideas, ~800 comments
npm run seed:medium   # ~200 users, ~1000 ideas, ~4000 comments  
npm run seed:large    # ~1000 users, ~5000 ideas, ~20000 comments

# Production-safe seeding (minimal realistic data)
npm run seed:production
```

### Seeding Features

- **Realistic Data**: Uses authentic-looking usernames, domains, and content
- **Relationship Building**: Creates proper user-idea-comment relationships
- **Fork Trees**: Generates idea fork hierarchies with realistic depths
- **Edge Cases**: Includes boundary testing data (max lengths, special characters)
- **Performance Data**: Creates viral ideas and deep comment threads for testing
- **Configurable Sizes**: From small development datasets to large performance tests
- **Safety Checks**: Prevents accidental data loss with confirmation prompts

### Seeding Data Structure

**Users**: Realistic profiles with varied karma, skills, and bio content
- Tech professionals with industry-appropriate usernames
- Distributed karma scores from newcomers to experts
- Varied profile completion (some with bios, some minimal)

**Ideas**: Covering major technology domains
- AI/ML, Web Development, Mobile, Data Science, DevOps, etc.
- Fork relationships creating family trees
- Realistic upvote distributions (few viral ideas, many modest ones)
- Varied content lengths and complexity

**Comments**: Engaging discussions and feedback
- Technical discussions and constructive feedback
- Varied engagement levels across ideas
- Realistic comment lengths and depth

## 💾 Database Backup & Restore

Comprehensive backup and restore functionality for data safety and environment management.

### Backup Operations

```bash
# Create backup with timestamp
npm run db:backup

# Create backup to specific location
npm run db:backup -- --output=./backups/my-backup.json
```

**Backup Features**:
- Complete data export (users, ideas, comments)
- Metadata tracking (timestamp, environment, version)
- Readable JSON format for inspection
- Size and statistics reporting

### Restore Operations

```bash
# Restore from backup (preserves existing data)
npm run db:restore -- --input=./backup-2024-01-15.json

# Clear database and restore (full replacement)
npm run db:restore -- --input=./backup-2024-01-15.json --clear
```

**Restore Features**:
- Selective or complete restoration
- Conflict handling for existing data
- Validation and error reporting
- Progress tracking and statistics

## 📊 Database Analysis

Comprehensive database analysis for insights and monitoring.

### Analysis Commands

```bash
# Analyze current database state
npm run db:analyze

# Export analysis to JSON file
npm run db:export-stats

# Export to specific location
npm run db:export-stats -- --output=./reports/stats-2024-01-15.json
```

### Analysis Reports

**User Analytics**:
- Total users and activity levels
- Profile completion rates (bio, skills)
- Karma distribution and top contributors
- User engagement patterns

**Idea Analytics**:
- Total ideas, root vs forked breakdown
- Upvote statistics and viral content identification
- Domain distribution across technology areas
- Fork depth analysis and family tree complexity

**Comment Analytics**:
- Engagement rates and comment volume
- Active community members
- Discussion quality indicators

**Relationship Analytics**:
- Cross-collection relationships
- Content authorship patterns
- Community interaction health

### Sample Analysis Output

```
📈 Database Analysis Report
============================

👥 Users:
   Total: 847
   With Bio: 623 (74%)
   With Skills: 791 (93%)
   Average Karma: 156.8

🏆 Top Users by Karma:
   1. alex_dev (892 karma)
   2. sarah_ml (734 karma)
   3. mike_data (673 karma)

💡 Ideas:
   Total: 3,421
   Root Ideas: 2,156 (63%)
   Forked Ideas: 1,265 (37%)
   Total Upvotes: 18,947
   Average Upvotes: 5.54

🔥 Most Upvoted Ideas:
   1. Revolutionary AI chatbot architecture... (127 upvotes, by alex_dev)
   2. Decentralized social media platform... (89 upvotes, by sarah_ml)

🏷️ Top Domains:
   1. Artificial Intelligence: 1,247 ideas
   2. Web Development: 823 ideas
   3. Mobile Development: 567 ideas
```

## 🧹 Database Maintenance

Automated cleanup and maintenance tools for database health.

### Cleanup Operations

```bash
# Analyze cleanup opportunities (safe preview)
npm run db:cleanup:dry

# Perform actual cleanup
npm run db:cleanup
```

**Cleanup Features**:
- **Orphaned Data Detection**: Finds comments without valid idea references
- **Invalid References**: Identifies and fixes broken parent-child relationships
- **Duplicate Cleanup**: Removes duplicate upvotes and other duplicated data
- **Inactive Users**: Identifies users with no activity (optional cleanup)
- **Dry Run Mode**: Preview changes before executing

### Migration System

```bash
# Run database migrations
npm run db:migrate
```

**Migration Capabilities**:
- Schema updates and field additions
- Data transformation and normalization
- Index optimization
- Backward compatibility maintenance

### Maintenance Best Practices

1. **Regular Backups**: Schedule daily backups for production
2. **Analysis Monitoring**: Weekly analysis reports for health tracking
3. **Cleanup Scheduling**: Monthly cleanup runs (with dry-run first)
4. **Migration Testing**: Test migrations on backup data first

## 🔧 Advanced Usage

### Custom Seeding Configurations

You can modify the seeding script to create custom datasets:

```typescript
// In scripts/seed.ts
const customConfig = {
  users: 100,
  ideas: 500,
  comments: 2000,
  domains: ['Custom Domain 1', 'Custom Domain 2'],
  // ... other options
};
```

### Backup Automation

For production environments, consider automated backup scripts:

```bash
#!/bin/bash
# backup-cron.sh
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
npm run db:backup -- --output="./backups/auto-backup-$DATE.json"

# Keep only last 30 days of backups
find ./backups -name "auto-backup-*.json" -mtime +30 -delete
```

### Analysis Integration

Integrate analysis data into monitoring systems:

```typescript
import DatabaseUtils from './scripts/db-utils.js';

const utils = new DatabaseUtils();
await utils.connect();
const stats = await utils.analyze();

// Send to monitoring service
await monitoringService.sendMetrics({
  totalUsers: stats.users.total,
  totalIdeas: stats.ideas.total,
  avgUpvotes: stats.ideas.avgUpvotes
});
```

## 🚨 Safety Guidelines

### Before Production Operations

1. **Always backup first**: Create a backup before any destructive operation
2. **Test in staging**: Run operations in staging environment first
3. **Use dry-run**: Preview cleanup operations before execution
4. **Verify connectivity**: Ensure stable database connection
5. **Monitor performance**: Watch system resources during large operations

### Recovery Procedures

If something goes wrong:

1. **Stop operations**: Cancel any running scripts immediately
2. **Assess damage**: Use analysis tools to understand current state
3. **Restore from backup**: Use the most recent valid backup
4. **Verify restoration**: Run analysis to confirm data integrity
5. **Document incident**: Record what happened for future prevention

## 📋 Troubleshooting

### Common Issues

**Connection Errors**:
```bash
# Check MongoDB connection
mongo --eval "db.runCommand('ping')"

# Verify environment variables
echo $MONGO_URL
```

**Permission Issues**:
```bash
# Ensure write permissions for backup directory
chmod 755 ./backups/

# Check disk space
df -h
```

**Large Dataset Performance**:
- Use `--limit` flags for large operations
- Run during low-traffic periods
- Monitor system resources
- Consider chunked processing for very large datasets

### Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify database connectivity and permissions
3. Ensure sufficient disk space for backups
4. Review the database logs for additional context
5. Use the dry-run modes to test operations safely

---

This comprehensive database management system ensures your Humanet data is safe, well-maintained, and properly monitored throughout development and production.
