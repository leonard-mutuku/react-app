import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import {Link} from 'react-router-dom';

export default class AppNavbar extends Component {
        constructor(props) {
            super(props);
            this.state = {isOpen: false};
            this.toggle = this.toggle.bind(this);
        }
        
        toggle() {
            this.setState({
                isOpen: !this.state.isOpen
            });
        }
        
        render () {
            return <Navbar color="dark" className="flex-none" dark expand="md">
                <div className="container">
                    <NavbarBrand tag={Link} to="/"><img src="/logo.png" alt="" /></NavbarBrand>
                </div>
            </Navbar>
        }
}