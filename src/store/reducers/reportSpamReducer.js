
  
  const reportSpamReducer = (state = initState, action) => {
    const {data}=action;
    switch (action.type) {
      case 'CREATE_SPAM':
        console.log('reported post', action.postId);
        return state;
      case 'CREATE_SPAM_ERROR':
        
        return state;
      case 'TICK_SPAM':
          console.log("ticked spam",action.postId);
      case 'TICK_SPAM_ERROR':
          console.log("ticked spam",action.err);
      case 'DELETE_SPAM':
        console.log('deleted spam ',action.postId);
        return state;
      case 'DELETE_SPAM_ERROR':
          
          return state;
     
        default:
          return state;
          
    }
    
  };
  
  export default reportSpamReducer;