
const commentReducer=(state=[],action)=>{

switch(action.type){
    case 'CREATE_COMMENT':console.log(action.postId,action.currentcomments)
    return action.currentcomments
    default:return state
}

    
}
export default commentReducer;