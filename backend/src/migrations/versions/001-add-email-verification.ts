/**
 * Example Migration: Add email verification fields to User model
 * Version: 1.0.1
 * 
 * This migration demonstrates adding new fields to existing documents
 */

import { BaseMigration } from '../migration-system.js';
import { UserModel } from '../../models/user.model.js';

export class AddEmailVerificationMigration extends BaseMigration {
  version = '1.0.1';
  name = 'AddEmailVerification';
  description = 'Add email verification fields to existing users';

  async up(): Promise<void> {
    console.log('Adding email verification fields to users...');
    
    // Update all existing users to have email verification fields
    const result = await UserModel.updateMany(
      { 
        emailVerified: { $exists: false }
      },
      {
        $set: {
          emailVerified: false,
          // Don't set verification token for existing users
          // They'll get it when they request verification
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users with email verification fields`);

    // Add index for email verification token
    await UserModel.collection.createIndex(
      { emailVerificationToken: 1 },
      { sparse: true, name: 'idx_email_verification_token' }
    );
  }

  async down(): Promise<void> {
    console.log('Removing email verification fields from users...');
    
    // Remove the fields
    await UserModel.updateMany(
      {},
      {
        $unset: {
          emailVerified: '',
          emailVerificationToken: '',
          emailVerificationExpires: ''
        }
      }
    );

    // Drop the index
    try {
      await UserModel.collection.dropIndex('idx_email_verification_token');
    } catch (error) {
      console.warn('Index idx_email_verification_token not found, skipping drop');
    }
  }
}