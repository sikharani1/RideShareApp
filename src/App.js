import React, { Component } from 'react';
import { BrowserRouter as Router , Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Signal from './components/layout/Signal'
import Dashboard from './components/dashboard/Dashboard'
import PostDetails from './components/posts/PostDetails'
import PostView from './components/posts/PostView'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import CreatePost from './components/posts/CreatePost'
import MyAccount from './components/auth/MyAccount'
import Fallback from './components/dashboard/Fallback'
import AdminPanel from './components/dashboard/AdminPanel'

var x = "Is the browser online? " + navigator.onLine;
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
        

          <Signal/>
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