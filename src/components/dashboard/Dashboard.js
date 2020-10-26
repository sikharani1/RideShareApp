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
import PostSummary from '../posts/PostSummary'
import {Link} from 'react-router-dom'
import {updatePost} from '../../store/actions/postActions'
import { bookmarkPost } from '../../store/actions/bookmarkAction'
import Geocode from "react-geocode";
import * as geolib from 'geolib';
import {SphericalUtil, PolyUtil} from "node-geometry-library";


import {MapContainer} from '../dashboard/MapContainer'
import { yellow } from '@material-ui/core/colors'
import { Result } from 'react-lodash'

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
    this.handleChange=this.handleChange.bind(this);
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
        initialValue:''
        
      })
  }
  
 async componentDidMount() {
   await(this.props.allposts)
   console.log(this.props);
    this.setState({
      filteredposts:''
    })
    console.log(this.state.filteredposts);
  //this.initialize();
   console.log(this.ispointwithinradius()); 

   
  }
  
  // createGoogleMap = () =>
  //   new window.google.maps.Map(this.googleMapRef.current, {
  //     zoom: 16,
  //     center: 
  //       myPosition
  //     ,
  //     disableDefaultUI: true,
  //   })

  // createMarker = () =>
  //   new window.google.maps.Marker({
  //     position: myPosition,
  //     map: this.googleMap,
  //   })

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
   var resultfilteredsposts=this.getposts(this.state.searchString);
   console.log(resultfilteredsposts);
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
 // resolve(origlat,origlng,filtdestlat,filtdestlng,destlat,destlng);
  
  // (origlat,origlng,filtdestlat,filtdestlng,destlat,destlng)
  
    //console.log(origlat+" "+origlng+" "+filtdestlat+" "+filtdestlng+" "+destlat+" "+destlng);
    //resolve(origlat,origlng,filtdestlat,filtdestlng,destlat,destlng);
       // let onmyway=this.onTheRoute(origlat,origlng,filtdestlat,filtdestlng,destlat,destlng);
       // return onmyway;
  });

