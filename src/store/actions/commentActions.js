import {Remove} from 'react-lodash';
import React from 'react';
export const createComment = (comment,postId) => {
  var currentcomments=[];
  
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // make async call to database
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      const authorId=getState().firebase.auth.uid;
     
     var oldcomments=[];
      firestore.collection('posts').doc(postId).get().then(function(doc) {
        const data=doc.data();
        oldcomments=doc.data().comments;
         }).then(()=>{
        
        var mycomments=[];
        
      if(Array.isArray(oldcomments) && oldcomments.length){
        mycomments=oldcomments.filter(comment=>comment.authorId==authorId);
      }
      else{
       
        mycomments=oldcomments;
        
      }
      if(Array.isArray(mycomments) && mycomments.length)
       {
         mycomments.map(mycomment=>
          {
            const id=mycomments.indexOf(mycomment);
            
             mycomment.singlepersoncomments.push({createdAt:new Date(),value:comment});
             mycomments[id]=mycomment;
          }
        )
        
         oldcomments=mycomments;
         const newcomments=oldcomments.filter(comment=>comment.authorId!=authorId);
        newcomments.push(mycomments);
        oldcomments.singlepersoncomments=newcomments;
        firestore.collection('posts').doc(postId).set({
        comments:oldcomments
       }, { merge: true }).then(()=>{
        
        firestore.collection('posts').doc(postId).get().then(function(doc) {
        const data=doc.data();
        currentcomments=doc.data().comments;
        
      });
    })
}
        else{
          oldcomments=[];
          
          oldcomments.push({authorFirstName:getState().firebase.profile.firstName,authorLastName:getState().firebase.profile.lastName,authorId:authorId,singlepersoncomments:[{createdAt:new Date(),value:comment}]})
          const newcomments=oldcomments;
          
          firestore.collection('posts').doc(postId).set({
          
            comments:newcomments
         }, { merge: true }).then(()=>{
          
          firestore.collection('posts').doc(postId).get().then(function(doc) {
            const data=doc.data();
            currentcomments=doc.data().comments;
           
          });
        })
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    
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