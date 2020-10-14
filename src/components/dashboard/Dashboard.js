import React, { Component } from 'react'
import PostList from '../posts/PostList'
import Notifications from './Notifications'
import { connect } from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import { auth } from 'firebase'
import {Redirect} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext'
import TabList from '@material-ui/lab/TabList'
import Tab from '@material-ui/core/Tab'
import TabPanel from '@material-ui/lab/TabPanel'
import AppBar from '@material-ui/core/AppBar'
import PostSummary from '../posts/PostSummary'
import {Link} from 'react-router-dom'
import {updatePost} from '../../store/actions/postActions'
import { bookmarkPost } from '../../store/actions/bookmarkAction'
const INITIAL_STATE={
  searchString:[]
}
var flag=false;

class Dashboard extends Component 
{
  
  constructor(props){
    super(props);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleLike=this.handleLike.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleEnter=this.handleEnter.bind(this);
  
  }
 componentWillMount() {
   console.log(this.props);
    this.setState({
        searchString:[],
        value:"Post",
        filteredposts:[],
        searchEmpty:true,
        initialValue:''
       
       // elementsTriggered:[]
        
      })
  }
 async componentDidMount() {
   await(this.props.allposts)
   console.log(this.props);
    this.setState({
      filteredposts:this.props.allposts
    })
    console.log(this.state.filteredposts);

    
 }
 onSearchInputChange = (event) => {
    const oldsearchString='';
    if(this.state.searchString.title){
      const oldsearchString=this.state.searchString;
      }
      const val=event.target.value;
      
      if (val) {
        this.state.searchString.title=val;
        // this.setState({searchString:this.state.searchString});
      } else {
        this.state.searchString=oldsearchString;
        // this.setState({searchString: this.state.searchString});
      }
      this.getposts(this.state.searchString,"title");
  }
  keyPressed(event) {
    if (event.key === "Enter" && !event.shiftKey) { 
      event.preventDefault();
      this.getposts(this.state.searchString,"title")
      }
   
  }
  handleChange=(event)=>{
    console.log(event.keyCode);
    if (flag && (event.keyCode === 8 || event.keyCode === 46)) {
      event.preventDefault();
    }
    flag = event.keyCode === 13 || event.keyCode === 8 ; 

  } 
  handleEnter=(event)=>{
    
    const val=event.target.value;
    
    if (event.key === "Enter" && !event.shiftKey) { 
    event.preventDefault();
    

    const oldsearchString='';
    console.log(event.target);
    console.log(event.target.value);
    
    const id=event.target.id;
    if(this.state.searchString){
    const oldsearchString=this.state.searchString;
    }
  
    if (val && id) {
      console.log(val);
      console.log(id);
    
      const searchString=this.state.searchString;
      if(searchString && searchString.map(x=>typeof x[id] !== "undefined")){
        this.state.searchString[id]=val;
      }
      else{
      this.state.searchString=[...searchString,{[id]:val}];
      }
   
      //this.setState({...this.state.elementsTriggered,id});
      console.log(this.state.searchString);
   
       
      
      
    } else {
      this.state.searchString=oldsearchString;
      // this.setState({searchString:this.state.searchString })
     
    }
    console.log(this.state.searchString.length);
   
    // this.getposts(this.state.searchString)
  }
  }
  handleApply=(e)=>{
    const searchEmpty1=Object.keys(this.state.searchString).length===0;
    this.setState({searchEmpty:searchEmpty1});
    this.getposts(this.state.searchString);
  }
  handleReset=(e)=>{
  const allrefs=this.refs;
  console.log(allrefs);
   for(var key in allrefs){
     if(allrefs.hasOwnProperty(key)){
     allrefs[key].value="";
     }
   }
   this.setState({
    filteredposts:this.props.allposts
  })
    //this.setState({initialValue:''});
  }
  getposts = (searchString) => {
    // console.log(id);
    console.log(this.props.allposts);
    console.log(searchString.entries());
    const iterator1 = Object.entries(searchString);
    console.log(iterator1);
    var filteredposts1=[{}];
    iterator1.forEach(elem=>{
       var val1=elem[1];
       var id1=elem[0];
       console.log(val1);
       console.log(id1);
      if(!isNaN(val1) && id1!="title"){
        if(this.state.value=="Post")
         {
        // filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1]==val1):this.props.allposts.filter(post => post[id1]==val1);
        filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]==val1);
        this.setState({filteredposts:filteredposts1});
      }
         else{
          filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1]==val1):this.state.requests.filter(post => post[id1]==val1);
          this.setState({filteredposts:filteredposts1});
         }
        //this.state.filteredposts=filteredposts1;
        this.setState({filteredposts:filteredposts1});
        console.log(this.state.filteredposts);
        console.log("number") 
          //this.props.allposts.map(currentpost => (console.log(currentpost[id])));
        }
        else{
        //  filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1].includes(val1)):this.props.allposts.filter(post => post[id1].includes(val1));
         if(this.state.value=="Post")
         {
           filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]==val1);
           this.setState({filteredposts:filteredposts1});
         }
         else{
          filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1]==val1):this.state.requests.filter(post => post[id1]==val1);
          this.setState({filteredposts:filteredposts1});
         }

         console.log(filteredposts1);
         //this.state.filteredposts=filteredposts1;
         this.setState({filteredposts:filteredposts1});
         console.log(this.state);
         console.log("title");
       }
     });
    
  }
  handleLike = (post) => {
    const posts = !this.state.searchEmpty?this.state.filteredposts: this.props.allposts ;
    console.log(posts);
    if(posts) {
      const index = posts.indexOf(post);
      const id=post.id;
      console.log(index);
    //posts[index] = posts[index];
    posts[index].liked = !posts[index].liked;
    // posts[index] = { post };
    this.setState({filteredposts:posts});
    this.props.likePost(id,posts[index]);
    }
    //this.setState({post});
  };
  handleBookmark=(post)=>{
    const posts = !this.state.searchEmpty?this.state.filteredposts: this.props.allposts ;
    if(posts) {
      console.log(typeof post);
      const index = posts.indexOf(post);
      const id=post.id;
      console.log(index);
    //posts[index] = posts[index];
    
    posts[index].starred = !posts[index].starred;
    // posts[index] = { post };
    
    this.setState({filteredposts:posts});
    console.log(posts[index]);
    this.props.bookmarkPost(id,posts[index]);
    }
  }
  
  handleChange1 = (event, newValue) => {
    this.setState({value:newValue})
  };
  render() 
  {
    // this.requests=[];
    // this.posts=[];
    
    console.log(this.props);
    console.log(this.state);
    console.log(this.state.value);
    const {auth,allposts,notifications/*,loading*/} = this.props;
    console.log(allposts);
    // this.props.allposts && this.props.allposts.map(post => { post.type=="Request"?this.requests.push(post):this.posts.push(post)});
    var requests1=[];
    var posts1=[];
    this.props.allposts && this.props.allposts.map(post => { post.type=="Request"?requests1.push(post):posts1.push(post)});
    this.state.requests=requests1;
    this.state.posts=posts1;
   

    console.log(this.state.searchEmpty);
    console.log(this.state.requests);
    console.log(this.state.posts);
    //console.log(allrequests);
    if(!auth.uid) return <Redirect to='/signin'/>
    return (
      <div className="main container">
        <div className="row">
          <div className="col s12 m6 dashboard">
          {/* <SearchForm /> */}
          {/* {loading ? <Spinner /> :  */}
          {this.props.allposts ? (
            <div>
              <TextField style={{padding: 10}}
                autoFocus
                className="searchInput"
                placeholder="Search for posts"
                margin="normal"
                onInput={this.onSearchInputChange} onKeyPress={this.keyPressed}/>
            </div>

          ) : "No posts found" }
            <div className="main-container shadow">
              <div className="side-filters">
                <div className="input-field">
                  <textarea ref="arrival" id="arrival" className="materialize-textarea"  onKeyPress={this.handleEnter} onKeyDown={this.handleChange} ></textarea>
                  <label htmlFor="arrival">Arrival City</label>
                </div>
                <div className="input-field">
                  <textarea ref="origin" id="origin" className="materialize-textarea" onKeyPress={this.handleEnter} onKeyDown={this.handleChange}></textarea>
                  <label htmlFor="origin">Origin City</label>
                </div>
                <div className="input-field">
                  <textarea ref="via" id="via" className="materialize-textarea" onKeyPress={this.handleEnter} onKeyDown={this.handleChange}></textarea>
                  <label htmlFor="via">Via</label>
                </div>
                <div className="input-field">
                  <input type="number" ref="luggage" id="luggage"  onKeyPress={event=>this.handleEnter(event)}
                  min="0" max="5" onKeyDown={this.handleChange}></input>
                  <label htmlFor="luggage">Luggage space</label>
                </div>
                <div className="input-field">
                  <input type="number" ref="seats" id="seats"  onKeyPress={this.handleEnter}
                  min="1" max="3" onKeyDown={this.handleChange}></input>
                  <label htmlFor="seats">Seats available</label>
        
                </div>
                <div className="input-field">
                  <button className="btn pink lighten-1" onClick={this.handleApply} >Apply</button>
                </div>
                <div className="input-field">
                  <button className="btn pink lighten-1" onClick={this.handleReset} >Reset</button>
                </div>
              </div>
              <div className="posts-container">
              {this.state.searchEmpty?(
                 <TabContext value={this.state.value}>
                    <AppBar position="static">
                      <TabList onChange={this.handleChange1.bind(this)} aria-label="simple tabs example">
                        <Tab label="Post A Ride" value="Post" />
                        <Tab label="Request A Ride" value="Request" />
                        
                      </TabList>
                    </AppBar>
                    
                    
                      <TabPanel value="Post"><PostList onLike={this.handleLike.bind(this)} posts={!this.state.searchEmpty?this.state.filteredposts:this.state.posts} onBookmark={this.handleBookmark.bind(this)} /></TabPanel> 

                      <TabPanel value="Request"> 
                      <PostList onLike={this.handleLike.bind(this)} posts={!this.state.searchEmpty?this.state.filteredposts:this.state.requests} onBookmark={this.handleBookmark.bind(this)} />
                      </TabPanel>
                      </TabContext>
                      ):<TabContext value={this.state.value}>
                    <AppBar position="static">
                      <TabList  aria-label="simple tabs example">
                        <Tab label="Filtered Rides"  />
                      </TabList>
                    </AppBar>
                    <TabPanel value={this.state.value}><PostList onLike={this.handleLike.bind(this)} posts={this.state.filteredposts} onBookmark={this.handleBookmark.bind(this)} /></TabPanel> 

                  </TabContext>
                  // <TabContext value={this.state.value}>
                  //   <AppBar position="static">
                  //     <TabList onChange={this.handleChange1.bind(this)} aria-label="simple tabs example">
                  //       <Tab label="Post A Ride" value="Post" />
                  //     </TabList>
                  //   </AppBar><TabPanel value="Post"><PostList onLike={this.handleLike.bind(this)} posts={!this.state.searchEmpty?this.state.filteredposts:this.state.posts} onBookmark={this.handleBookmark.bind(this)} /></TabPanel> 
                  // </TabContext>

              
  

                      }
              </div>
            </div>
          </div>
              <div className="col s12 m5 offset-m1 notifications">
                              <Notifications notifications={notifications}/>
              </div>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  //const state=this.state;
  return {
    allposts: state.firestore.ordered.posts,
    //allrequests:state.firestore.ordered.requests,
    auth:state.firebase.auth,
    notifications: state.firestore.ordered.notifications
    
    //  loading: state.movies.loading
    
  }
  
}
const mapDispatchToProps=(dispatch)=>{
  return {
  likePost: (postId,likedpost) => dispatch(updatePost(postId,likedpost)),
  bookmarkPost:(postId,starredpost)=>dispatch(bookmarkPost(postId,starredpost)),
  
  }
  
}


export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([
  { collection: 'posts',orderBy:['createdAt','desc']},
  { collection: 'notifications', limit: 3,orderBy:['time','desc']}
 ])
)(Dashboard)