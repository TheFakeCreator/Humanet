#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DummyDataGenerator } = require('../utils/dummyDataGenerator');

// File paths
const projectRoot = path.join(__dirname, '..');
const ideasFilePath = path.join(projectRoot, 'ideas.json');
const activitiesFilePath = path.join(projectRoot, 'user-activities.json');
const metaFilePath = path.join(projectRoot, 'dummy-data-meta.json');
const backupDir = path.join(projectRoot, 'backups');

// Utility functions
const ensureBackupDir = () => {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
};

const createBackup = filePath => {
  if (fs.existsSync(filePath)) {
    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${fileName}.${timestamp}.backup`);
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }
  return null;
};

const getFileStats = filePath => {
  if (!fs.existsSync(filePath)) return null;

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      exists: true,
      size: fs.statSync(filePath).size,
      itemCount: Array.isArray(data) ? data.length : Object.keys(data).length,
      lastModified: fs.statSync(filePath).mtime,
    };
  } catch (error) {
    return {
      exists: true,
      size: fs.statSync(filePath).size,
      itemCount: 'unknown',
      lastModified: fs.statSync(filePath).mtime,
      error: error.message,
    };
  }
};

// Commands
const commands = {
  status: () => {
    console.log('📊 HumaNet Data Status\n');

    const files = [
      { name: 'Ideas', path: ideasFilePath },
      { name: 'Activities', path: activitiesFilePath },
      { name: 'Metadata', path: metaFilePath },
    ];

    files.forEach(file => {
      const stats = getFileStats(file.path);
      if (stats) {
        console.log(`${file.name}:`);
        console.log(`  File: ${file.path}`);
        console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`  Items: ${stats.itemCount}`);
        console.log(`  Modified: ${stats.lastModified.toISOString()}`);
        if (stats.error) {
          console.log(`  Error: ${stats.error}`);
        }
      } else {
        console.log(`${file.name}: Not found`);
      }
      console.log();
    });

    // Show backups
    if (fs.existsSync(backupDir)) {
      const backups = fs
        .readdirSync(backupDir)
        .filter(f => f.endsWith('.backup'));
      console.log(`Backups: ${backups.length} files in ${backupDir}`);
      if (backups.length > 0) {
        console.log('Recent backups:');
        backups.slice(-5).forEach(backup => {
          const stats = fs.statSync(path.join(backupDir, backup));
          console.log(`  ${backup} (${stats.mtime.toLocaleString()})`);
        });
      }
    }
  },

  backup: () => {
    console.log('💾 Creating backup...\n');
    ensureBackupDir();

    const files = [ideasFilePath, activitiesFilePath, metaFilePath];
    const backups = [];

    files.forEach(filePath => {
      const backupPath = createBackup(filePath);
      if (backupPath) {
        backups.push(backupPath);
        console.log(
          `✅ Backed up: ${path.basename(filePath)} -> ${path.basename(backupPath)}`
        );
      }
    });

    if (backups.length > 0) {
      console.log(`\n📋 ${backups.length} files backed up to ${backupDir}`);
    } else {
      console.log('⚠️  No files to backup');
    }
  },

  clear: () => {
    console.log('🗑️  Clearing data...\n');

    // Create backup before clearing
    commands.backup();

    const files = [ideasFilePath, activitiesFilePath, metaFilePath];
    let cleared = 0;

    files.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        cleared++;
        console.log(`✅ Removed: ${path.basename(filePath)}`);
      }
    });

    console.log(`\n🗑️  Cleared ${cleared} files`);
  },

  restore: backupName => {
    if (!backupName) {
      console.log('❌ Please specify a backup to restore');
      console.log('Usage: node scripts/data-manager.js restore <backup-name>');
      return;
    }

    const backupPath = path.join(backupDir, backupName);
    if (!fs.existsSync(backupPath)) {
      console.log(`❌ Backup not found: ${backupPath}`);
      return;
    }

    console.log(`📥 Restoring from backup: ${backupName}\n`);

    // Create backup of current state
    commands.backup();

    // Determine target file
    let targetPath;
    if (backupName.includes('ideas.json')) {
      targetPath = ideasFilePath;
    } else if (backupName.includes('user-activities.json')) {
      targetPath = activitiesFilePath;
    } else if (backupName.includes('dummy-data-meta.json')) {
      targetPath = metaFilePath;
    } else {
      console.log('❌ Cannot determine target file from backup name');
      return;
    }

    fs.copyFileSync(backupPath, targetPath);
    console.log(`✅ Restored: ${path.basename(targetPath)}`);
  },

  generate: (preset = 'default', options = {}) => {
    console.log(`🔄 Generating new data with preset: ${preset}\n`);

    const presets = {
      minimal: { ideasCount: 10, activitiesCount: 50 },
      default: { ideasCount: 25, activitiesCount: 150 },
      extensive: { ideasCount: 50, activitiesCount: 300 },
      testing: { ideasCount: 5, activitiesCount: 20 },
    };

    const config = presets[preset] || presets.default;
    const finalConfig = { ...config, ...options };

    // Create backup
    commands.backup();

    // Generate new data
    const generator = new DummyDataGenerator(finalConfig);
    const dataset = generator.generateDataset(finalConfig);

    // Write files
    fs.writeFileSync(ideasFilePath, JSON.stringify(dataset.ideas, null, 2));
    fs.writeFileSync(
      activitiesFilePath,
      JSON.stringify(dataset.activities, null, 2)
    );
    fs.writeFileSync(metaFilePath, JSON.stringify(dataset.meta, null, 2));

    console.log('✅ Generated new dataset:');
    console.log(`   Ideas: ${dataset.ideas.length}`);
    console.log(`   Activities: ${dataset.activities.length}`);
    console.log(`   Users: ${dataset.users.length}`);
  },

  analyze: () => {
    console.log('📈 Data Analysis\n');

    const ideasStats = getFileStats(ideasFilePath);
    const activitiesStats = getFileStats(activitiesFilePath);

    if (!ideasStats || !activitiesStats) {
      console.log('❌ Data files not found');
      return;
    }

    try {
      const ideas = JSON.parse(fs.readFileSync(ideasFilePath, 'utf8'));
      const activities = JSON.parse(
        fs.readFileSync(activitiesFilePath, 'utf8')
      );

      // Ideas analysis
      console.log('💡 Ideas Analysis:');
      const totalViews = ideas.reduce((sum, idea) => sum + idea.viewCount, 0);
      const totalForks = ideas.reduce((sum, idea) => sum + idea.forkCount, 0);
      const statusCounts = ideas.reduce((acc, idea) => {
        acc[idea.status] = (acc[idea.status] || 0) + 1;
        return acc;
      }, {});

      console.log(`   Total Ideas: ${ideas.length}`);
      console.log(`   Total Views: ${totalViews}`);
      console.log(`   Total Forks: ${totalForks}`);
      console.log(
        `   Average Views: ${(totalViews / ideas.length).toFixed(1)}`
      );
      console.log(
        `   Average Forks: ${(totalForks / ideas.length).toFixed(1)}`
      );
      console.log(`   Status Distribution:`);
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(
          `     ${status}: ${count} (${((count / ideas.length) * 100).toFixed(1)}%)`
        );
      });

      // Top ideas
      const topIdeas = ideas
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);
      console.log('\n   Top 5 Ideas by Views:');
      topIdeas.forEach((idea, idx) => {
        console.log(`     ${idx + 1}. ${idea.title} (${idea.viewCount} views)`);
      });

      // Activities analysis
      console.log('\n📊 Activities Analysis:');
      const actionCounts = activities.reduce((acc, activity) => {
        acc[activity.action] = (acc[activity.action] || 0) + 1;
        return acc;
      }, {});

      console.log(`   Total Activities: ${activities.length}`);
      console.log(`   Action Distribution:`);
      Object.entries(actionCounts).forEach(([action, count]) => {
        console.log(
          `     ${action}: ${count} (${((count / activities.length) * 100).toFixed(1)}%)`
        );
      });

      // User activity
      const userCounts = activities.reduce((acc, activity) => {
        acc[activity.username] = (acc[activity.username] || 0) + 1;
        return acc;
      }, {});

      const topUsers = Object.entries(userCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      console.log('\n   Top 5 Most Active Users:');
      topUsers.forEach(([username, count], idx) => {
        console.log(`     ${idx + 1}. ${username} (${count} activities)`);
      });
    } catch (error) {
      console.log(`❌ Error analyzing data: ${error.message}`);
    }
  },

  cleanup: () => {
    console.log('🧹 Cleaning up old backups...\n');

    if (!fs.existsSync(backupDir)) {
      console.log('No backup directory found');
      return;
    }

    const backups = fs
      .readdirSync(backupDir)
      .filter(f => f.endsWith('.backup'))
      .map(f => ({
        name: f,
        path: path.join(backupDir, f),
        stats: fs.statSync(path.join(backupDir, f)),
      }))
      .sort((a, b) => b.stats.mtime - a.stats.mtime);

    if (backups.length <= 5) {
      console.log(`Only ${backups.length} backups found, no cleanup needed`);
      return;
    }

    const toDelete = backups.slice(5);
    toDelete.forEach(backup => {
      fs.unlinkSync(backup.path);
      console.log(`🗑️  Removed old backup: ${backup.name}`);
    });

    console.log(
      `\n✅ Cleaned up ${toDelete.length} old backups, kept ${backups.length - toDelete.length} recent ones`
    );
  },

  help: () => {
    console.log('📖 HumaNet Data Manager\n');
    console.log('Usage: node scripts/data-manager.js <command> [options]\n');
    console.log('Commands:');
    console.log('  status              Show current data status');
    console.log('  backup              Create backup of current data');
    console.log('  clear               Clear all data (creates backup first)');
    console.log('  restore <backup>    Restore from a specific backup');
    console.log('  generate [preset]   Generate new dummy data');
    console.log('  analyze             Analyze current data');
    console.log(
      '  cleanup             Clean up old backups (keep 5 most recent)'
    );
    console.log('  help                Show this help\n');
    console.log('Generate presets:');
    console.log('  minimal    - 10 ideas, 50 activities');
    console.log('  default    - 25 ideas, 150 activities');
    console.log('  extensive  - 50 ideas, 300 activities');
    console.log('  testing    - 5 ideas, 20 activities\n');
    console.log('Examples:');
    console.log('  node scripts/data-manager.js status');
    console.log('  node scripts/data-manager.js generate extensive');
    console.log(
      '  node scripts/data-manager.js restore ideas.json.2025-01-01T12-00-00-000Z.backup'
    );
  },
};

// Main execution
const command = process.argv[2];
const args = process.argv.slice(3);

if (command && commands[command]) {
  commands[command](...args);
} else {
  commands.help();
}

module.exports = commands;
