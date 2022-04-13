import React from "react"
import SearchBar from "./SearchBar"
import "../CSS/SearchRow.css"

const SearchRow = ({ setContactOpen }) => {
    return (
        <div className="stock-search-row">
            <div className="search-container">
                <SearchBar placeholder="Search by ticker..." />
            </div>
            <div className="contact-trigger">
                <a className="contact-url" onClick={() => { setContactOpen(true) }}>Contact us</a>
            </div>
        </div>
    )
}

export default SearchRow