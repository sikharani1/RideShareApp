
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
// export const dbchange=(getFirestore)=>{
//   const firestore=getFirestore();
      
//       firestore.enablePersistence()
//   .catch(function(err) {
//     if (err.code == 'failed-precondition') {
//       // probably multible tabs open at once
//       console.log('persistance failed');
//     } else if (err.code == 'unimplemented') {
//       // lack of browser support for the feature
//       console.log('persistance not available');
//     }
//   });
//   firestore.collection('posts').onSnapshot(snapshot => {
//     console.log(snapshot.docChanges());
//     snapshot.docChanges().forEach(change => {
//       if(change.type === 'added'){
//         createPost(change.doc.data());
//       }
//       if(change.type === 'removed'){
//         deletePost(change.doc.id);
//       }
//     });
//   });
// }
export const createPost = (post) => {
  console.log(post);
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // make async call to database
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      console.log(profile);
      console.log(getState().firebase.auth)
      const authorId=getState().firebase.auth.uid;
      console.log(authorId);
      const user=firestore.collection('users').filter(u=>u.id==user.uid);
      var verified=false;
     verified=()=>
     {
       if(user.image)
       return true;
     }
     const phoneNumber=user.phoneNumber;
     
      const email=getState().firebase.auth.email;
      console.log(phoneNumber,email,verified);
     
 firestore.collection('posts').add({
            ...post,
            liked:false,
            starred:false,
            authorFirstName:profile.firstName,
            authorLastName:profile.lastName,
            authorId:authorId,
            createdAt:new Date(),
            email:email,
            phoneNumber:phoneNumber,
            verified:verified
      
            

      }).then(()=>{
        dispatch({ type: 'CREATE_POST', post });
      }).catch((err)=>{
        dispatch({ type: 'CREATE_POST_ERROR', err });
      })


    }
  
  };

  export const deletePost=(postId)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      const authorId=getState().firebase.auth.uid;
      
      firestore.collection('posts').doc(postId).delete().then(function() {
        console.log("Document successfully deleted!");
    }).then(()=> {
        dispatch({type:'DELETE_POST', postId});
    }).catch((err)=>{
      dispatch({ type: 'DELETE_POST_ERROR', err });
    })
    }
  };

  export const updatePost = (postId,updatedState) => {
    console.log(updatedState);
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // make async call to database
      
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      const authorId=getState().firebase.auth.uid;
      let newposts='';

    firestore.collection('posts').doc(postId).set({...updatedState})
    //}) 
          .then(()=>{
        dispatch({ type: 'UPDATE_POST', postId,updatedState});
      }).catch((err)=>{
        dispatch({ type: 'UPDATE_POST_ERROR', err });
      })
      
    }
  };
  
  export const getAPost = (postId) => {
    return (dispatch, getState, { getFirestore }) => {
   const firestore = getFirestore()
     firestore.collection('posts').doc(postId).get().then((doc) => {
      if(doc.exists){
       const data = doc.data();
       dispatch({ type: 'GET_POST', data }) 
      }else{
       console.log('does not exist');
      }
      
     })
    }
   }
  
  
  
 