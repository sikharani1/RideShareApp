export const createPost = (post) => {
  console.log(post);
    return (dispatch, getState,{getFirebase,getFirestore}) => {
     
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      console.log(profile);
      console.log(getState().firebase.auth)
      const authorId=getState().firebase.auth.uid;
      console.log(authorId);
      var verified=false;
      firestore.collection('users').doc(authorId).get().then((doc) => {
        if(doc.exists){
         const user = doc.data();
         console.log(user);
         if(user.image)
          verified=true;
     
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
        else{
          console.log("user error");
        }
      });
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

    firestore.collection('posts').doc(postId).set({...updatedState},{ merge: true })
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
  
 