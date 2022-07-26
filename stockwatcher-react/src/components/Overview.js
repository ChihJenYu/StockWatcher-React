import React, { useState, useEffect } from "react"
import Loading from "./Loading"
import OverviewTable from "./OverviewTable"

const Overview = ({ stock }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [chineseName, setChineseName] = useState("")
    const [englishName, setEnglishName] = useState("")
    const [realtime, setRealtime] = useState()
    const [prevClose, setPrevClose] = useState()
    const [open, setOpen] = useState()
    const [dollarChange, setDollarChange] = useState("")
    const [percentChange, setPercentChange] = useState("")
    const [daysRange, setDaysRange] = useState("")
    const [peRatio, setPeRatio] = useState("")
    const [dividendYield, setDividendYield] = useState("")
    const [beta, setBeta] = useState("")
    const [inList, setInList] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        let isMounted = true
        const fetchOverviewData = async () => {
            setIsLoading(true)
            const res = await fetch(`/api/${stock}/overview`)
            const data = await res.json()
            if (isMounted) {
                setChineseName(data.chinese_name)
                setEnglishName(data.english_name)
                setRealtime(data.realtime)
                setPrevClose(data.prev_close)
                setOpen(data.open)
                setDollarChange(data.dollar_change)
                setPercentChange(data.percent_change)
                setDaysRange(data.days_range)
                setPeRatio(data.pe_ratio)
                setDividendYield(data.dividend_yield)
                setBeta(data.beta)
                setIsLoading(false)
            }
        }
        const fetchInList = async () => {
            try {
                const res = await fetch(`/api/${stock}/list`)
                const data = await res.json()
                if (isMounted) {
                    setInList(data["inWatchlist"])
                }
            } catch (e) {
                // pass 
            }

        }
        const fetchLoggedIn = async () => {
            const res = await fetch("/api/auth-query")
            const data = await res.json()
            if (isMounted) {
                setIsLoggedIn(data["logged-in"]);
            }
        }
        fetchOverviewData()
        fetchLoggedIn()
        fetchInList()
        return () => {
            isMounted = false
        }
    }, [])

    return (
        <div className="tab-content-container">
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="home-tab">
                    <Loading isLoading={isLoading} />
                    {isLoading ? null : <OverviewTable isLoggedIn={isLoggedIn} inList={inList} setInList={setInList} stockSymbol={stock} chineseName={chineseName} englishName={englishName} realtime={realtime}
                        dollarChange={dollarChange} percentChange={percentChange} prevClose={prevClose} dividendYield={dividendYield}
                        open={open} peRatio={peRatio} daysRange={daysRange} beta={beta} />}
                </div>
            </div>
        </div>
    )
}

export default Overview