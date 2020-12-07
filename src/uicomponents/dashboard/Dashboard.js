import React, { Component ,createRef} from 'react'
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
import ToolBar from '@material-ui/core/Toolbar'

import {updatePost} from '../../store/actions/postActions'
import { bookmarkPost,deleteBookmark } from '../../store/actions/bookmarkAction'
import Geocode from "react-geocode";
import * as geolib from 'geolib';
import {SphericalUtil, PolyUtil} from "node-geometry-library";
import { createSpam, deleteSpam } from '../../store/actions/reportSpamActions'


var origlat=" ";
var origlng=" ";
var filtdestlat=" ";
var filtdestlng=" ";
var destlat=" ";
var destlng=" ";
var filtdestArr={};
var destArr={};
// var finalArr=[];
var validposts=[];
var searchString=[];


Geocode.setApiKey("AIzaSyB6ZjYlDa6DTHnDh-9kuUO22BRaRRhFVW0");
const INITIAL_STATE={
  searchString:[]
}
var flag=false;
const mapStyles = {
  width: '100%',
  height: '100%',
};


class Dashboard extends Component 
{
  googleMapRef = React.createRef()
  
  constructor(props){
    
    super(props);
    this.state=
      {filteredposts:[]};
      
    
    this.keyPressed = this.keyPressed.bind(this);
    this.handleLike=this.handleLike.bind(this);
    // this.handleChange=this.handleChange.bind(this);
    this.handleEnter=this.handleEnter.bind(this);
    this.calculateLatLng=this.calculateLatLng.bind(this);
   this.onmyway=this.onmyway.bind(this);
   this.ispointwithinradius=this.ispointwithinradius.bind(this);
    
  }
  static defaultProps = {
    center: {lat: 40.73, lng: -73.93}, 
    zoom: 12
  }
 componentWillMount() {
   
    this.setState({
        searchString:[],
        value:"Post",
        searchEmpty:true,
        initialValue:'',
        open:true,
        })
  }
  async componentDidMount() {
   await(this.props.allposts)
  }
  onSearchInputChange = (event) => {
    const oldsearchString='';
    if(this.state.searchString.title){
      const oldsearchString=this.state.searchString;
      }
      const val=event.target.value;
      
      if (val) {
        searchString["title"]=val.toLowerCase();
        this.setState({searchString:searchString});
       
      } else {
        searchString["title"]=oldsearchString;
        this.setState({searchString:searchString});
        
      }
      this.getposts(this.state.searchString);
      if(this.state.searchString["title"]==""){
      this.setState({
        filteredposts:this.props.allposts,
        searchEmpty:true
      })
    }
  }
  keyPressed(event) {
    if (event.key === "Enter" && !event.shiftKey) { 
      event.preventDefault();
      this.getposts(this.state.searchString)
      }
   
  }

