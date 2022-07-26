import React, { useEffect, useState } from "react"
import Link from "./Link"
import "../CSS/Sidebar.css"

const Sidebar = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        fetch("/api/auth-query")
            .then((res) => res.json())
            .then((data) => {
                setIsLoggedIn(data["logged-in"]);
                import("../scripts/sidebar.js").then(({ sidebarEventHandlers }) => sidebarEventHandlers());
            });
    }, [])

    return (
        <div className="side-column">
            <div className="side-menu-block">
                <a href="/">
                    <div className="logo">SW</div>
                </a>
                <ul className="country-list">
                    <li>
                        <a href="/">
                            <span>🇹🇼</span>
                            <span>Taiwan</span>
                        </a>
                    </li>
                    <li>
                        <a href="/usstocks">
                            <span>🇺🇸</span>
                            <span>USA</span>
                        </a>
                    </li>
                    <li>
                        <div>
                            <span>👀</span><span><Link href="/watchlist" children="Watchlist" onLinkClick={() => {
                                if (!isLoggedIn) {
                                    window.location.href = "/user"
                                }
                            }} /></span>
                        </div>
                    </li>
                </ul>
                <ul className="admin">
                    <li>
                        <div>
                            {isLoggedIn ? <a className="logout">Sign out</a> : <Link href="/user" children="Sign in" onLinkClick={() => { }} />}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar