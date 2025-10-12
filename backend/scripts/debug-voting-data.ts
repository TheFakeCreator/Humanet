#!/usr/bin/env tsx
/**
 * Debug script to check the exact structure of voting data in the database
 */

import mongoose from 'mongoose';
import { IdeaModel } from '../src/models/index.js';
import config from '../src/config/index.js';

async function debugVotingData() {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Find the specific idea
    const ideaId = '68eb7bb812cae3196dc78cfc';
    const idea = await IdeaModel.findById(ideaId).lean();

    if (!idea) {
      console.log('❌ Idea not found');
      return;
    }

    console.log('\n🔍 Raw Idea Data Structure:');
    console.log('Title:', idea.title);
    console.log('Active Voting exists:', !!idea.activeVoting);

    if (idea.activeVoting) {
      console.log('\n📊 Active Voting Structure:');
      console.log(JSON.stringify(idea.activeVoting, null, 2));

      console.log('\n🔑 Active Voting Properties:');
      console.log('- votingEndsAt:', idea.activeVoting.votingEndsAt);
      console.log('- votingEndsAt type:', typeof idea.activeVoting.votingEndsAt);
      console.log('- candidateRequestIds:', idea.activeVoting.candidateRequestIds);
      console.log('- votes length:', idea.activeVoting.votes?.length || 0);
    } else {
      console.log('❌ No activeVoting field found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the debug
debugVotingData().catch(console.error);
