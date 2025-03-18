import { combineReducers, createStore } from "redux";
import { account } from "./action";

const allReducers = combineReducers({
  account,
});

// Load user data from localStorage
const loadUserData = () => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? userData : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

// Initialize store with persisted data
const store = createStore(
  allReducers, 
  { account: loadUserData() }
);

// Save state changes to localStorage
store.subscribe(() => {
  const state = store.getState();
  if (state.account) {
    localStorage.setItem("userData", state.account.data);
  } else {
    localStorage.removeItem("userData");
  }
});

export default store;