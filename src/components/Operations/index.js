import React, { Component } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSort } from "react-icons/fa";
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { UpdatePopup } from './Update/index';
import { Link, Redirect } from 'react-router-dom';

const config = require('../../config.json');

export default class Operations extends Component {

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
                "BookId": "",
                "BookName": "",
                "ISBN": "",
                "YearOfPublication": "",
                "Publisher": "",
                "BookAuthor": ""
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
            const res = await axios.get(`${config.api.invokeUrl}/books`);
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
    handleDeleteBook = async (bookId, event) => {
        event.preventDefault();
        // add call to AWS API Gateway delete book endpoint here
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this book!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                try {
                    axios.delete(`${config.api.invokeUrl}/books/${bookId}`);
                    const updatedDatas = [...this.state.datas].filter(book => book.BookId !== bookId);
                    this.setState({ datas: updatedDatas });
                    swal({
                        title: "Good job!",
                        text: "Book deleted!",
                        icon: "success"
                    });
                } catch (err) {
                    console.log(`Unable to delete book: ${err}`);
                }
            } else {
                swal("Your book is safe!");
            }
        })

    }

    handleAddBook = async (bookId, event) => {
        event.preventDefault();
        // add call to AWS API Gateway add product endpoint here
        try {
            const params = {
                "BookId": bookId,
                "BookName": this.state.newData.BookName,
                "ISBN": this.state.newData.ISBN,
                "YearOfPublication": this.state.newData.YearOfPublication,
                "Publisher": this.state.newData.Publisher,
                "BookAuthor": this.state.newData.BookAuthor
            };
            await axios.post(`${config.api.invokeUrl}/books/${bookId}`, params);
            this.setState({ datas: [...this.state.datas, this.state.newData] });
            this.setState({
                newData: {
                    "BookId": "", "BookName": "", "ISBN": "", "YearOfPublication": "",
                    "Publisher": "", "BookAuthor": ""
                }
            });
            swal({
                title: "Good job!",
                text: "Book created!",
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

    onAddBookNameChange = event => this.setState({ newData: { ...this.state.newData, "BookName": event.target.value } });
    onAddBookIdChange = event => this.setState({ newData: { ...this.state.newData, "BookId": event.target.value } });
    onAddBookAuthorChange = event => this.setState({ newData: { ...this.state.newData, "BookAuthor": event.target.value } });
    onAddISBNChange = event => this.setState({ newData: { ...this.state.newData, "ISBN": event.target.value } });
    onAddYearOfPublicationChange = event => this.setState({ newData: { ...this.state.newData, "YearOfPublication": event.target.value } });
    onAddPublisherChange = event => this.setState({ newData: { ...this.state.newData, "Publisher": event.target.value } });

    onSort(event, sortKey) {
        const direction = this.state.sort ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const datas = this.state.datas;
        const sortedDatas = datas.sort((a, b) => {
            const nameA = a[sortKey];
            const nameB = b[sortKey];
            if (sortKey === "BookId") { return nameA - nameB; }
            if (nameA < nameB) { return -1; }
            if (nameA > nameB) { return 1; }
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


            let datas_row = allDatas.map((book, index) => {
                return (
                    <tr key={book.BookId}>
                        <td>{book.BookId}</td>
                        <td>{book.BookName}</td>
                        <td>{book.BookAuthor}</td>
                        <td>{book.ISBN}</td>
                        <td>{book.Publisher}</td>
                        <td>{book.YearOfPublication}</td>
                        <td><Button className="btn btn-lg btn-danger" onClick={event => this.handleDeleteBook(book.BookId, event)}><FaTrash /> DELETE</Button></td>
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
                                <form onSubmit={event => this.handleAddBook(this.state.newData.BookId, event)}>
                                    <div className="field has-addons">
                                        <div className="card" style={{ marginTop: "5px", marginBottom: "5px", backgroundColor: "gray" }}>
                                            <div className="card-header">
                                                <p><b>Add New Book</b></p>
                                                <hr></hr>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="Book Id"
                                                                value={this.state.newData.BookId}
                                                                onChange={this.onAddBookIdChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="Book Name"
                                                                value={this.state.newData.BookName}
                                                                onChange={this.onAddBookNameChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="Book Author"
                                                                value={this.state.newData.BookAuthor}
                                                                onChange={this.onAddBookAuthorChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="ISBN"
                                                                value={this.state.newData.ISBN}
                                                                onChange={this.onAddISBNChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="Publisher"
                                                                value={this.state.newData.Publisher}
                                                                onChange={this.onAddPublisherChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <input
                                                                className="form-kontrol"
                                                                type="text"
                                                                placeholder="YearOfPublication"
                                                                value={this.state.newData.YearOfPublication}
                                                                onChange={this.onAddYearOfPublicationChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button type="submit" className="button is-primary is-medium">Create Book</Button>
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
                                            <th onClick={e => this.onSort(e, 'BookId')}>Id<FaSort /></th>
                                            <th onClick={e => this.onSort(e, 'BookName')}>Book Name<FaSort /></th>
                                            <th onClick={e => this.onSort(e, 'BookAuthor')}>Author<FaSort /></th>
                                            <th onClick={e => this.onSort(e, 'ISBN')}>ISBN<FaSort /></th>
                                            <th onClick={e => this.onSort(e, 'Publisher')}>Publisher<FaSort /></th>
                                            <th onClick={e => this.onSort(e, 'YearOfPublication')}>Year Of Publication<FaSort /></th>
                                            <th colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.datas.length === 0 ?
                                            <tr>
                                                <td colSpan="8">All cought up!</td>
                                            </tr> : datas_row
                                        }

                                        <UpdatePopup
                                            BookId={modalData === undefined ? "" : modalData.BookId}
                                            BookName={modalData === undefined ? "" : modalData.BookName}
                                            BookAuthor={modalData === undefined ? "" : modalData.BookAuthor}
                                            ISBN={modalData === undefined ? "" : modalData.ISBN}
                                            Publisher={modalData === undefined ? "" : modalData.Publisher}
                                            YearOfPublication={modalData === undefined ? "" : modalData.YearOfPublication}
                                            Type={modalData === undefined ? "" : modalData.Type ? modalData.Type : ""}
                                            Summary={modalData === undefined ? "" : modalData.Summary ? modalData.Summary : ""}
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