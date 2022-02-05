import { Container, Button } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import RightBottom from './components/RightBottom';

const NotFound = () => {
    const history = useHistory();
    const handleBack = () => {
        history.goBack();
    }

    return (
        <div className="fill flex-column">
            <AppNavbar />
            <div id="right-middle" className="flex-1 tbl-dsp">
                <div className="tbl-cell-dsp">
                    <Container className="text-center">
                        <h2 className="pnl bold" style={{boxShadow: 'none'}}>404 Page Not Found</h2>
                        <h3 className="pnl" style={{boxShadow: 'none'}}>We couldn't find the page you were looking for.</h3>
                        <h5>
                            <span>Click <Link to="/" className="clr" title="home">here</Link> to return to home page or: </span>
                            <Button color="success" onClick={handleBack} title="Go Back">Go to previous page</Button>
                        </h5>
                    </Container>
                </div>
            </div>
            <RightBottom />
        </div>
    );
}

export default NotFound;