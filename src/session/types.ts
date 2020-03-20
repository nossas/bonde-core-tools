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

export type SessionContext = {
  signing: boolean;
  isLogged: boolean;
  token?: string;
  loading: any;
  community?: Community;
  onChange: Function;
  logout: Function;
};

export type UserContext = {
  communities: Community[];
  user: User;
};

export type Config = {
  loginUrl?: string;
  crossStorageUrl: string;
  graphqlApiUrl: string;
};
