import Header from './components/Header'
import Routing from './routes/Routing'
import { useSelector } from 'react-redux'
import { UserReducerInitialState } from './types/reducer-types'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { getUser } from './redux/api/userAPI'
import { useDispatch } from 'react-redux'
import { userDoesNotExist, userExist } from './redux/reducer/userReducer'
import Loader from './components/Loader'

const App = () => {

  const { user, loading } = useSelector((state: {userReducer :UserReducerInitialState})=> state.userReducer);
  const dispatch  = useDispatch();
  useEffect(() => { //why in this case we use useEffect? = useEffect is used to run the code only once when the component is mounted and not every time the component is rendered so it is used to check if the user is logged in or not only once when the component is mounted
    //onAuthStateChanged is used to check if the user is logged in or not two parameters are passed to it, the first is the auth object and the second is a callback function that takes the user as a parameter then it checks if the user exists or not
    onAuthStateChanged(auth, async (user) => {
      if ( user ) {
        const res = await getUser(user.uid);
        //console.log(data.data)
        dispatch(userExist(res.data));//userExist is an action that is dispatched to the reducer
      } else dispatch(userDoesNotExist());
    })
  }, []);
  
  return  loading? <Loader /> :( 
     <> 
     
     <Header user={user} />
       <Routing />
    </>
    )
}

export default App