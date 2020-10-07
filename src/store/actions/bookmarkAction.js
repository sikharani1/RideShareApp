import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'

export const bookmarkPost = (postId,updatedState) => {
  console.log(updatedState);
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // make async call to database
      const firestore=getFirestore();
      const firebase =getFirebase();
      const profile=getState().firebase.profile;
      console.log(profile);
      console.log(getState().firebase.auth)
      const userId=getState().firebase.auth.uid;
      console.log(userId);
      const email=getState().firebase.auth.email;
      //const postId=post.id;
     const phoneNumber=getState().firebase.auth.phoneNumber;
     firestore.collection('posts').doc(postId).set({...updatedState})
     //}) 
           .then(()=>{
         dispatch({ type: 'UPDATE_POST', postId,updatedState});
       }).catch((err)=>{
         dispatch({ type: 'UPDATE_POST_ERROR', err });
       })
      firestore.collection('users').doc(userId).update({
            favourites:firebase.firestore.FieldValue.arrayUnion(postId)
      }).then(()=>{
        dispatch({ type: 'BOOKMARK_POST', postId });
      }).catch((err)=>{
        dispatch({ type: 'BOOKMARK_POST_ERROR', err });
      })

    
      
    }
  };

  export const deleteBookmark=(postId)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
      const firestore=getFirestore();
      const firebase =getFirebase();
      const profile=getState().firebase.profile;
      const userId=getState().firebase.auth.uid;
      
      firestore.collection('users').doc(userId).update({
        favourites:firebase.firestore.FieldValue.arrayRemove(postId)
    }).then(()=> {
        dispatch({type:'DELETE_BOOKMARK', postId});
    }).catch((err)=>{
      dispatch({ type: 'DELETE_BOOKMARK_ERROR', err });
    })
    }
  };
