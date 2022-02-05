import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Login from './Login';
import CreateAccount from './CreateAccount';
import ClientList from './ClientList';
import ClientEdit from './ClientEdit';
import Dashboard from './Dashboard';
import NotFound from './NotFound';

const App = () => {

    return (
            <Router>
                <Switch>
                    <Route path="/" exact={true} component={Home} />
                    <Route path="/login" exact={true} component={Login} />
                    <Route path="/create-account" exact={true} component={CreateAccount} />
                    <ProtectedRoute path="/clients" exact={true} component={ClientList} />
                    <ProtectedRoute path="/clients/:id" component={ClientEdit} />
                    <ProtectedRoute path="/dashboard" exact={true} component={Dashboard} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
    );
};

export default App;
