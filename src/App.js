import React, { Component } from 'react';
import { BrowserRouter as Router , Switch, Route } from 'react-router-dom'
import Navbar from './uicomponents/uilayout/Navbar'
import Footer from './uicomponents/uilayout/Footer'
import Signal from './uicomponents/uilayout/Signal'
import Dashboard from './uicomponents/dashboard/Dashboard'
import PostDetails from './uicomponents/posts/PostDetails'
import PostView from './uicomponents/posts/PostView'
import SignIn from './uicomponents/authentication/SignIn'
import SignUp from './uicomponents/authentication/SignUp'
import CreatePost from './uicomponents/posts/CreatePost'
import MyAccount from './uicomponents/authentication/MyAccount'
import Fallback from './uicomponents/dashboard/Fallback'
import AdminPanel from './uicomponents/dashboard/AdminPanel'

var x = "Is the browser online? " + navigator.onLine;
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          {/* <Signal/> */}
          <Navbar />
          <Footer />
          <Switch>
            <Route exact path='/'component={Dashboard} />
            <Route path='/fallback'component={Fallback} />
            <Route path='/post/:id' component={PostView} />
            <Route path='/update/post/:id' component={PostDetails} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/myaccount' component={MyAccount} />
            <Route path='/create' component={CreatePost} />
            <Route path='/admin' component={AdminPanel} />
          </Switch>
          
        </div>
      </Router>
    );
  }
}

export default App;