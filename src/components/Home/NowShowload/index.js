import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function NowShowload({ books }) {

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1
    };
    const worldClassic = books.filter(x => x.Type === "World's Classics");
    const deepArchieve = books.filter(x => x.Type !== "World's Classics");

    return (
        <div style={{ marginLeft: "50px", marginRight: "50px" }}>
            <div className="clearfix mt-5 mb-2">
                <h3 style={{ marginLeft: "50px", fontFamily: "Algerian", color: "#FF4712" }}>World Classic's</h3>
                <Link className="float-right text-uppercase" to="/books" style={{ fontSize: "20px", fontFamily: "Algerian", color: "black" }}>
                    see all books  </Link>
            </div>
            <Slider {...settings} >
                {worldClassic.map(function (worldClassic) {
                    return (
                        <React.Fragment key={worldClassic.BookId}>
                            <Link to={`/books/${worldClassic.BookId}`}>
                                <Col>
                                    <Card>
                                        <Card.Img
                                            height="300px"
                                            variant="top"
                                            src={`${worldClassic.ImageURL}`}
                                        />
                                        <Card.Body >
                                            <span>{worldClassic.BookName}</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Link>
                        </React.Fragment>
                    );
                })}
            </Slider>
            <div className="clearfix mt-5 mb-2">
                <h3 style={{ marginLeft: "50px", fontFamily: "Algerian", color: "#F74C1A" }} >Deep Archive</h3>
                <Link className="float-right text-uppercase" to="/books" style={{ fontSize: "20px", fontFamily: "Algerian", color: "black" }}>
                    see all books  </Link>
            </div>
            <Slider {...settings}>
                {deepArchieve.map(function (deepArchieve) {
                    return (
                        <React.Fragment key={deepArchieve.BookId}>
                            <Link to={`/books/${deepArchieve.BookId}`}>
                                <Col>
                                    <Card>
                                        <Card.Img
                                            height="300px"
                                            variant="top"
                                            src={`${deepArchieve.ImageURL}`}
                                        />
                                        <Card.Body>
                                            <span>{deepArchieve.BookName}</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Link>
                        </React.Fragment>
                    );
                })}
            </Slider>
        </div>
    );
}
