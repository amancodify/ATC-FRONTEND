import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../../../utils/auth';
import CompLogo from "../../../assets/logo.png";

const AtcNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    let atcBtn = isLoggedIn() ? (
        <NavDropdown className="navitem text-right" title="ATC PORTAL" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/atcportal">Dashboard</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
    ) : (
        <Nav.Link as={Link} className="navitem" to="/atcportal">
            ATC PORTAL
        </Nav.Link>
    );
    
    return (
        <div className="navbar-main">
            <Navbar bg="dark" expand="lg" variant="dark" fixed="top" className="navbar-main">
                <Navbar.Brand as={Link} to="/">
                    <img alt="" src={CompLogo} height="38" className="d-inline-block align-top" />{' '}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="navbarToggleExternalContent">
                    <Nav className="nav-items">
                        <Nav.Link className="navitem text-right" href="/#our-story">Our Story</Nav.Link>
                        <Nav.Link className="navitem text-right" href="/#partners">Partners</Nav.Link>
                        <Nav.Link className="navitem text-right" href="/#career">Career</Nav.Link>
                        <Nav.Link as={Link} className="navitem text-right" to="/events">Events</Nav.Link>
                        <Nav.Link as={Link} className="navitem text-right" to="/about">About us</Nav.Link>
                        {atcBtn}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default AtcNav;
