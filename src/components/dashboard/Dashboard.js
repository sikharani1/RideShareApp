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
// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));
// const classes = useStyles();
// const [value, setValue] = React.useState('1');


class Dashboard extends Component 
{
 
  constructor(props){
    super(props);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleLike=this.handleLike.bind(this);
  }
 componentWillMount() {
   console.log(this.props);
    this.setState({
      searchString:'',
      value:"Post"
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
 getposts = (searchString,id) => {
    console.log(id);
    console.log(this.props.allposts);
    console.log(searchString);
      if(!isNaN(searchString) && id!="title"){
        const filteredposts= this.props.allposts.filter(post => post[id]==searchString);
        this.setState({filteredposts: filteredposts});   
          //this.props.allposts.map(currentpost => (console.log(currentpost[id])));
        }
        else{
          const filteredposts= this.props.allposts.filter(post => post[id].includes(searchString));
          this.setState({filteredposts: filteredposts});
        }
  }
  onSearchInputChange = (event) => {
    const oldsearchString='';
    if(this.state){
      const oldsearchString=this.state.searchString;
      }
      if (event.target.value) {
        this.setState({searchString: event.target.value})
      } else {
        this.setState({searchString: oldsearchString})
      }
      this.getposts(this.state.searchString,"title")
  }
  keyPressed(event) {
    if (event.key === "Enter") {
      this.getposts(this.state.searchString,"title")
    }
  }
  handleChange=(event)=>{
    const oldsearchString='';
    console.log(event.target.id);
    if(this.state){
    const oldsearchString=this.state.searchString
    }
  
    if (event.target.value) {
      this.setState({searchString: event.target.value})
    } else {
      this.setState({searchString: oldsearchString})
    }
    console.log(this.state.searchString);
    this.getposts(this.state.searchString,event.target.id)
  }
  handleLike = (post) => {
    const posts = this.state.searchString?this.state.filteredposts: this.props.allposts ;
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
    const posts = this.state.searchString?this.state.filteredposts: this.props.allposts ;
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
    this.requests=[];
    this.posts=[];
    console.log(this.props);
    console.log(this.state.value);
    const {auth,allposts,notifications/*,loading*/} = this.props;
    console.log(allposts);
    this.props.allposts && this.props.allposts.map(post => { post.type=="Request"?this.requests.push(post):this.posts.push(post)});
    
    console.log(this.requests);
    console.log(this.posts);
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
                  <textarea id="arrival" className="materialize-textarea" onInput={this.handleChange}></textarea>
                  <label htmlFor="arrival">Arrival City</label>
                </div>
                <div className="input-field">
                  <textarea id="origin" className="materialize-textarea" onInput={this.handleChange}></textarea>
                  <label htmlFor="origin">Origin City</label>
                </div>
                <div className="input-field">
                  <textarea id="origin" className="materialize-textarea" onInput={this.handleChange}></textarea>
                  <label htmlFor="origin">Via</label>
                </div>
                <div className="input-field">
                  <input type="number" id="luggage" onChange={this.handleChange}
                  min="0" max="5"></input>
                  <label htmlFor="luggage">Luggage space</label>
                </div>
                <div className="input-field">
                  <input type="number" id="seats" onChange={this.handleChange}
                  min="1" max="3"></input>
                  <label htmlFor="seats">Seats available</label>
        
                </div>
              </div>
              <div className="posts-container">
                  <TabContext value={this.state.value}>
                    <AppBar position="static">
                      <TabList onChange={this.handleChange1.bind(this)} aria-label="simple tabs example">
                        <Tab label="Post A Ride" value="Post" />
                        <Tab label="Request A Ride" value="Request" />
                        
                      </TabList>
                    </AppBar>
                    <TabPanel value="Post"><PostList onLike={this.handleLike.bind(this)} posts={this.state.searchString?this.state.filteredposts:this.posts} onBookmark={this.handleBookmark.bind(this)} /></TabPanel> 


                    
                <TabPanel value="Request"> 
                      <PostList onLike={this.handleLike.bind(this)} posts={this.state.searchString?this.state.filteredposts:this.requests} onBookmark={this.handleBookmark.bind(this)} />
                  </TabPanel>
                    
                 </TabContext> 

                  {/* <ul className="tabs">
                    <li className="tab col s3"><a href="#test1">Post A Ride</a>
                    </li>
                    <li className="tab col s3"><a href="#test2">Request A Ride"</a>
                    </li>
                    </ul> */}{/* <div id="test1" className="s12"><PostList onLike={this.handleLike.bind(this)} posts={this.state.searchString?this.state.filteredposts:this.props.allposts} onBookmark={this.handleBookmark.bind(this)} /> match={this.props.match} onChange={this.filterPosts}{posts}/> */}
                    {/* </div> */}
                    {/* <div id="test2" className="s12"><PostList onLike={this.handleLike.bind(this)} posts={this.state.searchString?this.state.filteredposts:this.props.allrequests} onBookmark={this.handleBookmark.bind(this)} /> match={this.props.match} onChange={this.filterPosts}{posts}/> */}
                    {/* </div> */}
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