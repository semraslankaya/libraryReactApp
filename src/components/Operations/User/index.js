import React, { Component } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSort } from "react-icons/fa";
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { UpdatePopup } from './Update/index';
import { Link, Redirect } from 'react-router-dom';

const config = require('../../../config.json');

export default class OperationUser extends Component {

    constructor(props) {
        super(props);

        let adminLogin = true;
        const token = localStorage.getItem("token")
        if (token !== "admin") {
            adminLogin = false
        }

        this.state = {
            isLoading: false,
            sort: {
                direction: 'desc',
            },
            newData: {
                "Username": "",
                "Password": "",
                "Email": ""
            },
            datas: [],
            requiredItem: 0,
            adminLogin
        };
        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.saveModalOpen = this.saveModalOpen.bind(this);
    }



    fetchDatas = async () => {
        // add call to AWS API Gateway to fetch datas here
        // then set them in state
        try {
            const res = await axios.get(`${config.api.invokeUrl}/user`);
            const datas = res.data;
            this.setState({ datas: datas, isLoading: false });
        } catch (err) {
            console.log(`An error has occurred: ${err}`);
        }
    }

    componentDidMount = () => {
        this.fetchDatas();
    }

    async replaceModalItem(index) {
        this.setState({
            requiredItem: index
        });
    }


    saveModalOpen(data) {
        const requiredItem = this.state.requiredItem;
        let newdata = this.state.datas;
        newdata[requiredItem] = data;
        this.setState({ datas: newdata });
    }

    handleDeleteUser = async (username, event) => {
        event.preventDefault();
        // add call to AWS API Gateway delete user endpoint here
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this user!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                try {
                    axios.delete(`${config.api.invokeUrl}/user/${username}`);
                    const updatedDatas = [...this.state.datas].filter(user => user.Username !== username);
                    this.setState({ datas: updatedDatas });
                    swal({
                        title: "Good job!",
                        text: "User deleted!",
                        icon: "success"
                    });
                } catch (err) {
                    console.log(`Unable to delete product: ${err}`);
                }
            } else {
                swal("Your user is safe!");
            }
        })

    }

    handleAddUser = async (username, event) => {
        event.preventDefault();
        // add call to AWS API Gateway add product endpoint here
        try {
            const params = {
                "Username": username,
                "Password": this.state.newData.Password,
                "Email": this.state.newData.Email
            };
            await axios.post(`${config.api.invokeUrl}/user/${username}`, params);
            this.setState({ datas: [...this.state.datas, this.state.newData] });
            this.setState({ newData: { "Username": "", "Password": "", "Email": "" } });
            swal({
                title: "Good job!",
                text: "User created!",
                icon: "success"
            });
        } catch (err) {
            swal({
                title: `An error has occurred: ${err}!`,
                icon: "warning"
            });
            console.log(`An error has occurred: ${err}`);

        }
    }

    onAddUsernameChange = event => this.setState({ newData: { ...this.state.newData, "Username": event.target.value } });
    onAddPasswordChange = event => this.setState({ newData: { ...this.state.newData, "Password": event.target.value } });
    onAddEmailChange = event => this.setState({ newData: { ...this.state.newData, "Email": event.target.value } });

    onSort(event, sortKey) {
        // var column = sortKey;
        const direction = this.state.sort ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const datas = this.state.datas;
        const sortedDatas = datas.sort((a, b) => {
            const nameA = a[sortKey];
            const nameB = b[sortKey];
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        if (direction === 'desc') {
            sortedDatas.reverse();
        }
        this.setState({
            datas: sortedDatas,
            sort: {
                direction,
            }
        });
    }

    render() {
        if (localStorage.getItem("token") === null) {
            return (<Redirect to="/" />)
        } else {

            const isLoading = this.state.isLoading;
            const allDatas = this.state.datas;

            if (this.state.adminLogin === false) {
                return (
                    <div style={{ marginTop: "15px", textAlign: "center" }}>
                        <h2>**You do not have permission to access this page**</h2>
                        <Link to="/home" className="nav-link">Go to home page</Link>
                    </div>
                )
            }

            if (isLoading) return (<div>Loading...</div>);


            let datas_row = allDatas.map((user, index) => {
                return (
                    <tr key={user.Username}>
                        <td>{user.Username}</td>
                        <td>{user.Password}</td>
                        <td>{user.Email}</td>
                        <td><Button className="btn btn-lg btn-danger" onClick={event => this.handleDeleteProduct(user.Username, event)}><FaTrash /> DELETE</Button></td>
                        <td><Button className="btn btn-lg btn-info" data-toggle="modal" data-target="#patchModal"
                            onClick={() => this.replaceModalItem(index)}>
                            <FaEdit /> EDIT </Button>
                        </td>
                    </tr>
                )
            });

            const requiredItem = this.state.requiredItem;
            let modalData = this.state.datas[requiredItem];

            return (
                <div>
                    <Container>
                        <div className="row">
                            <div className="col">
                                <form onSubmit={event => this.handleAddProduct(this.state.newData.Username, event)}>
                                    <div className="field has-addons">
                                        <div className="card" style={{ marginTop: "5px", marginBottom: "5px", backgroundColor: "gray" }}>
                                            <div className="card-header">
                                                <p><b>Add New User</b></p>
                                                <hr></hr>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="Username"
                                                                value={this.state.newData.Username}
                                                                onChange={this.onAddUsernameChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="Password"
                                                                value={this.state.newData.Password}
                                                                onChange={this.onAddPasswordChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="Email"
                                                                value={this.state.newData.Email}
                                                                onChange={this.onAddEmailChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button type="submit" className="button is-primary is-medium">Create User</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col">
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th onClick={e => this.onSort(e, 'Username')}>Username<FaSort /></th>
                                            <th onClick={e => this.onSort(e, 'Password')}>Password<FaSort /></th>
                                            <th onClick={e => this.onSort(e, 'Email')}>Email<FaSort /></th>
                                            <th colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.datas.length === 0 ?
                                            <tr>
                                                <td colSpan="5">All cought up!</td>
                                            </tr> : datas_row
                                        }

                                        <UpdatePopup
                                            Username={modalData === undefined ? "" : modalData.Username}
                                            Password={modalData === undefined ? "" : modalData.Password}
                                            Email={modalData === undefined ? "" : modalData.Email}
                                            saveModalOpen={this.saveModalOpen}
                                        ></UpdatePopup>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Container>
                </div>
            )
        }
    }
}