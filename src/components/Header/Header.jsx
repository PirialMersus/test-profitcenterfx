import s from './Header.module.scss'
import React from "react";
import {NavLink} from "react-router-dom";

export const Header = () => {
    return (
        <div className={s.header}>
            <div className={s.link}><NavLink to="/websockets" activeClassName={s.activeLink}>Websockets</NavLink></div>
            <div className={s.link}><NavLink to="/ping" activeClassName={s.activeLink}>Ping</NavLink></div>

        </div>
    )
}