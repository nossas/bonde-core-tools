export default () => {
  const loginUrl =
    process.env.REACT_APP_LOGIN_URL ||
    'http://admin-canary.bonde.devel:5002/auth/login';
  window.location.href = `${loginUrl}?next=${window.location.href}`;
};
