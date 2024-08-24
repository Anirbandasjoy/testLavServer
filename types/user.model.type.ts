export interface UserDocument extends Document {
  save(): unknown;
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  backgroundImage?: string;
  phone?: string;
  address?: string;
  role: string;
  googleId?: string;
  githubId?: string;
}