let thenProm=promise.then(async(finalArr)=>{
  // console.log(result);
  // finalArr=result;
  console.log(finalArr);
  return await finalArr;
  //let onmyway=this.onTheRoute(origlat,origlng,filtdestlat,filtdestlng,destlat,destlng);
  
  // if(finalArr)
  // {
    
  // }
  
 
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
  // onmyway=async(dest,filtdest,orig) =>{
  //   console.log(dest,filtdest,orig);
  //   console.log(this.calculateLatLng(dest,filtdest,orig));
  //     const finalArr=await this.calculateLatLng(dest,filtdest,orig);
  //     console.log(finalArr);
  //   if(finalArr) this.onTheRoute(finalArr);
    
  // }

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
    //     .then((result)=>{
    //   console.log(result);
    //   return result;
    // }).catch(error=>
    //   console.log(error));
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
    
   
 
// }).then((onmyroute)=>{ return onmyroute }).catch((err)=>{
//      console.log("error");
//    })

//})
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
    // console.log(id);
    this.state.searchEmpty=false;
    this.setState({searchEmpty:false});
    console.log(this.props.allposts);
    console.log(searchString.entries());
    const iterator1 = Object.entries(searchString);
    console.log(iterator1);
    
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
       
       console.log(("origin" in searchString));
      if(id1!="title")  {
        if(this.state.value=="Post")
         {
          console.log(this.state.posts);
          console.log(id1);
          console.log(originValue);
          if(originValue && id1=="arrival")
          {
            var filteredposts1=[];
            console.log(this.state.posts);
             this.state.posts.map(x=>{
              //   var x=this.state.posts[12];
              console.log("my dest "+val1);
              console.log("my origin "+originValue);
              console.log("post dest "+x.arrival);
              console.log("post origin "+x.origin);
              // setTimeout(()=>{
               //  this.onmyway(x.arrival,val1,originValue)},3000);
             //const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
               //console.log(this.onmyway(x.arrival,val1,originValue));

             // const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
            if(x.origin==originValue){
              const onmywayresult=(arrivalvalue,val1,originValue)=>
              {
                var promise=new Promise((resolve,reject)=>
                {
                 
                    const result=this.onmyway(arrivalvalue,val1,originValue);
                    console.log(result);
                    resolve(result);
                
                  
                });
                return promise;
              }
           
          onmywayresult(x.arrival,val1,originValue)
              .then(async(result)=>{
               // return await result;
              console.log(result);
              if(await result)
              {
                console.log("ontheroute");
                console.log(filteredposts1);
                console.log(this.state.filteredposts);
                console.log(this.state.searchEmpty);
               
                var filteredvalues=!this.state.searchEmpty?this.state.posts.filter(post => post["arrival"]==x.arrival):this.state.posts.filter(post => post["arrival"]==x.arrival);
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
                if(viaValue){
                 
                  console.log(this.state.filteredposts);
                  console.log(this.state.searchEmpty);
                  filteredposts1=!this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]==viaValue);
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
  //  console.log(filteredposts1);
   
  //  console.log(this.state.filteredposts);
   
  // if(luggageValue || seatValue){
  //   var filteredposts1=[];
  //   console.log(this.state.filteredposts);
  //   console.log(this.state.searchEmpty);
  //   this.state.filteredposts=filteredposts1;
  //   this.setState({filteredposts:filteredposts1});
  //   filteredposts1= !this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]>=val1);
  //   console.log(filteredposts1);
    
  //   console.log(this.state.filteredposts);
    
  // }
  // if(viaValue){
  //   var filteredposts1=[];
  //   console.log(this.state.filteredposts);
  //   console.log(this.state.searchEmpty);
  //   filteredposts1=!this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]==val1);
  //   console.log(filteredposts1);
  //   this.state.filteredposts=filteredposts1;
  //   this.setState({filteredposts:filteredposts1});
    
 
  // }
   
        
      
  //           console.log(filteredposts1);
  //           this.state.filteredposts=filteredposts1;
            
  //           console.log(this.state.filteredposts);
          }

        // filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1]==val1):this.props.allposts.filter(post => post[id1]==val1);
        
       
      }
      else{
        console.log(this.state.requests);
        console.log(id1);
        console.log(originValue);
        if(originValue && id1=="arrival")
        {
          var filteredposts1=[];
          console.log(this.state.requests);
          this.state.requests.map(x=>{
            //   var x=this.state.posts[12];
            console.log("my dest "+val1);
            console.log("my origin "+originValue);
            console.log("post dest "+x.arrival);
            console.log("post origin "+x.origin);
            // setTimeout(()=>{
             //  this.onmyway(x.arrival,val1,originValue)},3000);
           //const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
             //console.log(this.onmyway(x.arrival,val1,originValue));

           // const onmywayresult= await this.onmyway(x.arrival,val1,originValue).then((result)=>{
          if(x.origin==originValue){
            const onmywayresult=(arrivalvalue,val1,originValue)=>
            {
              var promise=new Promise((resolve,reject)=>
              {
               
                  const result=this.onmyway(arrivalvalue,val1,originValue);
                  console.log(result);
                  resolve(result);
              
                
              });
              return promise;
            }
         
        onmywayresult(x.arrival,val1,originValue)
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
                filteredposts1=!this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.requests.filter(post => post[id1]==viaValue);
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
//  console.log(filteredposts1);
 
//  console.log(this.state.filteredposts);
 
// if(luggageValue || seatValue){
//   var filteredposts1=[];
//   console.log(this.state.filteredposts);
//   console.log(this.state.searchEmpty);
//   this.state.filteredposts=filteredposts1;
//   this.setState({filteredposts:filteredposts1});
//   filteredposts1= !this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]>=val1);
//   console.log(filteredposts1);
  
//   console.log(this.state.filteredposts);
  
// }
// if(viaValue){
//   var filteredposts1=[];
//   console.log(this.state.filteredposts);
//   console.log(this.state.searchEmpty);
//   filteredposts1=!this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]==val1);
//   console.log(filteredposts1);
//   this.state.filteredposts=filteredposts1;
//   this.setState({filteredposts:filteredposts1});
  

// }
 
      
    
//           console.log(filteredposts1);
//           this.state.filteredposts=filteredposts1;
          
//           console.log(this.state.filteredposts);
        }

      // filteredposts1= this.state.filteredposts?this.state.filteredposts.filter(post => post[id1]==val1):this.props.allposts.filter(post => post[id1]==val1);
      
     
        }
        //this.state.filteredposts=filteredposts1;
        this.setState({filteredposts:filteredposts1});
        console.log(this.state.filteredposts);
       
          //this.props.allposts.map(currentpost => (console.log(currentpost[id])));
        }
        else{
          if(this.state.value=="Post")
          {
            console.log(this.state.filteredposts);
            filteredposts1= !this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1].includes(val1)):this.state.posts.filter(post => post[id1].includes(val1));
       
          //  filteredposts1= !this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1]==val1):this.state.posts.filter(post => post[id1]==val1);
          this.state.filteredposts=filteredposts1; 
          this.setState({filteredposts:filteredposts1});
          console.log(this.state.filteredposts);

         }
         else{
          console.log(this.state.filteredposts);
          filteredposts1= !this.state.searchEmpty?this.state.filteredposts.filter(post => post[id1].includes(val1)):this.state.requests.filter(post => post[id1].includes(val1));
          this.state.filteredposts=filteredposts1;
          this.setState({filteredposts:filteredposts1});
          console.log(this.state.filteredposts);

         }

         console.log(filteredposts1);
         //this.state.filteredposts=filteredposts1;
        //  this.setState({filteredposts:filteredposts1});
         console.log(this.state);
         console.log("title");
       }
     });
     filteredpostsonmyroute=this.state.filteredposts;
     resolve(filteredpostsonmyroute);
  });
  let thenProm3=promise3.then(async(filteredpostsonmyroute)=>{
    console.log(filteredpostsonmyroute);
    return await filteredpostsonmyroute;
    
  }).catch((error)=>
  console.log(error)
  )
  console.log(thenProm3);
  setTimeout(()=>{
    console.log(thenProm3);
  },6000)

   
  this.state.filteredposts=filteredpostsonmyroute;
return this.state.filteredposts;
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
        {/* <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        /> */}
        <div
        id="google-map"
        ref={this.googleMapRef}
        style={{ width: '400px', height: '300px' }}
      />
        {/* <MapContainer/> */}
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
                    
                    
                      <TabPanel value="Post"><PostList onLike={this.handleLike.bind(this)} posts={this.state.posts} onBookmark={this.handleBookmark.bind(this)} /></TabPanel> 

                      <TabPanel value="Request"> 
                      <PostList onLike={this.handleLike.bind(this)} posts={this.state.requests} onBookmark={this.handleBookmark.bind(this)} />
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