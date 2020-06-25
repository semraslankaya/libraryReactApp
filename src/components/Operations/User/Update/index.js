import React, { Component } from 'react';
import "./style.scss";
import swal from '@sweetalert/with-react';
import axios from 'axios';

const config = require('../../../../config.json');

export class UpdatePopup extends Component {

    constructor(props) {
        super(props);

        // this.handleSave = this.handleSave.bind(this);
        this.state = {
            Username: "",
            Password: "",
            Email: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            Username: nextProps.Username,
            Password: nextProps.Password,
            Email: nextProps.Email
        });
    }

    usernameHandler(e) { this.setState({ Username: e.target.value }); }
    passwordHandler(e) { this.setState({ Password: e.target.value }); }
    emailHandler(e) { this.setState({ Email: e.target.value }); }

    handlePatchBook = async () => {
        try {
            const params = {
                "Username": this.state.Username,
                "Password": this.state.Password,
                "Email": this.state.Email,
            };
            await axios.patch(`${config.api.invokeUrl}/user/${this.state.Username}`, params);
            swal({
                title: "Good job!",
                text: "User updated!",
                icon: "success"
            });
            setTimeout(() => { window.location.reload(true); }, 2000)
        } catch (err) {
            swal({
                title: `An error has occurred: ${err}!`,
                icon: "warning"
            });
            console.log(`Error updating product: ${err}`);
        }
    }

    render() {
        return (
            <div className="modal fade" id="patchModal" tabIndex="-1" role="dialog" aria-labelledby="patchModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="patchModalLabel">Edit User</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="form-group col-md-12">
                                    <span className="modal-lable">Username:</span>
                                    <input
                                        className="form-kontrol col-md-12"
                                        type="text"
                                        placeholder="Username"
                                        value={this.state.Username}
                                        onChange={(e) => this.usernameHandler(e)}
                                        disabled
                                    />
                                </div>
                                <div className="form-group col-md-12">
                                    <span className="modal-lable">Password:</span>
                                    <input
                                        className="form-kontrol col-md-12"
                                        type="text"
                                        placeholder="Password"
                                        value={this.state.Password}
                                        onChange={(e) => this.passwordHandler(e)}
                                        disabled
                                    />
                                </div>
                                <div className="form-group col-md-12">
                                    <span className="modal-lable">Email:</span>
                                    <input
                                        className="form-kontrol col-md-12"
                                        type="text"
                                        placeholder="Email"
                                        value={this.state.Email}
                                        onChange={(e) => this.emailHandler(e)}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => { this.handlePatchBook() }}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}