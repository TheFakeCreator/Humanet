import crypto from 'crypto';
import { UserModel } from '../models/user.model.js';

export class EmailService {
  
  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    try {
      // Generate verification token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // 24 hours expiry

      // Save token to user
      await UserModel.findByIdAndUpdate(userId, {
        emailVerificationToken: token,
        emailVerificationExpires: expires
      });

      // Create verification URL
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

      // For development, just log the verification URL
      console.log(`\n📧 EMAIL VERIFICATION`);
      console.log(`To: ${email}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log(`Token expires in 24 hours\n`);

      // TODO: In production, implement actual email sending with SendGrid/Mailgun
      // await this.sendActualEmail(email, verificationUrl);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() }
      });

      if (!user) {
        return false;
      }

      // Mark email as verified
      await UserModel.findByIdAndUpdate(user._id, {
        emailVerified: true,
        $unset: {
          emailVerificationToken: '',
          emailVerificationExpires: ''
        }
      });

      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  }

  async resendVerificationEmail(email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ email, emailVerified: false });
      if (!user) {
        return false;
      }

      await this.sendVerificationEmail((user._id as any).toString(), email);
      return true;
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      return false;
    }
  }

  // TODO: Implement actual email sending in production
  // private async sendActualEmail(email: string, verificationUrl: string): Promise<void> {
  //   // Use SendGrid, Mailgun, or other email service
  // }
}
