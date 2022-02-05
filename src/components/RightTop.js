import { Container } from 'reactstrap';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const RightTop = (props) => {
    const theme = useContext(ThemeContext);
    const darkMode = theme.state.darkMode;

    const toggleTheme = (e) => {
        const mode = e.target.checked;
        theme.dispatch({type: 'CHANGE', theme: mode});
    }

    return (
        <div id="right-top">
            <Container className="flex">
                <div className="flex-1">
                    <p><span className="linear-cl">{props.title}</span></p>
                </div>
                <div className="theme_toggle">
                    <label className="switch">
                        <input type="checkbox" onChange={toggleTheme} checked={darkMode ? true : false} />
                        <span className="slider round"></span>
                    </label>
                    <b>Dark Theme</b>
                </div>
            </Container>
        </div>
    );
}

export default RightTop;