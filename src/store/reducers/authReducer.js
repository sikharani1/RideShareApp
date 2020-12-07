const initState = {
  authError: null
}

const authReducer = (state = initState, action) => {
  switch(action.type){
    case 'SIGNUP_SUCCESS':
      
      return{
        ...state,
        authError:action.err.message
      }  
    case 'SIGNUP_ERROR':
      
      return {
        ...state,
        authError:action.err.message
      }
    case 'SIGNOUT_SUCCESS':
      
      return state
    case 'LOGIN_ERROR':
      
      return {
        ...state,
        authError: 'Login failed'
      }
    case 'LOGIN_SUCCESS':
      
      return {
        ...state,
        authError: null
      }
    
    
    default:
      return state
  }
};

export default authReducer;