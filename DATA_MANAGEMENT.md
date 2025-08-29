# HumaNet Enhanced Data Management

This document describes the enhanced dummy data injection and management system for HumaNet prototyping.

## Overview

The enhanced data management system provides:

- **Configurable dummy data generation** with realistic, varied content
- **Multiple data presets** for different testing scenarios
- **Backup and restore functionality** for safe data management
- **Data analysis tools** for understanding your dataset
- **Both CLI and UI interfaces** for maximum flexibility

## Data Presets

### Available Presets

| Preset      | Ideas | Activities | Description                            |
| ----------- | ----- | ---------- | -------------------------------------- |
| `minimal`   | 10    | 50         | Perfect for quick testing              |
| `default`   | 25    | 150        | Balanced dataset for demos             |
| `extensive` | 50    | 300        | Rich dataset for comprehensive testing |
| `testing`   | 5     | 20         | Minimal data for unit testing          |

## CLI Tools

### Basic Commands

```bash
# Quick start with default preset
npm run inject-data

# Use enhanced generator with preset
npm run inject-enhanced [preset]

# Clear all data (with backup)
npm run clear-data

# Reset to fresh data
npm run reset-data

# Show current data status
npm run data-status

# Analyze current data
npm run data-analyze

# Create backup
npm run data-backup

# Clean up old backups
npm run data-cleanup
```

### Advanced Data Manager

```bash
# Access the full data manager
npm run data-manager <command> [options]

# Available commands:
npm run data-manager status              # Show current data status
npm run data-manager backup              # Create backup
npm run data-manager clear               # Clear all data
npm run data-manager generate [preset]   # Generate new data
npm run data-manager analyze             # Analyze current data
npm run data-manager cleanup             # Clean up old backups
npm run data-manager help                # Show help
```

### Enhanced Injection Examples

```bash
# Use different presets
node scripts/inject-dummy-data-enhanced.js minimal
node scripts/inject-dummy-data-enhanced.js extensive

# Custom configuration
node scripts/inject-dummy-data-enhanced.js default --ideas 30 --activities 200

# Testing with recent data only
node scripts/inject-dummy-data-enhanced.js testing --maxAge 7

# Show available options
node scripts/inject-dummy-data-enhanced.js --help
```

## UI Interface

Access the enhanced data manager through the web interface:

1. Start the development server: `npm run dev`
2. Navigate to the home page
3. Look for the **Enhanced Data Management** section
4. Use the intuitive interface to:
   - Select data presets
   - Inject data with real-time feedback
   - Analyze current data
   - View data statistics
   - Manage data safely

### UI Features

- **Real-time data statistics** showing current ideas, views, forks, and activities
- **Preset selection** with descriptions and data counts
- **Progress indicators** for long-running operations
- **Detailed analysis** with comprehensive statistics
- **Safe data management** with backup reminders
- **Comprehensive documentation** built into the interface

## File Structure

```
├── scripts/
│   ├── inject-dummy-data.js           # Original injection script
│   ├── inject-dummy-data-enhanced.js  # Enhanced injection with presets
│   ├── data-manager.js                # Comprehensive data management
│   └── clear-data.js                  # Safe data clearing
├── utils/
│   ├── dummyData.js                   # Original dummy data
│   └── dummyDataGenerator.js          # Enhanced data generator
├── apps/web/components/
│   └── DataManager.js                 # Enhanced UI component
├── backups/                           # Automatic backups (created as needed)
├── ideas.json                         # Main ideas data
├── user-activities.json               # User activities data
└── dummy-data-meta.json               # Generation metadata
```

## Features

### Enhanced Data Generation

- **Realistic content**: Titles, descriptions, and tags that make sense together
- **Varied engagement**: Realistic view and fork counts based on idea age
- **Temporal consistency**: Proper creation, update, and activity timestamps
- **Relationship modeling**: Forked ideas reference original ideas
- **Configurable parameters**: Customize data volume and characteristics

