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

// Get the current logged-in user's name from cookies
export const getUserName = () => {
  return cookie.get('_loginname') || null;
};

// Get the current logged-in user's email from cookies
export const getUserEmail = () => {
  return cookie.get('_loginemail') || null;
};

export const clearCookie = () => {
  cookie.remove('_rtok');
  cookie.remove('_loginname');
  cookie.remove('verifiedSession');
  cookie.remove('_loginemail');
}

// Log in the user and set cookies with enhanced options and error handling
export const login = ({ token, age, name, email, redirectUrl = "/atcportal" }) => {
  if (!token || !age || !name) {
    // eslint-disable-next-line no-console
    console.error("Missing required login parameters");
    return;
  }
  // Check if running on localhost for development
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const cookieOptions = { 
    expires: age, 
    secure: !isLocalhost, // Allow HTTP on localhost
    sameSite: 'Lax' // Use Lax for better compatibility with cross-origin requests
  };
  cookie.set('_rtok', token, cookieOptions);
  cookie.set('_loginname', name, cookieOptions);
  if (email) {
    cookie.set('_loginemail', email, cookieOptions);
  }
  // Session cookie for quick session check (shorter expiry)
  cookie.set('verifiedSession', true, { 
    expires: 300, 
    secure: !isLocalhost, // Allow HTTP on localhost
    sameSite: 'Lax' // Use Lax for better compatibility
  });
  window.location.replace(redirectUrl);
};

// Log out the user, clear cookies, and redirect (optionally to a custom URL)
export const logout = (redirectUrl = "/login") => {
  clearCookie();
  window.location.replace(redirectUrl);
};
