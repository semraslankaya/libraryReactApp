import React, { Component } from "react";
import { Row, Col, ListGroup, ListGroupItem, Form, FormControl } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';

const config = require('../../config.json');
function searchText(term) {
    return function (x) {
        return x.BookName.toLowerCase().includes(term.toLowerCase()) || !term;
    }}
export default class AllBooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allBooks: [],
            filterBooks: [],
            term: '',
        }
        this.searchHandler = this.searchHandler.bind(this);
    }
    getAllBooks = async () => {
        const books = await axios.get(config.api.invokeUrlget)
        this.setState({ allBooks: books.data, filterBooks: books.data })
    };
    componentDidMount = () => {
        this.getAllBooks();
    }
    onChangeBookList(event) {
        if (event.target.value === "WorldsClassics") {
            this.state.allBooks = this.state.filterBooks
            const filterWorld = this.state.allBooks.filter(x => x.Type === "World's Classics");
            this.setState({ allBooks: filterWorld })
        } else if (event.target.value === "DeepArchieve") {
            this.state.allBooks = this.state.filterBooks
            const filterDeep = this.state.allBooks.filter(x => x.Type !== "World's Classics");
            this.setState({ allBooks: filterDeep })
        } else if (event.target.value === "AllBooks") {
            this.setState({ allBooks: this.state.filterBooks })
        }
    }
    searchHandler(event) { this.setState({ term: event.target.value }) }
    render() {
        if (localStorage.getItem("token") === null) {
            return (<Redirect to="/" />)
        } else {
            const bookList = this.state.allBooks;
            return (
                <div style={{ marginLeft: "50px", marginRight: "50px" }}>
                    <div className="row">
                        <div style={{ marginTop: "10px" }} className="col-md-4">
                            <select className="form-control" style={{ backgroundColor: "#F2F3F4" }} onChange={(e) => this.onChangeBookList(e)}>
                                <option value="AllBooks">All Books</option>
                                <option value="WorldsClassics">World's Classic</option>
                                <option value="DeepArchieve">Deep Archieve</option>
                            </select>
                        </div>
                        <div style={{ marginTop: "10px", justifyContent: "flex-end", marginLeft: "auto" }}>
                            <Form inline className="ml-auto">
                                <FaSearch />
                                <FormControl
                                    style={{ padding: "0 20px", borderRadius: "100px", backgroundColor: "#F2F3F4" }}
                                    type="text"
                                    placeholder="Search"
                                    className="mr-sm-2"
                                    onChange={this.searchHandler} value={this.state.term}/>
                            </Form>
                        </div>
                    </div>
                    <ListGroup >
                        {bookList.filter(searchText(this.state.term)).map(function (books) {
                            return (
                                <React.Fragment key={books.BookId}>
                                    <ListGroupItem style={{ marginTop: "10px", backgroundColor: "#F2F3F4" }}>
                                        <Row>
                                            <Link to={`/books/${books.BookId}`}>
                                                <Col md="3">
                                                    <img src={`${books.ImageURL}`} style={{ marginLeft: "30px", padding: "center", height: "200px", width: "150px" }} />
                                                </Col>
                                            </Link>
                                            <Col md="9">
                                                <Link to={`/books/${books.BookId}`}>
                                                    <h2> {books.BookName} </h2>
                                                </Link>
                                                <ul>
                                                    <li>Author: {books.BookAuthor}</li>
                                                    <li>Publisher: {books.Publisher}</li>
                                                    <li>Year Of Publication: {books.YearOfPublication}</li>
                                                    <li>ISBN: {books.ISBN}</li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                </React.Fragment>
                            );
                        })}
                    </ListGroup>
                </div >
            );
        }
    }
}
