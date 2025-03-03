export const login = (userData) => ({
    type: "LOGINSUCCESS",
    userData: userData,
  });
  
  export const logout = () => ({
    type: "LOGOUT"
  });
  
  export const account = (state = null, action) => {
    switch (action.type) {
      case "LOGINSUCCESS":
        return action.userData;
      case "LOGOUT":
        {
          localStorage.removeItem("userData");
          localStorage.removeItem("token");
          return null;
        }
      default:
        return state;
    }
  };   