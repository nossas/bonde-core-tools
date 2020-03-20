import { CrossStorageClient } from 'cross-storage';

class SessionStorage {
  token?: any;
  session: any = {};
  storage: any;
  authenticated: boolean = false;

  constructor(uri: string) {
    // Init session client on cross-storage
    this.storage = new CrossStorageClient(uri, { timeout: 10000 });
  }

  login(user: any) {
    return this.storage.onConnect().then(() => {
      this.authenticated = true;
      this.token = user.token;
      return this.storage.set('auth', JSON.stringify(user));
    });
  }

  logout() {
    return this.storage.onConnect().then(() => {
      return this.storage.del('auth', 'community').then(() => {
        this.token = undefined;
        this.session = {};
        return Promise.resolve();
      });
    });
  }

  getAsyncSession() {
    return this.storage
      .onConnect()
      .then(() => this.storage.get('auth', 'community'))
      .then((args: any): any => {
        const authJson = args[0];
        const communityJson = args[1];
        if (authJson) {
          const dataSession = {
            token: JSON.parse(authJson).token,
            community: communityJson ? JSON.parse(communityJson) : {},
          };
          return Promise.resolve(dataSession);
        }
      });
  }

  setAsyncItem(key: string, value: any) {
    return this.storage.onConnect().then(() => {
      return this.storage.set(key, JSON.stringify(value));
    });
  }
}

export default SessionStorage;
