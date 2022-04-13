import React, { useState, useEffect } from "react"
import Loading from "./Loading"
import "../CSS/Watchlist.css"

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        fetch("/watchlist/user")
            .then(res => res.json())
            .then(({ watchlist_data }) => {
                setWatchlist(watchlist_data)
                setIsLoading(false)
            })
    }, [])

    let renderedWatchlist = watchlist.map((item) => {
        const dollarChange = +item.dollar_change;
        let defColor;
        if (dollarChange > 0) {
            defColor = "#f00";
        } else if (dollarChange < 0) {
            defColor = "#0f0";
        } else {
            defColor = "#fff";
        }
        return (
            <div key={item.ch_name} className="item">
                <div className="watchlist-title">
                    <a className="header" href={`/${item.symbol}/overview`} >{item.symbol} {item.ch_name}</a>
                    <div className="meta">
                        <span>{item.eng_name}</span>
                    </div>
                </div>
                <div className="watchlist-description" style={{ color: defColor }}>
                    <span className="stock-realtime-price">{item.realtime_price}</span>
                    <span className="stock-dollar-change">{item.dollar_change}</span>
                    <span className="stock-percent-change">{item.percent_change}</span>
                    <i className="trash alternate outline icon" style={{ color: "red" }} onClick={(e) => {
                        fetch(`/${item.symbol}/remove`)
                            .then(res => res.text())
                            .then(data => {
                                e.target.parentNode.parentNode.remove();
                            })
                    }
                    } />
                </div>
            </div>
        )
    })

    if (renderedWatchlist.length === 0 && !isLoading) {
        renderedWatchlist.push(
            <div className="empty-message">
                <p>Your watchlist is empty.</p>
            </div>
        )
    }

    return (
        <div>
            <Loading isLoading={isLoading} />
            <div className="watchlist-viewport">
                <div className="ui items">
                    {renderedWatchlist}
                </div>
            </div>
        </div>
    )
}

export default Watchlist