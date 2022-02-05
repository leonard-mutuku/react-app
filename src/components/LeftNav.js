import { useState } from 'react';
import { List } from 'react-bootstrap-icons';
import { Button } from 'reactstrap';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Speedometer2, People, BoxArrowRight } from 'react-bootstrap-icons';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../hooks/useAlert';

const LeftNav = (props) => {
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem("left_nav_open");
        return saved ? JSON.parse(saved) : true;
    });
    const [isSmOpen, setIsSmOpen] = useState(false);
    const { currentUser,logout } = useAuth();
    const history = useHistory();
    const alert = useAlert();

    const menus = [{id: 1, name: 'Dashboard', to: '/dashboard', icon: Speedometer2}, {id: 2, name: 'Clients', to: '/clients', icon: People}];

    const menuList = menus.map((menu) => {
        return <li key={'menu-'+menu.id}>
            <NavLink to={menu.to} activeClassName="active" className="txt-clip animate" title={menu.name}>
                {menu.icon && <i><menu.icon /></i>}
                {(isOpen || isSmOpen) && <span>{menu.name}</span>}
            </NavLink>
        </li>
    });

    const toggleMenu = () => {
        const open = !isOpen;
        setIsOpen(open);
        localStorage.setItem("left_nav_open", open);
    }

    const toggleSmMenu = () => {
        setIsSmOpen(!isSmOpen);
    }

    const signOut = () => {
        logout((res) => {
            if (res.code === 0) {
                history.push('/');
            } else {
                alert({class: 'danger', msg : res.msg});
            }
        });
    }

    const cls = isSmOpen ? '' : 'slide-none ';
    const height = isSmOpen ? '' : ' auto';
    const half = isOpen ? '' : ' half';

    return(
        <div id="left-nav" className={'animate'+half+height}>
            <div className="flex-column">
                <div className="left-top">
                    <div className="text-end lg-toggle">
                        <Button color="default" onClick={toggleMenu} className="menu-toggle btn-icon"><List /></Button>
                    </div>
                    <div className="flex sm-toggle">
                        <div className="flex-1">
                            {isOpen ? <Link to="/" className="logo-open"><img src="/logo.png" alt="" /></Link> : <Link to="/" className="logo-collapse"><img src="logo.png" alt="" /></Link>}
                        </div>
                        <Button color="default" onClick={toggleSmMenu} className="menu-toggle btn-icon d-none"><List /></Button>
                    </div>
                </div>
                <div className={cls + "flex-1 flex-column animate menu-slide"}>
                    <div className="left-middle">
                        <div className="usrnm-img">
                            <Link to="/user"><i></i><img src="/avatar.png" alt="" /></Link>
                        </div>
                        <p className="txt-clip">
                            <span onClick={signOut} className="sign-out" title="Sign Out">
                                <BoxArrowRight /> {isOpen && <span>Sign Out</span>}
                            </span>
                        </p>
                    </div>
                    <div className="left-bottom flex-1 flex-column">
                        <div className="flex-1">
                            <ul className="menu-nav text-start">
                                {menuList}
                            </ul>
                        </div>
                        <div className={isOpen ? "abs-down" : "d-none"}>
                            <p className="txt-clip">Last Login:</p>
                            <p className="txt-clip">{currentUser.lastLogin}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftNav;