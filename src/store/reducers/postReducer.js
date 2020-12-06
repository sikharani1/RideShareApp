const initState = {
    posts: [
      {id: '1', title: 'ride from nj to nyc', content: 'blah blah blah'},
      {id: '2', title: 'ride from phil to roch', content: 'blah blah blah'},
      {id: '3', title: 'to n from from roch to nyc', content: 'blah blah blah'}
    ]
  }
  
  const postReducer = (state = initState, action) => {
    const {data}=action;
    switch (action.type) {
      case 'CREATE_POST':
        console.log('created post', action.post);
        
        console.log(state);
        return state;
      case 'CREATE_POST_ERROR':
        console.log('created post error',action.err);
        return state;
      case 'DELETE_POST':
        console.log('deleted post',action.postId);
        return state;
      case 'DELETE_POST_ERROR':
          console.log('delete post error',action.err);
          return state;
      case 'UPDATE_POST':
            console.log('updated post',action.postId,action.updatedState);
           
            state=action.updatedState;
            return state;
      case 'UPDATE_POST_ERROR':
              console.log('update post error',action.err);
              return state;
      case 'GET_POST':
              console.log("got post",action.data);
              state=action.data;
              console.log(state);
              return state;
        default:
          return state;
          
    }
    
  };
  
  export default postReducer;
  