import React, { useState } from "react"
import Link from "./Link"
import "../CSS/Header.css"
import { findItemWithHref } from "../utils/DateString"

const Header = () => {

    const menuItems = [{
        item: "Overview",
        href: "/overview"
    }, {
        item: "Historical Data",
        href: "/historical-data"
    }, {
        item: "News",
        href: "/news"
    }];
    const currentPath = window.location.pathname
    const currentStock = currentPath.split("/")[1]
    const currentEndpoint = "/" + currentPath.split("/")[2]
    const initialSelectedItem = findItemWithHref(currentEndpoint, menuItems)

    const [selectedItem, setSelectedItem] = useState(initialSelectedItem)

    const renderedMenuItems = menuItems.map((item) => {
        return <Link key={item.item} href={`/${currentStock}${item.href}`
        } className={item.item === selectedItem ? "item active" : "item"} children={item.item} onLinkClick={setSelectedItem} />
    })

    return (
        <div className="header-bar ui secondary menu">
            {renderedMenuItems}
        </div>
    )
}

export default Header