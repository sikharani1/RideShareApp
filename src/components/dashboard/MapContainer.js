// import React, { Component } from 'react';
// import { Map,GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
// import Geocode from "react-geocode";
// // import CurrentLocation from './Map';
// const mapStyles = {
//     width: '100%',
//     height: '100%',
//   };
// export class MapContainer extends React.Component {
    
//     render() {
//         return (
//             <Map
//               google={this.props.google}
//               zoom={8}
//               style={mapStyles}
//               initialCenter={{ lat: 47.444, lng: -122.176}}
//             />
//         );
//       }
//     }
//       MapContainer= GoogleApiWrapper({
//         apiKey: 'AIzaSyDjzMckE87fEvdaWGFcv7lsGNVhJY9-zNM'
//       })(MapContainer);
// //     render() {
// //         const style = {
// //             width: '100vw',
// //             height: '100vh'
// //           }
// //       if (!this.props.loaded) {
// //         return <div>Loading...</div>
// //       }
// //       return (
// //         <div style={style}><Map google={this.props.google} /></div>
// //       )
// //     }
// //   }


// //   state = {
// //     showingInfoWindow: false,
// //     activeMarker: {},
// //     selectedPlace: {}
// //   };

// //   onMarkerClick = (props, marker, e) =>
// //     this.setState({
// //       selectedPlace: props,
// //       activeMarker: marker,
// //       showingInfoWindow: true
// //     });

// //   onClose = props => {
// //     if (this.state.showingInfoWindow) {
// //       this.setState({
// //         showingInfoWindow: false,
// //         activeMarker: null
// //       });
// //     }
// //   };

// //   render() {
// //     return (
// //       <CurrentLocation
// //         centerAroundCurrentLocation
// //         google={this.props.google}
// //       >
// //         <Marker onClick={this.onMarkerClick} name={'Current Location'} />
// //         <InfoWindow
// //           marker={this.state.activeMarker}
// //           visible={this.state.showingInfoWindow}
// //           onClose={this.onClose}
// //         >
// //           <div>
// //             <h4>{this.state.selectedPlace.name}</h4>
// //           </div>
// //         </InfoWindow>
// //       </CurrentLocation>
// //     );
// //   }
// // }
  
// //   export default GoogleApiComponent({
// //     apiKey: AIzaSyDYikvqGygrn3Vvq1oIL6hUgUz5pgVYsfA
// //   })(MapContainer)