  handleEnter=(event)=>{
    
    if (event.key === "Enter" && !event.shiftKey) { 
    event.preventDefault();
    if(event.target.value) 
   {
    const val=event.target.value;
    const oldsearchString='';
    const id=event.target.id;
    if(this.state.searchString){
    const oldsearchString=this.state.searchString;
    }
  
    if (val && id) {
      const searchString=this.state.searchString;
      if(searchString && searchString.map(x=>typeof x[id] !== "undefined")){
        this.state.searchString[id]=val.toLowerCase();
      }
      else{
      this.setState({searchString:[...searchString,{[id]:val.toLowerCase()}]});
      }
    } else {
      this.setState({searchString:oldsearchString});
     }
    
  }
  else{
    alert("please enter a valid value to filter");
  }
  
  }
  }
  handleApply=(e)=>{
   const searchEmpty1=Object.keys(this.state.searchString).length===0;
    this.setState({searchEmpty:searchEmpty1});
    var result;
   var resultfilteredsposts=(this.getposts(this.state.searchString)).then((x)=>
   {
      result=x;
     return x;
    });
   
   setTimeout((x)=>{
   
   this.setState({filteredposts:result});
   alert("Filter complete");
  },3000);
  }
  handleReset=(e)=>{
  const allrefs=this.refs;
 
   for(var key in allrefs){
     if(allrefs.hasOwnProperty(key)){
     allrefs[key].value="";
     }
   }
   this.setState({
    filteredposts:this.props.allposts,
    searchEmpty:true
  })
    
  }
  handleMenu=()=>{
    const isopen =!this.state.open;
    this.setState({open:isopen})
     
  }
  calculateLatLng=(dest,filtdest,orig)=>{
    var finalArr=[];
    var promise = new Promise((resolve,reject)=>{
     Geocode.fromAddress(orig).then(
          response => {
      
      const { lat, lng } = response.results[0].geometry.location;
      origlat=lat;
      origlng=lng;
      finalArr[0]=[origlat,origlng];
      resolve(finalArr)
      
        },
       error => {
      console.error(error);
      reject(error)
       }
    
    
       );
  
    Geocode.fromAddress(filtdest).then(
    response => {
      
      const { lat, lng } = response.results[0].geometry.location;
        filtdestlat=lat;
        filtdestlng=lng;
      
      filtdestArr=[filtdestlat,filtdestlng];
      finalArr[1]=filtdestArr;
      
     resolve(finalArr)
    },
    error => {
      console.error(error);
      reject(error)
    }
   );
 
 
   Geocode.fromAddress(dest).then(
      response => {
     
      const { lat, lng } = response.results[0].geometry.location;
      destlat=lat;
      destlng=lng;
      console.log(destlat, destlng);
     destArr=[destlat,destlng]
     
     finalArr[2]=destArr;
     resolve(finalArr)
      },
      error => {
      console.error(error);
      reject(error)
      }
   );
    resolve(finalArr);

  });

let thenProm=promise.then(async(finalArr)=>{
 
  console.log(finalArr);
  return await finalArr;
    }
    ).catch((error)=>
    console.log(error)
    )
    
    setTimeout(()=>{
      console.log(thenProm);
    })
     return  finalArr;
}
onmyway=(dest,filtdest,orig) =>{
    var promise=new Promise((resolve,reject)=>{
    
      const finalArr=this.calculateLatLng(dest,filtdest,orig);
      setTimeout(()=>{
        const resultontheroute=this.onTheRoute(finalArr);
        
         resolve(resultontheroute);
        },3000);
    })
    return promise;
  }
 onTheRoute=async (finalArr)=>{
    return new Promise((resolve,reject)=>{
      origlat=finalArr[0][0];
  origlng=finalArr[0][1];
  filtdestlat=finalArr[1][0];
  filtdestlng=finalArr[1][1];
  destlat=finalArr[2][0];
  destlng=finalArr[2][1];
  
let response =  PolyUtil.isLocationOnEdge(
  {'lat':filtdestlat, 'lng': filtdestlng}, // point object {lat, lng}
  [
    // poligon arrays of object {lat, lng}
    {'lat': origlat, 'lng': origlng},
    {'lat': destlat, 'lng': destlng}
  ],10e4
);

resolve(response);
 }).then((resolve)=>{
      
    return resolve;
    });
    
}
  ispointwithinradius=()=>{
    var origlat=51.525;
    var origlng=7.4575;
    return geolib.isPointWithinRadius(
      { latitude: origlat, longitude: origlng },
      { latitude: 51.5175, longitude: 7.4578 },
      {latitude: 51.5005, longitude: 7.4578},
      50000
  );
  }

getposts = (searchString) => {
  var filteredpostsonmyroute=[];
  var promise3= new Promise((resolve,reject)=>{
    this.setState({
      filteredposts:this.props.allposts
    })
    
    this.state.searchEmpty=false;
    this.setState({searchEmpty:false});
    const iterator1 = Object.entries(searchString);
    var arrivalValue=searchString.arrival;
    var originValue=searchString.origin;
    var luggageValue=searchString.luggage;
    var seatValue=searchString.seats;
    var titleValue=searchString.title;
    var viaValue=searchString.via;
    
   iterator1.forEach(elem=>{
       var val1=elem[1];
       var id1=elem[0];
       var filteredposts1=[];
    if(id1!="title")  {
      if(this.state.value=="Post")
      {
          
        if(originValue && id1=="arrival")
        {
              this.state.posts.map(x=>{
              
            if(x.origin==originValue.toLowerCase()){
              const onmywayresult=(postarrival,arrivalValue,originValue)=>
              {
                var promise=new Promise((resolve,reject)=>
                {
                 
                    const result=this.onmyway(postarrival,arrivalValue,originValue);
                    console.log(result);
                    resolve(result);
                });
                return promise;
              }
           
            onmywayresult(x.arrival,arrivalValue,originValue)
              .then(async(result)=>{
               
              if(await result)
              {
                var filteredvalues=!this.state.searchEmpty?this.state.posts.filter(post => post["arrival"].toLowerCase()==x.arrival):this.state.posts.filter(post => post["arrival"].toLowerCase()==x.arrival);
                
                filteredvalues.map(x=>{
                filteredposts1.push(x);
                });
                
                filteredposts1=[... new Set(filteredposts1)];
                
                setTimeout(()=>{
                if(luggageValue || seatValue){
                 
                  if(luggageValue)
                  filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["luggage"]>=luggageValue):this.state.posts.filter(post => post["luggage"]>=luggageValue);
                  
                  if(seatValue)
                  filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["seats"]>=seatValue):this.state.posts.filter(post => post["seats"]>=seatValue);
                  
                  this.setState({filteredposts:filteredposts1});
                  
                  }
                  else if(viaValue){
                 
                    if(!this.state.searchEmpty)
                    {
                      filteredposts1=this.state.filteredposts.filter(post => 
                     {
                       return (post["via"])?(post["via"].toLowerCase()==viaValue):('')
                      }
                      )
                    }
                    else
                  {
                    filteredposts1=this.state.posts.filter(post => 
                      {
                        return (post["via"])?(post["via"].toLowerCase()==viaValue):('');
                       }
                    )
                  
                  }
                 
                  this.state.filteredposts=filteredposts1;
                  this.setState({filteredposts:filteredposts1});
                  }
                else{
                  this.setState({filteredposts:filteredposts1});
                }
              },6000);
              }
            }).catch((reject)=>{
              console.log("on the route error");
            });
            
          }
          /* map loop */
   }) 

          }
          else{
            
              var viafilteredposts=(!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && (this.state.filteredposts.length)!=0)?this.state.filteredposts.filter(post => post[id1]!=undefined):this.state.posts.filter(post => post[id1]!=undefined);
              var filteredvalues=viafilteredposts.filter(post => post[id1].toLowerCase()==val1);
            console.log(filteredvalues);
            filteredvalues.map(x=>{
            filteredposts1.push(x);
            });
            setTimeout(()=>{
            this.setState({filteredposts:filteredposts1});
            console.log(filteredposts1);
            },3000);
          }
}
      else{
        
        if(originValue && id1=="arrival")
        {
          var filteredposts1=[];
          this.state.requests.map(x=>{
            
            
          if(x.origin==originValue.toLowerCase()){
            const onmywayresult=(postarrival,arrivalValue,originValue)=>
            {
              var promise=new Promise((resolve,reject)=>
              {
               
                  const result=this.onmyway(postarrival,arrivalValue,originValue);
                  resolve(result);
              });
              return promise;
            }
         
        onmywayresult(x.arrival,arrivalValue,originValue)
            .then(async(result)=>{
             
            console.log(result);
            if(await result)
            {
             
              var filteredvalues=!this.state.searchEmpty?this.state.requests.filter(post => post["arrival"]==x.arrival):this.state.requests.filter(post => post["arrival"]==x.arrival);
              
              filteredvalues.map(x=>{
              filteredposts1.push(x);
              });
             
              filteredposts1=[... new Set(filteredposts1)];
              
              
              if(luggageValue || seatValue){
               
                if(luggageValue)
                filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["luggage"]>=luggageValue):this.state.requests.filter(post => post["luggage"]>=luggageValue);
                if(seatValue)
                filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["seats"]>=seatValue):this.state.requests.filter(post => post["seats"]>=seatValue);
                
                this.setState({filteredposts:filteredposts1});
                 
              }
              if(viaValue){
               
                filteredposts1=(!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && this.state.filteredposts.length)?this.state.filteredposts.filter(post => post["via"].toLowerCase()==viaValue):this.state.requests.filter(post => post["via"].toLowerCase()==viaValue);
               
                this.setState({filteredposts:filteredposts1});
                
             
              }
            
            }
          }).catch((reject)=>{
            console.log("on the route error");
          });
          
          }    
  /* map loop */
 }) 
        }
        else{
          var viafilteredposts=(!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && (this.state.filteredposts.length)!=0)?this.state.filteredposts.filter(post => post[id1]!=undefined):this.state.requests.filter(post => post[id1]!=undefined);
              var filteredvalues=viafilteredposts.filter(post => post[id1].toLowerCase()==val1);
            
            filteredvalues.map(x=>{
            filteredposts1.push(x);
            });
            setTimeout(()=>{
            this.setState({filteredposts:filteredposts1});
           
            },3000);
        }
      }
       
        }
        else{
          if(this.state.value=="Post")
          {
            
            filteredvalues= (!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && this.state.filteredposts.length)?this.state.filteredposts.filter(post => post["title"].toLowerCase().includes(titleValue)):this.state.posts.filter(post => post["title"].toLowerCase().includes(titleValue));
            filteredvalues.map(x=>{
              filteredposts1.push(x);
              });
           
          this.setState({filteredposts:filteredposts1});
          

         }
         else{
          
          filteredvalues= (!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && this.state.filteredposts.length)?this.state.filteredposts.filter(post => post["title"].toLowerCase().includes(titleValue)):this.state.requests.filter(post => post["title"].toLowerCase().includes(titleValue));
          filteredvalues.map(x=>{
            filteredposts1.push(x);
            });
          
          
          this.setState({filteredposts:filteredposts1});
         

         }

         this.setState({filteredposts:filteredposts1});
         
       }
     });
     setTimeout(()=>{
     filteredpostsonmyroute=this.state.filteredposts;
    
     
         resolve(filteredpostsonmyroute);
     },3000);
      
     
  });

  let thenProm3=promise3.then(async(filteredpostsonmyroute)=>{
    
   
    return await filteredpostsonmyroute;

    
  }).catch((error)=>
  console.log(error)
  )
  
return thenProm3;
  }

  
handleLike = (post) => {
    const posts = !this.state.searchEmpty?this.state.filteredposts: this.props.allposts ;
    
    if(posts) {
      const index = posts.indexOf(post);
      const id=post.id;
      
    
    posts[index].liked = !posts[index].liked;
    
    this.setState({filteredposts:posts});
    this.setState({posts:posts});
    this.props.likePost(id,posts[index]);
    
    }
    
    this.forceUpdate();
  };
  handleBookmark=(post)=>{
    const posts = !this.state.searchEmpty?this.state.filteredposts: this.props.allposts ;
    if(posts) {
     
      const index = posts.indexOf(post);
      const id=post.id;
      
   
    
    posts[index].starred = !posts[index].starred;
    
    
    this.setState({filteredposts:posts});
    this.setState({posts:posts});
    
    if(posts[index].starred)
    this.props.bookmarkPost(id,posts[index]);
    else
    this.props.deleteBookmark(id,posts[index]);
    
    }
    this.forceUpdate();
  }
  handleReport=(post)=>{
    const posts = !this.state.searchEmpty?this.state.filteredposts: this.props.allposts ;
    if(posts) {
     
      const index = posts.indexOf(post);
      const id=post.id;
      posts[index].spamReported = !posts[index].spamReported;
    if(posts[index].spamReported)
    this.props.createSpam(id,posts[index]);
    else
    this.props.deleteSpam(id,posts[index]);
    
    }

    this.setState({filteredposts:posts});
    this.setState({posts:posts});
    this.forceUpdate();
  }
  
  handleChange1 = (event, newValue) => {
    this.setState({value:newValue})
  };
  render() 
  {
    
   
    const { history } = this.props;
    
    
    const {auth,allposts,notifications/*,loading*/} = this.props;
    
    
    var requests1=[];
    var posts1=[];
    this.props.allposts && this.props.allposts.map(post => { post.type=="Request"?requests1.push(post):posts1.push(post)});
    this.state.requests=requests1;
    this.state.posts=posts1;
   if(!auth.uid) return <Redirect to='/signin'/>
    return (
      <div className="main container">
   
        <div className="row">
          <div className="col s12 m6 dashboard">
          
          {this.props.allposts ? (
            <div>
              <i className="fas fa-search"></i>
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
                  <textarea ref="arrival" id="arrival" className="materialize-textarea"  onKeyPress={this.handleEnter}  ></textarea>
                  <label htmlFor="arrival">Arrival City</label>
                </div>
                <div className="input-field">
                  <textarea ref="origin" id="origin" className="materialize-textarea" onKeyPress={this.handleEnter} ></textarea>
                  <label htmlFor="origin">Origin City</label>
                </div>
                <div className="input-field">
                  <textarea ref="via" id="via" className="materialize-textarea" onKeyPress={this.handleEnter}></textarea>
                  <label htmlFor="via">Via</label>
                </div>
                <div className="input-field">
                  <input type="number" ref="luggage" id="luggage"  onKeyPress={event=>this.handleEnter(event)}
                  min="0" max="5" ></input>
                  <label htmlFor="luggage">Luggage space</label>
                </div>
                <div className="input-field">
                  <input type="number" ref="seats" id="seats"  onKeyPress={this.handleEnter}
                  min="1" max="3" ></input>
                  <label htmlFor="seats">Seats available</label>
        
                </div>
                <div className="input-field">
                  <button className="btn black-text yellow darken-3 buttons filter-buttons" onClick={this.handleApply} >Apply</button>
                </div>
                
                <div className="input-field">
                  <button className="btn black-text yellow darken-3 buttons filter-buttons" onClick={this.handleReset} >Reset</button>
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
                    
                    
                      <TabPanel value="Post"><PostList onLike={this.handleLike.bind(this)} posts={this.state.posts} onBookmark={this.handleBookmark.bind(this)} onReport={this.handleReport.bind(this)} /></TabPanel> 

                      <TabPanel value="Request"> 
                      <PostList onLike={this.handleLike.bind(this)} posts={this.state.requests} onBookmark={this.handleBookmark.bind(this)} onReport={this.handleReport.bind(this)} />
                      </TabPanel>
                      </TabContext>
                      ):<TabContext value={this.state.value}>
                    <AppBar position="static">
                      <TabList  aria-label="simple tabs example">
                        <Tab label="Filtered Rides"  />
                      </TabList>
                    </AppBar>
                    <TabPanel value={this.state.value}><PostList onLike={this.handleLike.bind(this)} posts={this.state.filteredposts} onBookmark={this.handleBookmark.bind(this)} onReport={this.handleReport.bind(this)} /></TabPanel> 

                  </TabContext>
                  
          }
              </div>
            </div>
          </div>
          <ToolBar>
              <i class="fas fa-bell" onClick={this.handleMenu}></i><span className="card-title" id="notification-title">NOTIFICATIONS</span></ToolBar>
              <div className="col s12 m5 offset-m1 notifications" >
                
              {this.state.open?
                              
                              (<Notifications notifications={notifications}/>):null
              }
              </div>
           </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const totalspams=state.firestore.ordered.spams;
  if(totalspams)
    var spamreports= totalspams.filter(s=>s.isSpam==true);
    var spamposts=[];
  if(state.firestore.ordered.posts && spamreports)
  {
    spamreports.map((s)=>{
    const spampost=state.firestore.ordered.posts.filter(p=>s.postId==p.id);
    spampost.map(x=>{
    spamposts.push(x);
    });
    });
  validposts=state.firestore.ordered.posts.filter(p=>!(spamposts.includes(p)));
   }
  return {
    allposts: validposts,
    allrequests:state.firestore.ordered.requests,
    auth:state.firebase.auth,
    notifications: state.firestore.ordered.notifications,
    spams:state.firestore.ordered.spams
    }
}
const mapDispatchToProps=(dispatch)=>{
  return {
  likePost: (postId,likedpost) => dispatch(updatePost(postId,likedpost)),
  bookmarkPost:(postId,starredpost)=>dispatch(bookmarkPost(postId,starredpost)),
  deleteBookmark:(postId,starredpost)=>dispatch(deleteBookmark(postId,starredpost)),
  createSpam:(postId,spammedpost)=>dispatch(createSpam(postId,spammedpost)),
  deleteSpam:(postId,spammedpost)=>dispatch(deleteSpam(postId,spammedpost))
  }
  }
export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([
  { collection: 'posts',orderBy:['createdAt','desc']},
  { collection: 'notifications', limit: 3,orderBy:['time','desc']},
  { collection: 'users'},
  { collection: 'spams'}
 ])
)(Dashboard)                                                                                