import React, { useEffect } from "react"

const AutoscrollViewport = ({ scrollList, stock }) => {
    useEffect(() => {
        import("../scripts/autoscroll.js")
            .then(({ autoscroll }) => autoscroll(stock))
    }, [])

    return (
        <div className="viewport-container">
            <div style={{ overflowY: "scroll" }} className="news-viewport">
                {scrollList}
            </div>
            <div className="ui segment custom-loader">
                <div className="ui active dimmer">
                    <div className="ui small loader"></div>
                </div>
            </div>
        </div>
    )

}

export default AutoscrollViewport