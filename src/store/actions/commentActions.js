import {Remove} from 'react-lodash';
import React from 'react';
export const createComment = (comment,postId) => {
    return (dispatch, getState,{getFirebase,getFirestore}) => {
      // make async call to database
      const firestore=getFirestore();
      const profile=getState().firebase.profile;
      const authorId=getState().firebase.auth.uid;
     // console.log(firestore.collection('posts').doc(postId).comments);
      firestore.collection('posts').doc(postId).get().then(function(doc) {
        // Document was found in the cache. If no cached document exists,
        // an error will be returned to the 'catch' block below.

        console.log("Cached document data:", doc.data());
        const data=doc.data();
        
         const oldcomments=doc.data().comments;
         console.log(oldcomments);
      
        return oldcomments;
    
      }).then(function(oldcomments){

      
        console.log(authorId);
        var mycomments=[];
      if(oldcomments){
        mycomments=oldcomments.filter(comment=>comment.authorId==authorId);
      }
      else{
        oldcomments=[];
        mycomments=oldcomments;
      }
      
        console.log(mycomments);
      
       if(mycomments.length!=0)
       {mycomments.map(mycomment=>
          
             mycomment.singlepersoncomments.push({createdAt:new Date(),value:comment})
           
        )
        
       
        const newcomments=oldcomments.filter(comment=>comment.authorId!=authorId);
        console.log(newcomments);
        newcomments.push(mycomments);
        
        console.log(newcomments);
        oldcomments.singlepersoncomments=newcomments;

     


        firestore.collection('posts').doc(postId).set({
          
          comments:oldcomments
       }, { merge: true });



      }
        else{
          console.log(oldcomments);
          oldcomments.push({authorFirstName:getState().firebase.profile.firstName,authorLastName:getState().firebase.profile.lastName,authorId:authorId,singlepersoncomments:[{createdAt:new Date(),value:comment}]})
          const newcomments=oldcomments;
          console.log(newcomments);
          firestore.collection('posts').doc(postId).set({
          
            comments:newcomments
         }, { merge: true });
        }
      
 

    
  
    }).catch(function(error) {
        console.log("Error getting cached document:", error);
    }
    
    ).then(()=>{
        dispatch({ type: 'CREATE_COMMENT',comment,postId });
      }).catch((err)=>{
        dispatch({ type: 'CREATE_COMMENT_ERROR', err });
      })
      
    }
  };