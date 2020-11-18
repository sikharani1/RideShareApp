import {Remove} from 'react-lodash';
import React from 'react';
export const createComment = (comment,postId) => {
  var currentcomments=[];
  
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // make async call to database
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      const authorId=getState().firebase.auth.uid;
     // console.log(firestore.collection('posts').doc(postId).comments);
     var oldcomments=[];
      firestore.collection('posts').doc(postId).get().then(function(doc) {
        // Document was found in the cache. If no cached document exists,
        // an error will be returned to the 'catch' block below.

        console.log("Cached document data:", doc.data());
        const data=doc.data();
        
         oldcomments=doc.data().comments;
         console.log(oldcomments);
      
        //return oldcomments;
    
      }).then(()=>{

      
        console.log(authorId);
        var mycomments=[];
        console.log(oldcomments);
      if(Array.isArray(oldcomments) && oldcomments.length){
        mycomments=oldcomments.filter(comment=>comment.authorId==authorId);
      }
      else{
       
        mycomments=oldcomments;
        console.log(mycomments);
      }
      
        
      console.log(oldcomments);
       if(Array.isArray(mycomments) && mycomments.length)
       {
         mycomments.map(mycomment=>
          {
            const id=mycomments.indexOf(mycomment);
            console.log(mycomment);
             mycomment.singlepersoncomments.push({createdAt:new Date(),value:comment});
             mycomments[id]=mycomment;
          }
        )
        console.log(mycomments);
         oldcomments=mycomments;
         
        const newcomments=oldcomments.filter(comment=>comment.authorId!=authorId);
        console.log(newcomments);
        newcomments.push(mycomments);
        
        console.log(newcomments);
        oldcomments.singlepersoncomments=newcomments;
        console.log(oldcomments);

     


        firestore.collection('posts').doc(postId).set({
          
          comments:oldcomments
       }, { merge: true }).then(()=>{
        console.log(postId);
        firestore.collection('posts').doc(postId).get().then(function(doc) {
        const data=doc.data();
        currentcomments=doc.data().comments;
        console.log(doc.data().comments);
      });
    })



      }
        else{
          oldcomments=[];
          console.log(oldcomments);
          oldcomments.push({authorFirstName:getState().firebase.profile.firstName,authorLastName:getState().firebase.profile.lastName,authorId:authorId,singlepersoncomments:[{createdAt:new Date(),value:comment}]})
          const newcomments=oldcomments;
          console.log(newcomments);
          firestore.collection('posts').doc(postId).set({
          
            comments:newcomments
         }, { merge: true }).then(()=>{
          console.log(postId);
          firestore.collection('posts').doc(postId).get().then(function(doc) {
            const data=doc.data();
            currentcomments=doc.data().comments;
            console.log(doc.data().comments);
          });
        })
        
      
       
        }
    
  
    }).catch(function(error) {
        console.log("Error getting cached document:", error);
    
  }).then(()=>{
    setTimeout(()=>{
    console.log(currentcomments);
        dispatch({ type: 'CREATE_COMMENT',currentcomments,postId });
  },6000);
}).catch((err)=>{
        dispatch({ type: 'CREATE_COMMENT_ERROR', err });
      })
      
}
  };