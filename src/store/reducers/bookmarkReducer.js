
  
  const bookmarkReducer = (state = initState, action) => {
    const {data}=action;
    switch (action.type) {
      case 'BOOKMARK_POST':
        console.log('added Bookmarked post to favourites', action.post);
        // const totalposts=Object.entries(action.post);
        // console.log(totalposts);
        // //totalposts.push(action.post);
        // Object.assign(state,totalposts);
        // state=[...state,totalposts];
        console.log(state);
        return state;
      case 'BOOKMARK_POST_ERROR':
        console.log('bookmark post error',action.err);
        return state;
      case 'DELETE_BOOKMARK':
        console.log('deleted bookmark from favourites',action.postId);
        return state;
      case 'DELETE_BOOKMARK_ERROR':
          console.log('deleted post',action.err);
          return state;
     
        default:
          return state;
          
    }
    
  };
  
  export default bookmarkReducer;