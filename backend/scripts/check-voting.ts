#!/usr/bin/env tsx
/**
 * Utility script to check and fix adoption requests that should have voting active
 */

import mongoose from 'mongoose';
import { IdeaModel } from '../src/models/idea.model.js';
import { AdoptionRequestModel } from '../src/models/adoption-request.model.js';
import config from '../src/config/index.js';

async function connect() {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function checkVotingEligibility() {
  console.log('🔍 Checking for ideas that should have voting active...\n');

  // Find all ideas that are seeking adopters
  const ideas = await IdeaModel.find({
    ownershipType: 'seeking_adopter',
    adoptionStatus: 'available',
  }).select('_id title activeVoting');

  let issuesFound = 0;

  for (const idea of ideas) {
    // Count pending adoption requests for this idea
    const pendingRequestsCount = await AdoptionRequestModel.countDocuments({
      ideaId: idea._id,
      status: 'pending',
    });

    if (pendingRequestsCount >= 3 && !idea.activeVoting) {
      console.log(`⚠️  ISSUE FOUND:`);
      console.log(`   Idea: ${idea.title}`);
      console.log(`   ID: ${idea._id}`);
      console.log(`   Pending Requests: ${pendingRequestsCount}`);
      console.log(`   Active Voting: ${idea.activeVoting ? 'Yes' : 'No'}`);
      console.log(`   → Should have voting active but doesn't!\n`);
      issuesFound++;
    } else if (pendingRequestsCount >= 2) {
      console.log(`ℹ️  Idea: ${idea.title}`);
      console.log(`   Pending Requests: ${pendingRequestsCount}`);
      console.log(`   Active Voting: ${idea.activeVoting ? 'Yes' : 'No'}`);
      console.log(`   → Ready for voting (manual trigger available)\n`);
    }
  }

  if (issuesFound === 0) {
    console.log('✅ No voting issues found. All ideas with 3+ requests have voting active.');
  } else {
    console.log(`❌ Found ${issuesFound} ideas that should have voting active.`);
    console.log('💡 Use the manual trigger voting API endpoint to fix these issues.');
  }
}

async function listIdeasWithMultipleRequests() {
  console.log('\n📊 Summary of all ideas with multiple adoption requests:\n');

  const ideasWithRequests = await IdeaModel.aggregate([
    {
      $lookup: {
        from: 'adoptionrequests',
        localField: '_id',
        foreignField: 'ideaId',
        as: 'requests',
      },
    },
    {
      $addFields: {
        pendingRequestsCount: {
          $size: {
            $filter: {
              input: '$requests',
              cond: { $eq: ['$$this.status', 'pending'] },
            },
          },
        },
      },
    },
    {
      $match: {
        pendingRequestsCount: { $gte: 2 },
      },
    },
    {
      $project: {
        title: 1,
        pendingRequestsCount: 1,
        activeVoting: 1,
        ownershipType: 1,
        adoptionStatus: 1,
      },
    },
    {
      $sort: { pendingRequestsCount: -1 },
    },
  ]);

  if (ideasWithRequests.length === 0) {
    console.log('No ideas found with 2+ adoption requests.');
    return;
  }

  console.log(`Found ${ideasWithRequests.length} ideas with multiple adoption requests:\n`);

  ideasWithRequests.forEach((idea, index) => {
    const status = idea.activeVoting ? '🗳️  VOTING ACTIVE' : '⏳ No voting';
    console.log(`${index + 1}. ${idea.title}`);
    console.log(`   Requests: ${idea.pendingRequestsCount} | Status: ${status}`);
    console.log(`   ID: ${idea._id}`);
    console.log('');
  });
}

async function main() {
  console.log('🔧 Adoption Request Voting Diagnostic Tool');
  console.log('==========================================\n');

  await connect();
  await checkVotingEligibility();
  await listIdeasWithMultipleRequests();

  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB');
}

// Run the script
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`!) {
  main().catch(console.error);
}

export default main;
