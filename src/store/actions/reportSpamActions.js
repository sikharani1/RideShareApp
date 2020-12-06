export const createSpam = (postId) => {
  console.log(postId);
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      console.log(profile);
      console.log(getState().firebase.auth)
      const authorId=getState().firebase.auth.uid;
      console.log(authorId);
      var verified=false;
      var postContent="";
      var postTitle="";
      firestore.collection('users').doc(authorId).get().then((doc) => {
        if(doc.exists){
         const user = doc.data();
         console.log(user);
         if(user.image)
          verified=true;
          console.log(verified);

        }
        else
        console.log("user error");
        }).then(()=>firestore.collection('posts').doc(postId).get().then((doc) => {
        if(doc.exists){
         const post = doc.data();
         console.log(post);
         if(post.content)
          {postContent=post.content;}
        
        if(post.title)
          {postTitle=post.title;}
        }
        else{
          console.log("spam post error");
        }
        
        
      })).then(()=>
        firestore.collection('spams').add({
            
            postId:postId,
            isSpam:false,
            spammed:true,
            authorFirstName:profile.firstName,
            authorLastName:profile.lastName,
            authorId:authorId,
            createdAt:new Date(),
            verified:verified,
            content:postContent,
            title:postTitle
      
            

      })
      )
    .then(()=>{
        console.log("created spam");
        dispatch({ type: 'CREATE_SPAM', postId});
      }).catch((err)=>{
        console.log("create spam error",err);
        dispatch({ type: 'CREATE_SPAM_ERROR', err });
      })
    }
     
        
    
      
     
       



    
  
  };

  export const deleteSpam=(postId)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      const authorId=getState().firebase.auth.uid;
      
      firestore.collection('spams').doc(postId).delete().then(function() {
        console.log("Spam successfully deleted!");
    }).then(()=> {
        dispatch({type:'DELETE_SPAM', postId});
    }).catch((err)=>{
      dispatch({ type: 'DELETE_SPAM_ERROR', err });
    })
    }
  };

  export const getASpam = (spamId) => {
    return (dispatch, getState, { getFirestore }) => {
   const firestore = getFirestore()
     firestore.collection('spams').doc(spamId).set().then((doc) => {
      if(doc.exists){
       const data = doc.data();
       dispatch({ type: 'GET_SPAM', data }) 
      }else{
       console.log('does not exist');
      }
      
     })
    }
   }

   export const tickSpam=(postId)=>{
    return (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore()
          firestore.collection('spams').doc(postId).update({
              isSpam:true
          }).then(()=>firestore.collection('spams').doc(postId).get().then((doc) => {
            if(doc.exists){
             const spam = doc.data();
             console.log(spam)
            }
            }).then(() => {
            
           
            console.log("ticked");
            dispatch({ type: 'TICK_SPAM', postId }) ;
           
           
          }).catch((err)=>{
            dispatch({ type: 'TICK_SPAM_ERROR', err });
        })
          
          )}




   }