class Auth {

  // Authenticate a user. Save a token string in Local Storage
  static authenticateUser(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', user);
  }

  //check if token is saved/user is authenticated
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  //deauthenticate a user on logout
  static deauthenticateUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  //get token value
  static getToken() {
    return localStorage.getItem('token');
  }

}

export default Auth;