import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

//firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvM9p1WGIfALMSugauU1SvReUwaIREmhM",
  authDomain: "simple-crm-react-firebase.firebaseapp.com",
  databaseURL: "https://simple-crm-react-firebase.firebaseio.com",
  projectId: "simple-crm-react-firebase",
  storageBucket: "simple-crm-react-firebase.appspot.com",
  messagingSenderId: "876152130506"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const settings = {};
firestore.settings(settings);

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
});

if (localStorage.getItem("settings") === null) {
  const defaultSettings = {
    disableBalanceOnAdd: false,
    disableBalanceOnEdit: false,
    allowRegistration: true
  };

  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

const initialState = {
  settings: JSON.parse(localStorage.getItem("settings"))
};

const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  //window.REDUX_DEVTOOLS_EXTENSION ? window.REDUX_DEVTOOLS_EXTENSION() : x => x
);

export default store;
