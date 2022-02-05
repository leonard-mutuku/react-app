import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';

const RightBottom = () => {
    const year = new Date().getFullYear();
    const copy = 'Copyright \u00A9 ' + year + ' Company - All rights reserved \xAE';

    return (
        <div id="right-bottom">
            <Container className="flex">
                <div className="flex-1 txt-clip">
                    <span className="">{copy}</span>
                </div>
                <div>
                    <Link to="/contact-us">Contact Us</Link>
                </div>
            </Container>
        </div>
    );
}

export default RightBottom;