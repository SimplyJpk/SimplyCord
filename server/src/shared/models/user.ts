import { ServerUsersAttributes } from './serverUsers';
import { UserProfilePictureAttributes } from './userProfilePicture';

export interface UserAttributes {
  id: number;
  gid: string;
  username: string;
  // email: string;
  // password: string;
  // salt: string;
  // nonce: string;
  // passwordChanged: Date;
  // reset: number;
  createdAt?: Date;
  // updatedAt?: Date;
  // deletedAt?: Date;
  isOnline?: boolean;
  serverUsers?: ServerUsersAttributes[];
  userProfilePicture?: UserProfilePictureAttributes;
}