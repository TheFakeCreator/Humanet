#!/usr/bin/env tsx
/**
 * Fix corrupted voting data and properly re-initialize voting
 */

import mongoose from 'mongoose';
import { IdeaModel, AdoptionRequestModel } from '../src/models/index.js';
import config from '../src/config/index.js';

async function fixVotingData() {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Find the specific idea
    const ideaId = '68eb7bb812cae3196dc78cfc';
    const idea = await IdeaModel.findById(ideaId);

    if (!idea) {
      console.log('❌ Idea not found');
      return;
    }

    console.log('\n🔍 Current State:');
    console.log('Title:', idea.title);
    console.log('Active Voting exists:', !!idea.activeVoting);

    // Get all pending adoption requests for this idea
    const adoptionRequests = await AdoptionRequestModel.find({
      ideaId: ideaId,
      status: 'pending',
    });

    console.log('📋 Pending adoption requests:', adoptionRequests.length);

    if (adoptionRequests.length >= 3) {
      // Re-initialize voting properly
      const votingDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
      const votingEndsAt = new Date(Date.now() + votingDuration);
      const candidateRequestIds = adoptionRequests.map((req) => req._id);

      console.log('\n🔧 Fixing voting data...');
      console.log('Candidate request IDs:', candidateRequestIds);
      console.log('Voting ends at:', votingEndsAt);

      // Update idea with correct voting structure
      const result = await IdeaModel.findByIdAndUpdate(
        ideaId,
        {
          adoptionStatus: 'pending',
          activeVoting: {
            candidateRequestIds: candidateRequestIds,
            votes: [],
            votingEndsAt: votingEndsAt,
            startedAt: new Date(),
            description: 'Community voting to select the best adopter for this idea',
          },
        },
        { new: true }
      );

      console.log('✅ Voting data fixed successfully!');
      console.log('New voting ends at:', result?.activeVoting?.votingEndsAt);
      console.log('Candidate count:', result?.activeVoting?.candidateRequestIds?.length);
    } else {
      console.log('❌ Not enough adoption requests to enable voting');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the fix
fixVotingData().catch(console.error);
