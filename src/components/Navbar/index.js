import React, { Component } from 'react';
import { Navbar, Nav } from "react-bootstrap";
import { NavWrapper } from "./style";
import { Link } from "react-router-dom";
import { FaUser, FaBook, FaHome, FaBookOpen, FaPowerOff } from "react-icons/fa";

export default class Navbars extends Component {
  constructor(props) {
    super(props);
    this.state = { show: true, }
  }
  onLogOut(event) {
    localStorage.removeItem("token")
  }
  componentDidMount() {
    if (localStorage.getItem("token") === "admin") {
      this.setState({ show: false })
    }
  }
  render() {
    return (
      <NavWrapper >
        <Navbar expand="lg">
          <Link to="/home" style={{ marginBottom: "10px", marginTop: "10px", marginLeft: "50px", marginRight: "50px" }}>
            <img src="/logo.png" alt="logo" className="img" />
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Link to="/home" className="nav-link"> <FaHome />
                  HOME
              </Link>
              <Link to="/books" className="nav-link"> <FaBook />
                  ALL BOOKS
              </Link>
              <Link to="/operations" className="nav-link" hidden={this.state.show}> <FaBookOpen />
                  OPERATIONS
              </Link>
              <Link to="/operations/user" className="nav-link" hidden={this.state.show}> <FaUser />
                  USERS
              </Link>
            </Nav>
            <div className="navbar-end" >
              <button onClick={e => this.onLogOut(e)}>
                <Link to="/" className="nav-link"> <FaPowerOff />
                    LOG OUT
              </Link>
              </button>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </NavWrapper>
    )
  }
}
