import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const config = require('../../../config.json');

export class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        let adminLogin = false
        this.state = {
            username: "",
            password: "",
            redirect: false,
            users: [],
            errors: [],
            pwdState: null,
        }
    }

    fetchUser = async () => {
        try {
            const res = await axios.get(`${config.api.invokeUrl}/user`);
            const datas = res.data;
            this.setState({ users: datas });
        } catch (err) {
            console.log(`An error has occurred: ${err}`);
        }
    }

    async showValidationError(element, message) {
        this.setState((prevState) => ({ errors: [...prevState.errors, { element, message }] }))
    }

    async onUsernameChanges(e) {
        this.setState({ username: e.target.value })
        this.clearValidationError("username");
    }

    async onPasswordChanges(e) {
        this.setState({ password: e.target.value });
        this.clearValidationError("password");
    }

    async clearValidationError(element) {
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

    async submitLogin(event) {
        if (this.state.username === "") {
            this.showValidationError("username", "Username Cannot be empty!");
        }
        if (this.state.password === "") {
            this.showValidationError("password", "Password Cannot be empty!");
        }

        if (this.state.username && this.state.password) {
            try {
                const res = await axios.get(`${config.api.invokeUrl}/user`);
                const datas = res.data;
                if (datas.find(x => x.Username === this.state.username)) {
                    if (datas.find(x => x.Username === this.state.username).Password === this.state.password) {
                        localStorage.setItem("token", this.state.username);
                        this.setState({ redirect: true });
                        if (this.state.username === "admin") {
                            this.setState({ adminLogin: true, redirect: true });
                        }
                    } else {
                        this.showValidationError("password", "Wrong password!")
                    }
                } else {
                    this.showValidationError("username", "Wrong username!")
                }
            } catch (err) {
                console.log(`An error has occurred: ${err}`);
            }
        }
    }


    render() {

        let usernameErr = null, passwordErr = null;

        for (let err of this.state.errors) {
            if (err.element === "username") {
                usernameErr = err.message;
            } if (err.element === "password") {
                passwordErr = err.message;
            }
        }

        if (this.state.redirect) {
            return <Redirect to={"/home"} />
        }

        return (
            <div className="base-container">

                <div className="header">Login</div>
                <div className="content">
                    <div className="image">
                        <img src="/books.png" />
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" placeholder="User Name" onChange={this.onUsernameChanges.bind(this)} />
                            <small className="danger-error"> {usernameErr ? usernameErr : ""}</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" placeholder="Password" onChange={this.onPasswordChanges.bind(this)} />
                            <small className="danger-error"> {passwordErr ? passwordErr : ""}</small>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button type="button" className="btn" onClick={event => this.submitLogin(event)}> Login </button>
                </div>
            </div>
        )
    }
}