### Safe Data Management

- **Automatic backups**: Every destructive operation creates a backup
- **Backup rotation**: Keeps 5 most recent backups, cleans up older ones
- **Restore functionality**: Easily restore from any backup
- **Data validation**: Checks data integrity before operations
- **Error handling**: Graceful handling of data corruption or missing files

### Analytics and Insights

- **Data statistics**: Comprehensive overview of your dataset
- **Trend analysis**: View and fork patterns over time
- **User activity**: Most active users and action distributions
- **Quality metrics**: Average engagement and content distribution
- **Export capabilities**: Easy data export for external analysis

## Advanced Usage

### Custom Data Generation

```javascript
// Use the DummyDataGenerator directly
const { DummyDataGenerator } = require('./utils/dummyDataGenerator');

const generator = new DummyDataGenerator({
  seedDate: new Date('2024-01-01'),
  maxAge: 365,
  baseViewCount: 100,
  baseForkCount: 10,
});

const customDataset = generator.generateDataset({
  ideasCount: 40,
  activitiesCount: 200,
});
```

### Backup Management

```bash
# List all backups
ls -la backups/

# Restore specific backup
npm run data-manager restore ideas.json.2025-01-01T12-00-00-000Z.backup

# Manual backup before risky operations
npm run data-backup
```

### Data Analysis

```bash
# Detailed CLI analysis
npm run data-analyze

# Or use the data manager
npm run data-manager analyze

# Get raw statistics
npm run data-status
```

## Best Practices

### Development Workflow

1. **Start with minimal data** for quick iteration
2. **Use testing preset** for unit tests
3. **Switch to default preset** for feature demos
4. **Use extensive preset** for performance testing
5. **Backup before major changes**

### Data Management

1. **Always backup** before clearing data
2. **Use appropriate presets** for your testing needs
3. **Clean up old backups** regularly
4. **Monitor data quality** with analysis tools
5. **Document custom configurations**

### Performance Considerations

- **Extensive preset**: May slow down the UI with large datasets
- **Minimal preset**: Best for development and testing
- **Default preset**: Good balance for most use cases
- **Backup files**: Can accumulate over time, clean up regularly

## Troubleshooting

### Common Issues

**Data injection fails**

- Check if the API server is running
- Verify network connectivity
- Look for error messages in the console

**Backup/restore issues**

- Ensure you have write permissions
- Check available disk space
- Verify backup file integrity

**Large datasets slow**

- Use smaller presets for development
- Consider pagination for large datasets
- Monitor memory usage with extensive preset

### Getting Help

```bash
# Show help for any script
node scripts/inject-dummy-data-enhanced.js --help
node scripts/data-manager.js help

# Check current status
npm run data-status

# Analyze for issues
npm run data-analyze
```

## Migration from Original System

If you're upgrading from the original dummy data system:

1. **Backup existing data**: `npm run data-backup`
2. **Install new scripts**: Already included in package.json
3. **Test with minimal preset**: `npm run inject-enhanced minimal`
4. **Migrate to new UI**: The enhanced DataManager component is backward compatible
5. **Update workflows**: Replace old commands with new enhanced versions

The original scripts (`inject-dummy-data.js`) remain available for backward compatibility.

## Contributing

When adding new features to the data management system:

1. **Extend the generator**: Add new content pools or generation logic
2. **Update presets**: Add new presets for specific use cases
3. **Enhance UI**: Add new controls or visualizations
4. **Add CLI commands**: Extend the data manager with new operations
5. **Update documentation**: Keep this README current

## Future Enhancements

Potential improvements:

- **Real-time data sync** between multiple instances
- **Custom data templates** for specific domains
- **Data export formats** (CSV, JSON, SQL)
- **Performance monitoring** for large datasets
- **Cloud backup support** for team collaboration
- **Data validation rules** for consistency checking
