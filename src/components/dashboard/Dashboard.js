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
import PostSummary from '../posts/PostSummary'
import {Link} from 'react-router-dom'
import {updatePost} from '../../store/actions/postActions'
import { bookmarkPost,deleteBookmark } from '../../store/actions/bookmarkAction'
import Geocode from "react-geocode";
import * as geolib from 'geolib';
import {SphericalUtil, PolyUtil} from "node-geometry-library";



import { yellow } from '@material-ui/core/colors'
import { Result } from 'react-lodash'
import { resolve } from 'path'
import { createSpam, deleteSpam } from '../../store/actions/reportSpamActions'

var arrivalValue;
var origlat=" ";
var origlng=" ";
var filtdestlat=" ";
var filtdestlng=" ";
var destlat=" ";
var destlng=" ";
var originArr={};
var filtdestArr={};
var destArr={};
// var finalArr=[];
var validposts=[];

var orig="";

 //Geocode.setApiKey("AIzaSyDjzMckE87fEvdaWGFcv7lsGNVhJY9-zNM");
 Geocode.setApiKey("AIzaSyB6ZjYlDa6DTHnDh-9kuUO22BRaRRhFVW0");
const INITIAL_STATE={
  searchString:[]
}
var flag=false;
const mapStyles = {
  width: '100%',
  height: '100%',
};

// var myPosition={lat: 40.73, lng: -73.93};

class Dashboard extends Component 
{
  googleMapRef = React.createRef()
  
  constructor(props){
    super(props);
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
   console.log(this.props);
    this.setState({
        searchString:[],
        value:"Post",
        filteredposts:[],
        searchEmpty:true,
        initialValue:'',
        open:true,
        
        
      })
  }
  
 async componentDidMount() {
   await(this.props.allposts)
   console.log(this.props);
    this.setState({
      filteredposts:''
      // posts:this.props.allposts
    })
    console.log(this.state.filteredposts);
  //this.initialize();
   console.log(this.ispointwithinradius()); 

   
  }


