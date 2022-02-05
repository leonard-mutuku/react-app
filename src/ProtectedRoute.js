import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export const ProtectedRoute = ({component: Component, ...rest}) => {
    const { currentUser } = useAuth();

    return(
        <Route
            {...rest}
            render={props => {
                if (currentUser.loggedIn) {
                    return <Component {...props} />
                } else {
                    return <Redirect
                        to={{
                            pathname: "/login",
                            state: {
                                from: props.location.pathname
                            }
                        }}
                    />
                }
            }}
        />
    );
}