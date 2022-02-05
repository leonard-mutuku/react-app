import React, {Component} from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import {Link} from 'react-router-dom';
import { Container } from 'reactstrap';

class Home extends Component {
    render() {
        return (
                <div>
                <AppNavbar/>
                <Container>
                    <p><Link to="/login">Login</Link></p>
                    <p><Link to="/clients">Clients</Link></p>
                    <p><Link to="/dashboard">Dashboard</Link></p>
                </Container>
                </div>
                );
    }
};

export default Home;