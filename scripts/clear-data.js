const fs = require('fs');
const path = require('path');

// Function to clear all data
const clearData = () => {
  const projectRoot = path.join(__dirname, '..', '..');
  const ideasFilePath = path.join(projectRoot, 'ideas.json');
  const activitiesFilePath = path.join(projectRoot, 'user-activities.json');

  try {
    console.log('🧹 Clearing all data...');

    // Clear ideas
    if (fs.existsSync(ideasFilePath)) {
      fs.writeFileSync(ideasFilePath, JSON.stringify([], null, 2));
      console.log('✅ Ideas cleared');
    }

    // Clear activities
    if (fs.existsSync(activitiesFilePath)) {
      fs.writeFileSync(activitiesFilePath, JSON.stringify([], null, 2));
      console.log('✅ Activities cleared');
    }

    console.log('\n🎉 Data clearing completed successfully!');
    console.log('All ideas and activities have been removed.');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
};

// Run the clearing if this script is executed directly
if (require.main === module) {
  clearData();
}

module.exports = {
  clearData,
};
