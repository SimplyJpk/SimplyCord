// TODO: (James) What is sensible way to not re-define User? of which an association already exists?

export interface ServerUsersAttributes {
  id: number;
  serverId: number;
  userId: number;
  joinDate?: Date;

  user?: {
    id: number;
    username: string;
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