import React, { useState, useEffect } from "react"
import { useAsyncCallback } from 'react-async-hook'
import Dropdown from "./Dropdown"
import { todayString } from "../utils/DateString"

const DateSelectionBar = ({ stock, setParentState, setIsLoading, intervalOptions }) => {

    // for date input
    let today = todayString
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)
    // for dropdown
    const [intervalSelected, setIntervalSelected] = useState(intervalOptions[0])

    // for apply button
    // refer to useAsync
    const onApplyClick = () => {
        setIsLoading(true)
        const [setCandleHTML, setVolHTML] = setParentState
        setCandleHTML("")
        setVolHTML("")
        fetch(`/api/${stock}/chart?start=${startDate}&end=${endDate}&interval=${intervalSelected}`)
            .then(res => res.json())
            .then(data => {
                setCandleHTML(data["candleFig"])
                setVolHTML(data["volFig"])
            })
    }

    const asyncApplyClick = useAsyncCallback(onApplyClick)

    return (
        <div className="date-selection">
            <p className="date-selection-label">From</p>
            <input max={today} type="date" className="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <p className="date-selection-label">to</p>
            <input min={startDate} max={today} type="date" className="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Dropdown optionList={intervalOptions} selected={intervalSelected} onSelect={setIntervalSelected} />
            <button className="date-selection submit ui button" onClick={asyncApplyClick.execute}>Apply</button>
        </div>
    )
}

export default DateSelectionBar