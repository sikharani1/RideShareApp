
const commentReducer=(state=[],action)=>{

switch(action.type){
    case 'CREATE_COMMENT':console.log(action.postId)
    return{...state,[action.postId]:[action.comment]}
    default:return state
}

    
}
export default commentReducer;