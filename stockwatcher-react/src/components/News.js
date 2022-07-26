import React, { useState, useEffect } from "react"
import Loading from "./Loading"
import { todayString } from "../utils/DateString"
import AutoscrollViewport from "./AutoscrollViewport"

const News = ({ stock }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [newsList, setNewsList] = useState([])
    const [showScrollableViewport, setShowScrollableViewport] = useState(false)
    const [isMounted, setIsMounted] = useState(true)

    // for date input
    let today = todayString
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)

    const fetchNews = () => {
        setIsLoading(true)
        fetch(`/api/${stock}/news?start=1&begin=${startDate}&end=${endDate}`)
            .then(res => res.json())
            .then(data => {
                const news = data["news"]
                setNewsList([...news])
                setIsLoading(false)
                setShowScrollableViewport(true)
            })
    }
    const onApplyClick = () => {
        setShowScrollableViewport(false)
        fetchNews()
    }


    const renderedNewsList = newsList.map((news) => {
        return (
            <div key={news["title"]} className="item">
                <a className="news-title" target="_blank" href={news["link"]}>{news["title"]}</a>
                <p className="news-pub-date">{(news['pubDate'].split(":")[0]).slice(0, -3)}</p>
            </div>
        )
    })

    return (
        <div className="tab-content-container">
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="news" role="tabpanel"
                    aria-labelledby="profile-tab">
                    <div className="date-selection">
                        <p className="date-selection-label">From</p>
                        <input max={today} type="date" className="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <p className="date-selection-label">to</p>
                        <input min={startDate} max={today} type="date" className="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <button className="date-selection submit ui button" onClick={onApplyClick}>Apply</button>
                    </div>
                    <Loading isLoading={isLoading} />
                    {showScrollableViewport ? <AutoscrollViewport scrollList={renderedNewsList} stock={stock} /> : null}
                </div>
            </div>
        </div >
    )
}

export default News