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
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  mailchimp_api_key?: string;
  mailchimp_list_id?: string;
  mailchimp_group_id?: string;
  fb_link?: string;
  twitter_link?: string;
  facebook_app_id?: string;
  email_template_from?: string;
  modules?: any;
  recipient?: any;
};

export type Modules = {
  [module: string]: string;
};

export type SessionContext = {
  signing: boolean;
  isLogged: boolean;
  token?: string;
  loading: any;
  user: User;
  community?: Community;
  communities: Community[];
  modulesConfig?: Modules;
  onChange: Function;
  login: Function;
  logout: Function;
};

export type UserContext = {
  communities: Community[];
  user: User;
};

export type Config = {
  modules: Modules;
  crossStorageUrl: string;
  graphqlApiUrl: string;
};
