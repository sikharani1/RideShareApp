
  
  const bookmarkReducer = (state = initState, action) => {
    const {data}=action;
    switch (action.type) {
      case 'BOOKMARK_POST':
        
        return state;
      case 'BOOKMARK_POST_ERROR':
        
        return state;
      case 'DELETE_BOOKMARK':
        console.log('deleted bookmark from favourites',action.postId);
        return state;
      case 'DELETE_BOOKMARK_ERROR':
          
          return state;
     
        default:
          return state;
          
    }
    
  };
  
  export default bookmarkReducer;