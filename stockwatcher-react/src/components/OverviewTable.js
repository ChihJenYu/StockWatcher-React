import React, { useEffect } from "react"
import AddRemoveWatchlist from "./AddRemoveWatchlist"

const OverviewTable = ({ isLoggedIn, inList, setInList, stockSymbol, chineseName, englishName, realtime,
    dollarChange, percentChange, prevClose, dividendYield, open, peRatio,
    daysRange, beta }) => {

    useEffect(() => {
        const numDollarChange = +dollarChange;
        const realtimePrice = [document.querySelector(".cur-price"), document.querySelector(".dollar-change"), document.querySelector(".percent-change")]
        if (numDollarChange > 0) {
            realtimePrice.forEach(element => {
                element.style.color = "#f00";
            })
        } else if (numDollarChange < 0) {
            realtimePrice.forEach(element => {
                element.style.color = "#0f0";
            })
        } else {
            realtimePrice.forEach(element => {
                element.style.color = "#fff";
            })
        }
    }, [])

    return (
        <React.Fragment>
            <div className="stock-header">
                <span className="stock-symbol">{stockSymbol}</span>
                <span className="stock-ch-name">{chineseName}</span>
                <span className="stock-eng-name">{englishName}</span>
                {isLoggedIn ? <AddRemoveWatchlist inList={inList} setInList={setInList} stock={stockSymbol} /> : null}
            </div>
            <div className="realtime-price">
                <h2 className="cur-price">{realtime}</h2>
                <h4 className="dollar-change">{dollarChange}</h4>
                <h4 className="percent-change">({percentChange})</h4>
            </div>
            <table className="overview-table">
                <tbody>
                    <tr>
                        <th>Previous Close</th>
                        <td className="previous-close">{prevClose}</td>
                        <th>Dividend Yield</th>
                        <td className="dividend-yield">{dividendYield}</td>
                    </tr>
                    <tr>
                        <th>Open</th>
                        <td className="open">{open}</td>
                        <th>P/E Ratio</th>
                        <td className="pe">{peRatio}</td>
                    </tr>
                    <tr>
                        <th>Day's Range</th>
                        <td>{daysRange}</td>
                        <th>Beta (5Y Monthly)</th>
                        <td>{beta}</td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>
    )
}

export default OverviewTable