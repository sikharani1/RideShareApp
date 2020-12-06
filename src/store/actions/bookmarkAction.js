import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

export const bookmarkPost = (postId,updatedState) => {
  console.log(updatedState);
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // asynchronous call to the database
      const firestore=getFirestore();
      const firebase =getFirebase();
      const profile=getState().firebase.profile;
      console.log(profile);
      console.log(getState().firebase.auth)
      const userId=getState().firebase.auth.uid;
      console.log(userId);
      
     firestore.collection('posts').doc(postId).set({...updatedState})
   
           .then(()=>{
         console.log("updated bookmark");
      firestore.collection('users').doc(userId).update({
            favourites:firebase.firestore.FieldValue.arrayUnion(postId)
      });
      console.log("added favourite");
    }).then(()=>{
      console.log("added bookmark");
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
