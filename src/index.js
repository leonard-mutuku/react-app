import React from 'react';
import ReactDOM from 'react-dom';
import { usePromiseTracker } from 'react-promise-tracker';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import LoaderDiv from './components/LoaderDiv';
import { AuthProvider } from './contexts/AuthContext';
import ThemeContext from './contexts/ThemeContext';
import AlertProvider from './contexts/AlertProvider';
import ConfirmProvider from './contexts/ConfirmProvider';
import reportWebVitals from './reportWebVitals';

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress && <LoaderDiv />
    );
}

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeContext>
                <AlertProvider>
                    <ConfirmProvider>
                        <App />
                        <LoadingIndicator/>
                    </ConfirmProvider>
                </AlertProvider>
            </ThemeContext>
        </AuthProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
