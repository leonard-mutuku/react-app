import { createContext, useReducer } from 'react';

export const ThemeContext = createContext();

const themeReducer = (state, action) => {
    switch(action.type) {
        case 'CHANGE':
            localStorage.setItem("dark_mode", action.theme);
            return {...state, darkMode: action.theme};
        default:
            return state;
    }
};

const ThemeProvider = (props) => {
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem("dark_mode");
    const theme = saved ? JSON.parse(saved) : defaultDark;

    const [state, dispatch] = useReducer(themeReducer, {darkMode: theme});

    const skin = state.darkMode ? 'dark' : 'light';

    return (
        <ThemeContext.Provider value={{ state, dispatch }}>
            <div data-theme={skin} id="wrapper" className="fill">
                {props.children}
            </div>
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;