import React from 'react';
import "./style.scss";
import { LoginBox } from './LoginBox/index';
import { RegisterBox } from './RegisterBox/index';
import Footer from '../Footer/index';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLogginOpen: true, isRegisterOpen: false }
    }

    async showLoginBox() {
        this.setState({ isLogginOpen: true, isRegisterOpen: false })
    }

    async showRegisterBox() {
        this.setState({ isLogginOpen: false, isRegisterOpen: true })
    }

    render() {

        return (
            <div className="root-container">
                <div className="box-controller">
                    <div className={"controller " + (this.state.isLogginOpen ? "selected-controller" : "" )} onClick={this.showLoginBox.bind(this)}>
                        Login
                </div>
                    <div className={"controller " + (this.state.isRegisterOpen ? "selected-controller" : "" )} onClick={this.showRegisterBox.bind(this)}>
                        Register
                </div>
                </div>

                <div className="box-container">
                    {this.state.isLogginOpen && <LoginBox />}
                    {this.state.isRegisterOpen && <RegisterBox />}
                </div>
                <Footer />
            </div>
        )
    }
}