import React, { useState, useEffect, useRef } from "react"
import "../CSS/SearchBar.css"

const SearchBar = ({ placeholder }) => {
    const [term, setTerm] = useState("")
    const [debouncedTerm, setDebouncedTerm] = useState(term)
    const [results, setResults] = useState([])

    const searchResultList = useRef()

    const onInputChange = e => setTerm(e.target.value)

    const onFormSubmit = e => {
        e.preventDefault();
        if (searchResultList.current.children.length !== 0) {
            const submitItem = searchResultList.current.children[0].children[0].children[0].href
            window.location.href = submitItem
        }
    }

    // set debounced term
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedTerm(term)
        }, 300)
        return () => {
            clearTimeout(timeout)
        }
    }, [term])

    // search for debounced term
    useEffect(() => {
        const search = async () => {
            const res = await fetch(`/${debouncedTerm}`)
            const data = await res.json()
            setResults(data.result)
        }
        if (debouncedTerm) {
            search()
        } else {
            setResults([])
        }
    }, [debouncedTerm])

    const renderedResults = results.map((result) => {
        return (
            <div key={result.symbol} className="item search-item">
                <div className="content">
                    <a className="header" href={`/${result.symbol}/overview`} >{`${result.symbol} ${result.chinese_name}`}</a>
                </div>
            </div>
        )
    })

    return (
        <div>
            <form className="ui form" onSubmit={onFormSubmit}>
                <div className="ui search">
                    <div className="ui icon input search-input">
                        <input className="prompt" type="text" placeholder={placeholder}
                            value={term}
                            onChange={onInputChange} />
                        <i className="search icon"></i>
                    </div>
                </div>
                <div ref={searchResultList} className="ui relaxed divided list search-result">
                    {renderedResults}
                </div>
            </form>
        </div>
    )
}

export default SearchBar

// window.history.pushState({}, "", href)