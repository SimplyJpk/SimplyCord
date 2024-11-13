// TODO: (James) What is sensible way to not re-define User? of which an association already exists?

export interface ServerUsersAttributes {
  id: number;
  serverId: number;
  userId: number;
  joinDate?: Date;
  order: number;

  user?: {
    id: number;
    username: string;
    userProfilePicture?: {
      url?: string;
    }
  };
  server?: {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
    bannerUrl: string;
    createdAt?: Date;
  }
}