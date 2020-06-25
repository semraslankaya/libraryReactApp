import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import { HomeWrapper } from "./style";
import NowShowload from "./NowShowload";
const config = require('../../config.json');

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allBooks: [],
            filterBooks: []
        }
    }

    componentDidMount = () => {
        this.getAllBooks();
    }
    getAllBooks = async () => {
        const allBooks = await axios.get(config.api.invokeUrlget)
        this.setState({ allBooks: allBooks.data })
    };

    render() {
        if (localStorage.getItem("token") === null) {
            return (<Redirect to="/" />)
        } else {
            return (
                <HomeWrapper>
                    <NowShowload books={this.state.allBooks} />
                </HomeWrapper>
            );
        }
    }
}
