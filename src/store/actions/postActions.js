export const createPost = (post) => {
  
    return (dispatch, getState,{getFirebase,getFirestore}) => {
     
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      
      const authorId=getState().firebase.auth.uid;
      
      var verified=false;
      firestore.collection('users').doc(authorId).get().then((doc) => {
        if(doc.exists){
         const user = doc.data();
         
         if(user.image)
          verified=true;
     
          const phoneNumber=user.phoneNumber;
     
          const email=getState().firebase.auth.email;
          
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
      firestore.collection('posts').doc(postId).delete().then(function() {
        
    }).then(()=> {
        dispatch({type:'DELETE_POST', postId});
    }).catch((err)=>{
      dispatch({ type: 'DELETE_POST_ERROR', err });
    })
    }
  };

  export const updatePost = (postId,updatedState) => {
    
    return (dispatch, getState,{getFirebase,getFirestore}) => {
     
      
      const firestore=getFirestore();
      firestore.collection('posts').doc(postId).set({...updatedState},{ merge: true })
    
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
  
 