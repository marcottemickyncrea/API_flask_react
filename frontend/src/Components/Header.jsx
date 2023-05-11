import { Fragment } from "react";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <Fragment>
            <nav>
                <ul>
                    <NavLink to="/scrapping"><li>Web Scrapping</li></NavLink>
                    <NavLink to="/archives"><li>Commentaires analysés</li></NavLink>
                </ul>
            </nav>
            <NavLink to="/">
                <div className="container-logo">
                    <p className="logo-texte">Test mon com</p>
                    <div className="container-pouces">
                        <div className="logo like"></div>
                        <div className="logo dislike"></div>
                    </div>
                </div>
            </NavLink>
        </Fragment>
    )
}

export default Header;