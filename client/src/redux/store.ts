import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer, //userAPI give the login mutation using useLoginMutation we can call the mutation and get the response
        [productAPI.reducerPath]: productAPI.reducer,
        [userReducer.name]: userReducer.reducer, //userReducer is used to check if the user is logged in or not and to store the user data //if user is logged in then userExist action is dispatched and the user data is stored in the state and if the user is not logged in then userDoesNotExist action is dispatched and the user data is set to null
        [cartReducer.name]: cartReducer.reducer
        
    },
     //middleware: (getDefaultMiddleware)=>[...getDefaultMiddleware(),userAPI.middleware,]
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware).concat(productAPI.middleware),

});



//If User already logged in then the user data is stored in the redux store and the user is redirected to the home page
//If the user is new then the user data is sent to the backend to store in the database and the user is redirected to the home page
//who will check user is logged in or not? = onAuthStateChanged is used to check if the user is logged in or not
//in this case redux store is used to store the user data and to check if the user is logged in or not
//ex- in userReducer.ts file userExist action is dispatched if the user is logged in and userDoesNotExist action is dispatched if the user is not logged in
//in App.tsx file useEffect is used to check if the user is logged in or not
//if the user is logged in then userExist action is dispatched and the user data is stored in the redux store
//if the user is not logged in then userDoesNotExist action is dispatched and the user data is set to null
// if new user then the user data is sent to the backend to store in the database using the login mutation
//who will send the user data to the backend to store in the database? = userAPI.ts file is used to send the user data to the backend to store in the database using the login mutation
//how onAuthStateChanged is used to check if the user is logged in or not? = onAuthStateChanged is used to check if the user is logged in or not two parameters are passed to it, the first is the auth object and the second is a callback function that takes the user as a parameter then it checks if the user exists or not



//at first check if the user is logged in or not from App.tsx file using useEffect and onAuthStateChanged
//if the user is logged in then get the user data from the backend using getUser function from userAPI.ts file - getUser function is used to get the user data from the backend using the user id and the user data is stored in the redux store using userExist action from userReducer.ts file
//if the user is not logged in then set the user data to null using userDoesNotExist action from userReducer.ts file
//if the user is new then send the user data to the backend to store in the database using the login mutation from userAPI.ts file
//if the user is already logged in then the user data is stored in the redux store and the user is redirected to the home page
