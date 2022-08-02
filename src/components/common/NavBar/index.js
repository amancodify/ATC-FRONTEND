import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { isLoggedIn, logout } from '../../../utils/auth';
import CompLogo from "../../../assets/logo.png";

const AtcNav = () => {
    let atcBtn = isLoggedIn() ? (
        <NavDropdown className="navitem text-right" title="ATC PORTAL" id="basic-nav-dropdown">
            <NavDropdown.Item href="/atcportal">Dashboard</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
        </NavDropdown>
    ) : (
        <Nav.Link className="navitem atc-portal text-right" href="/atcportal">
            ATC PORTAL
        </Nav.Link>
    );
    return (
        <div className="navbar-main">
            <Navbar bg="dark" expand="lg" variant="dark" fixed="top" className="navbar-main">
                <Navbar.Brand href="/">
                    <img alt="" src={CompLogo} height="38" className="d-inline-block align-top" />{' '}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="navbarToggleExternalContent">
                    <Nav className="nav-items">
                        <Nav.Link className="navitem text-right" href="/#our-story">Our Story</Nav.Link>
                        <Nav.Link className="navitem text-right" href="/#partners">Partners</Nav.Link>
                        <Nav.Link className="navitem text-right" href="/#career">Career</Nav.Link>
                        <Nav.Link className="navitem text-right" href="/events">Events</Nav.Link>
                        <Nav.Link className="navitem text-right" href="/about">About us</Nav.Link>
                        {atcBtn}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default AtcNav;
