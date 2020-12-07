

export const bookmarkPost = (postId,updatedState) => {
 
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // asynchronous call to the database
      const firestore=getFirestore();
      const firebase =getFirebase();
      const profile=getState().firebase.profile;
      
      const userId=getState().firebase.auth.uid;
     
      
     firestore.collection('posts').doc(postId).set({...updatedState})
   
           .then(()=>{
         
      firestore.collection('users').doc(userId).update({
            favourites:firebase.firestore.FieldValue.arrayUnion(postId)
      });
      
    }).then(()=>{
      
        dispatch({ type: 'BOOKMARK_POST', postId });

      }).catch((err)=>{
        dispatch({ type: 'BOOKMARK_POST_ERROR', err });
      })   
    }
  };

  export const deleteBookmark=(postId,updatedState)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
      const firestore=getFirestore();
      const firebase =getFirebase();
      const profile=getState().firebase.profile;
      const userId=getState().firebase.auth.uid;
      firestore.collection('posts').doc(postId).set({...updatedState}).then(()=>
      {
        firestore.collection('users').doc(userId).update({
        favourites:firebase.firestore.FieldValue.arrayRemove(postId)
    })}).then(()=> {
        dispatch({type:'DELETE_BOOKMARK', postId});
    }).catch((err)=>{
      dispatch({ type: 'DELETE_BOOKMARK_ERROR', err });
    })
  }
  };
