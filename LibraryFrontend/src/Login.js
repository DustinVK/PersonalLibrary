
import React, { Component } from 'react';
import {LOGIN_URL} from './constants.js';
import BookApp from './BookApp';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {isAuthenticated: false, username: '', password: ''}
  
      this.updateUserName = this.updateUserName.bind(this);
      this.updatePassword = this.updatePassword.bind(this);
      this.login = this.login.bind(this);
  
    }

    updateUserName(event) {
        this.setState({username: event.target.value})
    }

    updatePassword(event) {
        this.setState({password: event.target.value})
    }

    login() {
        const requestBody = {
            "username": this.state.username,
            "password": this.state.username
        };
        fetch(LOGIN_URL, {
                  method: 'POST',
                  body: JSON.stringify(requestBody)
                })
                .then(res => {
                  const jwtToken = res.headers.get('Authorization');
                  if (jwtToken !== null) {
                    sessionStorage.setItem("jwt", jwtToken);
                    this.setState({isAuthenticated: true});
                  }
                  else {
                    toast.warn("Username or password invalid", {
                      position: toast.POSITION.BOTTOM_LEFT
                    }) 
                  }
                })
                .catch(err => console.error(err)) 
    }

    render() {
        if (this.state.isAuthenticated) {
            return (<BookApp></BookApp>)
        } else {
            return (
                <div>
                    <ToastContainer autoClose={2000}/>
                    <div class="book-form">
                        <label><h2>Login</h2></label>
                        <p>
                            <label>Username</label>
                            <input type="text" value={this.state.username} onChange={this.updateUserName} required/>
                        </p>
                        <p>
                            <label>Password</label>
                            <input type="text" value={this.state.password} onChange={this.updatePassword} required />
                        </p>
                        <p></p>
                        <Button style={{marginTop:20}} variant="primary" onClick={this.login}>Submit</Button><br></br>
                    </div>
                </div>
            );
        }
    }



  }
  
  export default Login;
