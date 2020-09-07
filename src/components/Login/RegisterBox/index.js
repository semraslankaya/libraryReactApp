
import React from 'react';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { Redirect } from 'react-router-dom';

const config = require('../../../config.json');

export class RegisterBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            errors: [],
            pwdState: null,
            datas: [],
            redirect: false,
        };
    }

    submitRegister = async (event) => {
        event.preventDefault();
        if (this.state.username === "") {
            this.showValidationError("username", "Username Cannot be empty!");
        }
        if (this.state.email === "") {
            this.showValidationError("email", "Email Cannot be empty!");
        }
        if (this.state.password === "") {
            this.showValidationError("password", "Password Cannot be empty!");
        }
        if (this.state.username && this.state.password && this.state.email) {
            try {
                const params = {
                    "Username": this.state.username,
                    "Email": this.state.email,
                    "Password": this.state.password,
                };
                await axios.post(`${config.api.invokeUrl}/user/${this.state.username}`, params);
                swal({
                    title: "Good job!",
                    text: "User created!",
                    icon: "success"
                });
                this.setState({ redirect: true });
            } catch (err) {
                swal({
                    title: `A user already exists in this Username!`,
                    text: `${err}`,
                    icon: "warning"
                });
                console.log(`An error has occurred: ${err}`);
            }
        }

    }
    showValidationError(element, message) {
        this.setState((prevState) => ({ errors: [...prevState.errors, { element, message }] }))
    }
    clearValidationError(element) {
        this.setState((prevState) => {
            let newArr = [];
            for (let err of prevState.errors) {
                if (element !== err.element) {
                    newArr.push(err);
                }
            }
            return { errors: newArr };
        })
    }
    onUsernameChanges(e) {
        this.setState({ username: e.target.value })
        this.clearValidationError("username");
    }

    onEmailChanges(e) {
        this.setState({ email: e.target.value })
        this.clearValidationError("email");
    }

    onPasswordChanges(e) {
        this.setState({ password: e.target.value })
        this.clearValidationError("password");

        this.setState({ pwdState: "weak" });
        if (e.target.value.length > 8) {
            this.setState({ pwdState: "medium" });
        } else if (e.target.value.length > 12) {
            this.setState({ pwdState: "strong" });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/home'} />
        }
        let usernameErr = null, passwordErr = null, emailErr = null;

        for (let err of this.state.errors) {
            if (err.element === "username") {
                usernameErr = err.message;
            }
            if (err.element === "password") {
                passwordErr = err.message;
            }
            if (err.element === "email") {
                emailErr = err.message;
            }
        }
        let pwdWeak = false, pwdMedium = false, pwdStrong = false;
        if (this.state.pwdState === "weak") {
            pwdWeak = true;
        } else if (this.state.pwdState === "medium") {
            pwdWeak = true;
            pwdMedium = true;
        } else if (this.state.pwdState === "strong") {
            pwdWeak = true;
            pwdMedium = true;
            pwdStrong = true;
        }
        return (
            <div className="base-container">

                <div className="header">Register</div>
                <div className="content">
                    <div className="image">
                        <img src="/books.png" alt="books" />
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" placeholder="Username" onChange={this.onUsernameChanges.bind(this)} />
                            <small className="danger-error"> {usernameErr ? usernameErr : ""}</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" placeholder="Email" onChange={this.onEmailChanges.bind(this)} />
                            <small className="danger-error"> {emailErr ? emailErr : ""}</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" placeholder="Password" onChange={this.onPasswordChanges.bind(this)} />
                            <small className="danger-error"> {passwordErr ? passwordErr : ""}</small>
                            {this.state.password &&
                                <div className="password-state">
                                    <div className={"pwd pwd-weak " + (pwdWeak ? "show" : "")}></div>
                                    <div className={"pwd pwd-medium " + (pwdMedium ? "show" : "")}></div>
                                    <div className={"pwd pwd-strong " + (pwdStrong ? "show" : "")}></div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button type="button" className="btn" onClick={event => this.submitRegister(event)}> Register </button>
                </div>
            </div>
        )
    }
}
