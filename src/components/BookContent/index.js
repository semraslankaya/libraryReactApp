import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
// https://isbnsearch.org/isbn/3442446937

export default function BookContent(props) {
    const [book, setBook] = useState({})
    useEffect(() => {
        Axios.get(`https://d6r4hl8fs5.execute-api.us-east-1.amazonaws.com/library/books/${props.match.params.BookId}`)
            .then((res) => setBook(res.data))
            .catch((err) => console.error(err))

    }, [])
    return (
        <Container className="mt-12" style={{ marginTop: "10px" }}>
            <Row>
                <Col md="6">
                    <img src={`${book.ImageURL}`} style={{ height: "650px", width: "450px" }}></img>
                </Col>
                <Col md="6">
                    <h2> {book.BookName} </h2>
                    <h5> by {book.BookAuthor} </h5>
                    <p>{book.Summary} </p>
                    <ul>
                        {/* <li>Author: {book.BookAuthor}</li> */}
                        <li>Publisher: {book.Publisher}</li>
                        <li>Year Of Publication: {book.YearOfPublication}</li>
                        <li>ISBN: {book.ISBN}</li>
                        <li>Type: {book.Type}</li>
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}