import cookie from 'js-cookie';

export const isLoggedIn = () => {
  const isValid = cookie.get('verifiedSession');
  if (isValid) {
    return true;
  } else {
    return false;
  }
};

export const getToken = () => {
  return cookie.get('_rtok');
};

export const clearCookie = () => {
  cookie.remove('_rtok');
  cookie.remove('_loginname');
  cookie.remove('verifiedSession');
}

export const login = ({ token, age, name, email }) => {
  cookie.set('_rtok', token, { expires: age });
  cookie.set('_loginname', name, { expires: age });
  cookie.set('verifiedSession', true, { expires: 300 });
  window.location.replace("/atcportal");
};

export const logout = () => {
  cookie.remove('_rtok');
  cookie.remove('_loginname');
  cookie.remove('verifiedSession');
  window.location.replace("/login");
};
