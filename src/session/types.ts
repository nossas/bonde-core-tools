export type User = {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  createdAt: string;
  avatar?: string;
};

export type Community = {
  id: number;
  name: string;
  city: string;
  image?: string;
  created_at: string;
  updated_at: string;
};

export type Context = {
  signing: boolean;
  authenticated: boolean;
  community?: Community;
  communities: Community[];
  user: User;
  logout: Function;
  onChangeCommunity: Function;
};

export type Config = {
  loginUrl: string;
  crossStorageUrl: string;
  graphqlApiUrl: string;
};
