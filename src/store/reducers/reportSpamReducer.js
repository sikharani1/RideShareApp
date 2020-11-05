
  
  const reportSpamReducer = (state = initState, action) => {
    const {data}=action;
    switch (action.type) {
      case 'CREATE_SPAM':
        console.log('reported post', action.postId);
        // const totalposts=Object.entries(action.post);
        // console.log(totalposts);
        // //totalposts.push(action.post);
        // Object.assign(state,totalposts);
        // state=[...state,totalposts];
        console.log(state);
        return state;
      case 'CREATE_SPAM_ERROR':
        console.log('reported post error',action.err);
        return state;
      case 'DELETE_SPAM':
        console.log('deleted spam ',action.postId);
        return state;
      case 'DELETE_SPAM_ERROR':
          console.log('deleted report error',action.err);
          return state;
     
        default:
          return state;
          
    }
    
  };
  
  export default reportSpamReducer;