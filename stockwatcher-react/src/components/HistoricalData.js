import React, { useState } from "react"
import DateSelectionBar from "./DateSelectionBar"
import ChartIFrame from "./ChartIFrame"
import Loading from "./Loading"

const HistoricalData = ({ stock }) => {
    const [candleHTML, setCandleHTML] = useState("")
    const [volHTML, setVolHTML] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="tab-content-container">
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="historical-data" role="tabpanel"
                    aria-labelledby="profile-tab">
                    <DateSelectionBar stock={stock} setParentState={[setCandleHTML, setVolHTML]} setIsLoading={setIsLoading} intervalOptions={["Daily", "Weekly", "Monthly"]} />
                    <div style={{ display: candleHTML !== "" ? "block" : "none" }} className="charts">
                        <ChartIFrame className="candle-fig" setIsLoading={setIsLoading} htmlString={candleHTML} />
                        <ChartIFrame className="vol-fig" setIsLoading={setIsLoading} htmlString={volHTML} />
                    </div>
                    <Loading isLoading={isLoading} />
                </div>
            </div>
        </div >
    )
}

export default HistoricalData