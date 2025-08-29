#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DummyDataGenerator } = require('../utils/dummyDataGenerator');

// Configuration options
const config = {
  default: {
    ideasCount: 25,
    activitiesCount: 150,
    seedDate: new Date('2025-01-01'),
    maxAge: 180, // days
  },
  minimal: {
    ideasCount: 10,
    activitiesCount: 50,
    seedDate: new Date('2025-03-01'),
    maxAge: 90,
  },
  extensive: {
    ideasCount: 50,
    activitiesCount: 300,
    seedDate: new Date('2024-06-01'),
    maxAge: 365,
  },
  testing: {
    ideasCount: 5,
    activitiesCount: 20,
    seedDate: new Date('2025-06-01'),
    maxAge: 30,
  },
};

// Parse command line arguments
const args = process.argv.slice(2);
const presetName = args[0] || 'default';
const customOptions = {};

// Parse additional arguments
for (let i = 1; i < args.length; i += 2) {
  const key = args[i]?.replace('--', '');
  const value = args[i + 1];

  if (key && value) {
    if (key === 'ideas' || key === 'activities') {
      customOptions[key === 'ideas' ? 'ideasCount' : 'activitiesCount'] =
        parseInt(value);
    } else if (key === 'maxAge') {
      customOptions.maxAge = parseInt(value);
    }
  }
}

// Function to inject dummy data
const injectDummyData = (preset = 'default', options = {}) => {
  const projectRoot = path.join(__dirname, '..');
  const ideasFilePath = path.join(projectRoot, 'ideas.json');
  const activitiesFilePath = path.join(projectRoot, 'user-activities.json');

  // Get configuration
  const baseConfig = config[preset] || config.default;
  const finalConfig = { ...baseConfig, ...options };

  console.log(`🚀 Injecting dummy data with preset: ${preset}`);
  console.log(`📊 Configuration:`, finalConfig);

  try {
    // Create generator
    const generator = new DummyDataGenerator(finalConfig);

    // Generate dataset
    console.log('⚡ Generating dataset...');
    const dataset = generator.generateDataset(finalConfig);

    // Check if files exist and backup if needed
    if (fs.existsSync(ideasFilePath)) {
      const backupPath = `${ideasFilePath}.backup.${Date.now()}`;
      fs.copyFileSync(ideasFilePath, backupPath);
      console.log(`📋 Backed up existing ideas to: ${backupPath}`);
    }

    if (fs.existsSync(activitiesFilePath)) {
      const backupPath = `${activitiesFilePath}.backup.${Date.now()}`;
      fs.copyFileSync(activitiesFilePath, backupPath);
      console.log(`📋 Backed up existing activities to: ${backupPath}`);
    }

    // Write new data
    console.log('💾 Writing ideas data...');
    fs.writeFileSync(ideasFilePath, JSON.stringify(dataset.ideas, null, 2));

    console.log('💾 Writing activities data...');
    fs.writeFileSync(
      activitiesFilePath,
      JSON.stringify(dataset.activities, null, 2)
    );

    // Write metadata
    const metaFilePath = path.join(projectRoot, 'dummy-data-meta.json');
    fs.writeFileSync(metaFilePath, JSON.stringify(dataset.meta, null, 2));

    console.log('\n🎉 Dummy data injection completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Preset: ${preset}`);
    console.log(`   Ideas: ${dataset.ideas.length}`);
    console.log(`   Activities: ${dataset.activities.length}`);
    console.log(`   Users: ${dataset.users.length}`);
    console.log(
      `   Total Views: ${dataset.ideas.reduce((sum, idea) => sum + idea.viewCount, 0)}`
    );
    console.log(
      `   Total Forks: ${dataset.ideas.reduce((sum, idea) => sum + idea.forkCount, 0)}`
    );
    console.log(`   Generated At: ${dataset.meta.generatedAt}`);

    // Show some sample data
    console.log('\n📋 Sample Ideas:');
    dataset.ideas.slice(0, 3).forEach((idea, idx) => {
      console.log(
        `   ${idx + 1}. ${idea.title} (${idea.viewCount} views, ${idea.forkCount} forks)`
      );
    });

    console.log('\n📋 Recent Activities:');
    dataset.activities.slice(0, 5).forEach((activity, idx) => {
      console.log(
        `   ${idx + 1}. ${activity.username} ${activity.action} - ${activity.timestamp}`
      );
    });

    console.log('\n✅ Data files created:');
    console.log(`   • ${ideasFilePath}`);
    console.log(`   • ${activitiesFilePath}`);
    console.log(`   • ${metaFilePath}`);
  } catch (error) {
    console.error('❌ Error injecting dummy data:', error);
    process.exit(1);
  }
};

// Function to show available presets
const showPresets = () => {
  console.log('\n📋 Available presets:');
  Object.entries(config).forEach(([name, conf]) => {
    console.log(`   ${name}:`);
    console.log(`     Ideas: ${conf.ideasCount}`);
    console.log(`     Activities: ${conf.activitiesCount}`);
    console.log(`     Max Age: ${conf.maxAge} days`);
    console.log();
  });
};

// Function to show help
const showHelp = () => {
  console.log('\n📖 HumaNet Enhanced Dummy Data Injection');
  console.log('\nUsage:');
  console.log(
    '  node scripts/inject-dummy-data-enhanced.js [preset] [options]'
  );
  console.log('\nPresets:');
  console.log('  default   - 25 ideas, 150 activities (default)');
  console.log('  minimal   - 10 ideas, 50 activities');
  console.log('  extensive - 50 ideas, 300 activities');
  console.log('  testing   - 5 ideas, 20 activities');
  console.log('\nOptions:');
  console.log('  --ideas <count>      Number of ideas to generate');
  console.log('  --activities <count> Number of activities to generate');
  console.log('  --maxAge <days>      Maximum age of generated data in days');
  console.log('\nExamples:');
  console.log('  node scripts/inject-dummy-data-enhanced.js');
  console.log('  node scripts/inject-dummy-data-enhanced.js extensive');
  console.log(
    '  node scripts/inject-dummy-data-enhanced.js default --ideas 30 --activities 200'
  );
  console.log(
    '  node scripts/inject-dummy-data-enhanced.js testing --maxAge 7'
  );
  console.log('\nOther commands:');
  console.log('  --help     Show this help');
  console.log('  --presets  Show available presets');
};

// Main execution
if (require.main === module) {
  if (args.includes('--help')) {
    showHelp();
  } else if (args.includes('--presets')) {
    showPresets();
  } else {
    injectDummyData(presetName, customOptions);
  }
}

module.exports = {
  injectDummyData,
  config,
};