 onSearchInputChange = (event) => {
    const oldsearchString='';
    if(this.state.searchString.title){
      const oldsearchString=this.state.searchString;
      }
      const val=event.target.value;
      
      if (val) {
        this.state.searchString["title"]=val.toLowerCase();;
        // this.state.searchString[id]=val.toLowerCase();
        // this.setState({searchString:this.state.searchString});
      } else {
        this.state.searchString["title"]=oldsearchString;
        // this.setState({searchString: this.state.searchString});
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
  // handleChange=(event)=>{
  
  //   console.log(event.keyCode);
  //   if (flag && (event.keyCode === 8 || event.keyCode === 46)) {
  //     event.preventDefault();
  //   }
  //   flag = event.keyCode === 13 || event.keyCode === 8 ; 

  // } 
  handleEnter=(event)=>{
    
    if (event.key === "Enter" && !event.shiftKey) { 
    event.preventDefault();
    if(event.target.value) 
   {
    const val=event.target.value;
    

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
        this.state.searchString[id]=val.toLowerCase();
      }
      else{
      this.setState({searchString:[...searchString,{[id]:val.toLowerCase()}]});
      }
   
      //this.setState({...this.state.elementsTriggered,id});
      console.log(this.state.searchString);
   
    } else {
      this.state.searchString=oldsearchString;
      // this.setState({searchString:this.state.searchString })
     
    }
    console.log(this.state.searchString.length);
  }
  else{
    alert("please enter a valid value to filter");
  }
   // this.getposts(this.state.searchString)
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
   console.log(resultfilteredsposts);
   setTimeout((x)=>{
   console.log("filtered fetch complete");
   this.setState({filteredposts:result});
  },3000);
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
    filteredposts:this.props.allposts,
    searchEmpty:true
  })
    //this.setState({initialValue:''});
  }
  handleMenu=()=>{
    const isopen =!this.state.open;
     this.setState({open:isopen})
     console.log(this.state.open);
  }
  calculateLatLng=(dest,filtdest,orig)=>{
    var finalArr=[];
    var promise = new Promise((resolve,reject)=>{
     

        Geocode.fromAddress(orig).then(
          response => {
      
      const { lat, lng } = response.results[0].geometry.location;
      origlat=lat;
      origlng=lng;

      console.log(origlat, origlng);
      finalArr[0]=[origlat,origlng];
      resolve(finalArr)
      console.log(finalArr);
        },
       error => {
      console.error(error);
      reject(error)
       }
    
    
       );
  
    Geocode.fromAddress(filtdest).then(
    response => {
      console.log(finalArr);
      const { lat, lng } = response.results[0].geometry.location;
        filtdestlat=lat;
        filtdestlng=lng;
      console.log(filtdestlat, filtdestlng);
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
     console.log(destArr);
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
  // console.log(result);
  // finalArr=result;
  console.log(finalArr);
  return await finalArr;
    }
    ).catch((error)=>
    console.log(error)
    )
    console.log(thenProm);
    setTimeout(()=>{
      console.log(thenProm);
    })
     return  finalArr;
}
 

  onmyway=(dest,filtdest,orig) =>{
    var promise=new Promise((resolve,reject)=>{
    console.log(dest,filtdest,orig);
    console.log(this.calculateLatLng(dest,filtdest,orig));
      const finalArr=this.calculateLatLng(dest,filtdest,orig);
      
      console.log(finalArr);
    
      setTimeout(()=>{
        const resultontheroute=this.onTheRoute(finalArr);
        console.log(this.onTheRoute(finalArr));
         resolve(resultontheroute);
        },3000);
    })
    return promise;
  }
 
   

 // onTheRoute=(origlat,origlng,filtdestlat,filtdestlng,destlat,destlng)=>{
  onTheRoute=async (finalArr)=>{
    return new Promise((resolve,reject)=>{
      origlat=finalArr[0][0];
    console.log(origlat);
  // return new Promise(resolve=>{
  //   console.log(finalArr);
    
  origlng=finalArr[0][1];
  filtdestlat=finalArr[1][0];
  filtdestlng=finalArr[1][1];
  destlat=finalArr[2][0];
  destlng=finalArr[2][1];
  console.log("origin"+origlat+" "+origlng)
    console.log("filtdest"+filtdestlat+" "+filtdestlng)
    console.log("dest"+destlat+" "+destlng)
 
let response =  PolyUtil.isLocationOnEdge(
  {'lat':filtdestlat, 'lng': filtdestlng}, // point object {lat, lng}
  [
    // poligon arrays of object {lat, lng}
    {'lat': origlat, 'lng': origlng},
    {'lat': destlat, 'lng': destlng}
    
    
   
    
  ],10e4
);
console.log(response);
resolve(response);
 }).then((resolve)=>{
      console.log(resolve);
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
    // console.log(id);
    this.state.searchEmpty=false;
    this.setState({searchEmpty:false});
    console.log(this.props.allposts);
    console.log(searchString.entries());
    const iterator1 = Object.entries(searchString);
    console.log(iterator1);
    var arrivalValue=searchString.arrival;
    var originValue=searchString.origin;
    var luggageValue=searchString.luggage;
    var seatValue=searchString.seats;
    var titleValue=searchString.title;
    var viaValue=searchString.via;
    console.log(originValue);
   iterator1.forEach(elem=>{
       var val1=elem[1];
       var id1=elem[0];
       console.log(val1);
       console.log(id1);
       
       var filteredposts1=[];
    if(id1!="title")  {
      if(this.state.value=="Post")
      {
          console.log(this.state.posts);
          console.log(arrivalValue);
          console.log(originValue);
         
        if(originValue && id1=="arrival")
        {
            
            console.log(this.state.posts);
             this.state.posts.map(x=>{
              //   var x=this.state.posts[12];
              console.log("my dest "+arrivalValue);
              console.log("my origin "+originValue);
              console.log("post dest "+x.arrival);
              console.log("post origin "+x.origin);
              // setTimeout(()=>{
               //  this.onmyway(x.arrival,val1,originValue)},3000);
             //const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
               //console.log(this.onmyway(x.arrival,val1,originValue));

             // const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
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
               // return await result;
              console.log(result);
              if(await result)
              {
                console.log("ontheroute");
                console.log(filteredposts1);
                console.log(this.state.filteredposts);
                console.log(this.state.searchEmpty);
               
                var filteredvalues=!this.state.searchEmpty?this.state.posts.filter(post => post["arrival"].toLowerCase()==x.arrival):this.state.posts.filter(post => post["arrival"].toLowerCase()==x.arrival);
                console.log(filteredvalues);
                filteredvalues.map(x=>{
                filteredposts1.push(x);
                });
                console.log(filteredposts1);
                filteredposts1=[... new Set(filteredposts1)];
                //this.setState({filteredposts:filteredposts1});
                setTimeout(()=>{
                if(luggageValue || seatValue){
                 // var filteredposts1=[];
                  console.log(this.state.filteredposts);
                  console.log(this.state.searchEmpty);
                  
                  if(luggageValue)
                  filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["luggage"]>=luggageValue):this.state.posts.filter(post => post["luggage"]>=luggageValue);
                  console.log(filteredposts1);
                  if(seatValue)
                  filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["seats"]>=seatValue):this.state.posts.filter(post => post["seats"]>=seatValue);
                  console.log(filteredposts1);
                  this.setState({filteredposts:filteredposts1});
                  console.log(this.state.filteredposts);
                  
                  
                }

                else if(viaValue){
                 
                  console.log(this.state.filteredposts);
                  console.log(this.state.searchEmpty);
                  
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
                  


                  
                  console.log(filteredposts1);
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
            console.log(this.state.searchEmpty);
            console.log(this.state.posts);
            console.log(this.state.filteredposts);
            console.log(val1);
            console.log(id1);
            
            setTimeout(()=>{var filteredvalues=(!this.state.searchEmpty && !this.state.filteredposts==undefined && !Array.isArray(this.state.filteredposts) && !this.state.filteredposts.length)?this.state.filteredposts.filter(post => post[id1].toLowerCase()==val1):this.state.posts.filter(post => post[id1].toLowerCase()==val1);
            console.log(filteredvalues);
            filteredvalues.map(x=>{
            filteredposts1.push(x);
            });
          
            console.log(filteredposts1);
          this.state.filteredposts=filteredposts1;
          this.setState({filteredposts:filteredposts1});
        },6000);
      
          }
}
      else{
        console.log(this.state.requests);
        console.log(arrivalValue);
        console.log(originValue);
        if(originValue && id1=="arrival")
        {
          var filteredposts1=[];
          console.log(this.state.requests);
          this.state.requests.map(x=>{
            //   var x=this.state.posts[12];
            console.log("my dest "+viaValue);
            console.log("my origin "+originValue);
            console.log("post dest "+x.arrival);
            console.log("post origin "+x.origin);
            // setTimeout(()=>{
             //  this.onmyway(x.arrival,val1,originValue)},3000);
           //const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
             //console.log(this.onmyway(x.arrival,val1,originValue));

           // const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
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
             // return await result;
            console.log(result);
            if(await result)
            {
              console.log("ontheroute");
              console.log(filteredposts1);
              console.log(this.state.filteredposts);
              console.log(this.state.searchEmpty);
             
              var filteredvalues=!this.state.searchEmpty?this.state.requests.filter(post => post["arrival"]==x.arrival):this.state.requests.filter(post => post["arrival"]==x.arrival);
              console.log(filteredvalues);
              filteredvalues.map(x=>{
              filteredposts1.push(x);
              });
              console.log(filteredposts1);
              filteredposts1=[... new Set(filteredposts1)];
              //this.setState({filteredposts:filteredposts1});
              setTimeout(()=>{
              if(luggageValue || seatValue){
               // var filteredposts1=[];
                console.log(this.state.filteredposts);
                console.log(this.state.searchEmpty);
                
                if(luggageValue)
                filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["luggage"]>=luggageValue):this.state.requests.filter(post => post["luggage"]>=luggageValue);
                if(seatValue)
                filteredposts1= !this.state.searchEmpty?filteredposts1.filter(post => post["seats"]>=seatValue):this.state.requests.filter(post => post["seats"]>=seatValue);
                console.log(filteredposts1);
                this.setState({filteredposts:filteredposts1});
                console.log(this.state.filteredposts);
                
                
              }
              if(viaValue){
               
                console.log(this.state.filteredposts);
                console.log(this.state.searchEmpty);
                filteredposts1=(!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && this.state.filteredposts.length)?this.state.filteredposts.filter(post => post["via"].toLowerCase()==viaValue):this.state.requests.filter(post => post["via"].toLowerCase()==viaValue);
                console.log(filteredposts1);
                this.state.filteredposts=filteredposts1;
                this.setState({filteredposts:filteredposts1});
                
             
              }
            },6000);
            }
          }).catch((reject)=>{
            console.log("on the route error");
          });
          //setTimeout(()=>{console.log(onmywayresult);},6000);
          }    
  /* map loop */
 }) 
        }
        else{
          var filteredvalues=(!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && this.state.filteredposts.length)?this.state.filteredposts.filter(post => post[id1].toLowerCase()==val1):this.state.requests.filter(post => post[id1].toLowerCase()==val1);
          console.log(filteredvalues);
          filteredvalues.map(x=>{
          filteredposts1.push(x);
          });
          console.log(filteredposts1);
        this.state.filteredposts=filteredposts1;
        this.setState({filteredposts:filteredposts1});

        }
      }
        //this.state.filteredposts=filteredposts1;
        this.setState({filteredposts:filteredposts1});
        console.log(this.state.filteredposts);
       
          //this.props.allposts.map(currentpost => (console.log(currentpost[id])));
        }
        else{
          if(this.state.value=="Post")
          {
            console.log(titleValue);
            console.log(this.state.filteredposts);
            filteredvalues= (!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && this.state.filteredposts.length)?this.state.filteredposts.filter(post => post["title"].toLowerCase().includes(titleValue)):this.state.posts.filter(post => post["title"].toLowerCase().includes(titleValue));
            filteredvalues.map(x=>{
              filteredposts1.push(x);
              });
            console.log(filteredposts1);
          //  filteredposts1= !this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]==val1);
          this.state.filteredposts=filteredposts1; 
          this.setState({filteredposts:filteredposts1});
          console.log(this.state.filteredposts);

         }
         else{
          console.log(this.state.filteredposts);
          filteredvalues= (!this.state.searchEmpty && !this.state.filteredposts==undefined && Array.isArray(this.state.filteredposts) && this.state.filteredposts.length)?this.state.filteredposts.filter(post => post["title"].toLowerCase().includes(titleValue)):this.state.requests.filter(post => post["title"].toLowerCase().includes(titleValue));
          filteredvalues.map(x=>{
            filteredposts1.push(x);
            });
          console.log(filteredposts1);
          this.state.filteredposts=filteredposts1;
          this.setState({filteredposts:filteredposts1});
          console.log(this.state.filteredposts);

         }

         console.log(filteredposts1);
         this.state.filteredposts=filteredposts1;
        this.setState({filteredposts:filteredposts1});
         console.log(this.state);
         console.log("title");
       }
     });
     filteredpostsonmyroute=this.state.filteredposts;
     console.log(filteredpostsonmyroute);
     
         resolve(filteredpostsonmyroute);
      
     
  });

  let thenProm3=promise3.then(async(filteredpostsonmyroute)=>{
    console.log(filteredpostsonmyroute);
   //resolve(filteredpostsonmyroute);
    return await filteredpostsonmyroute;

    
  }).catch((error)=>
  console.log(error)
  )
  
return thenProm3;
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
    this.setState({posts:posts});
    this.props.likePost(id,posts[index]);
    
    }
    //this.setState({post});
    this.forceUpdate();
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
    this.setState({posts:posts});
    console.log(posts[index]);
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
      console.log(typeof post);
      const index = posts.indexOf(post);
      const id=post.id;
      console.log(index);
    //posts[index] = posts[index];
    
    posts[index].spamReported = !posts[index].spamReported;
    // posts[index] = { post };
    
   

    console.log(posts[index]);
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
    // this.requests=[];
    // this.posts=[];
    const { history } = this.props;
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
    console.log(this.state.filteredposts);
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
                  <button className="btn pink lighten-1 buttons filter-buttons" onClick={this.handleApply} >Apply</button>
                </div>
                
                <div className="input-field">
                  <button className="btn pink lighten-1 buttons filter-buttons" onClick={this.handleReset} >Reset</button>
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
  console.log(state);


  // const initialposts=state.firestore.ordered.posts;
  const totalspams=state.firestore.ordered.spams;
  if(totalspams)
    var spamreports= totalspams.filter(s=>s.isSpam==true);
   console.log(spamreports);
  // console.log(initialposts);
  //   const validposts=initialposts.filter(p=>!spamposts.includes(p));
  // console.log(validposts);

var spamposts=[];
  //const state=this.state;
  if(state.firestore.ordered.posts && spamreports)
  {
    spamreports.map((s)=>{
      console.log(s);
    
 const spampost=state.firestore.ordered.posts.filter(p=>s.postId==p.id);
 console.log(spampost);
  spampost.map(x=>{
    spamposts.push(x);
    });
    });
  console.log(spamposts);
  
   validposts=state.firestore.ordered.posts.filter(p=>!(spamposts.includes(p)));
  

  console.log(validposts)
  }
  return {
     allposts: validposts,
    //allposts: state.firestore.ordered.posts,
    allrequests:state.firestore.ordered.requests,
    auth:state.firebase.auth,
    notifications: state.firestore.ordered.notifications,
    spams:state.firestore.ordered.spams
    //  loading: state.movies.loading
    
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