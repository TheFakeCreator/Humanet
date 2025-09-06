export interface UserDTO {
  _id?: string;
  username: string;
  email: string;
  passwordHash?: string; // Only used server-side
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  twitterProfile?: string;
  profilePicture?: string;
  karma?: number;
  skills?: string[];
  interests?: string[];
  experience?: 'student' | 'entry-level' | 'mid-level' | 'senior' | 'executive';
  availability?: 'available' | 'busy' | 'not-available';
  preferredCollaboration?: string[];
  timezone?: string;
  emailVerified?: boolean;
  isPublicProfile?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string[];
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserProfileDTO {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  karma: number;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}
