export interface UserDTO {
  _id?: string;
  username: string;
  email: string;
  passwordHash?: string; // Only used server-side
  bio?: string;
  karma?: number;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
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
