import React, { useState, useRef, useEffect } from "react"
import "../CSS/Dropdown.css"

const Dropdown = ({ optionList, selected, onSelect }) => {
    const [open, setOpen] = useState(false)

    const dropdownRef = useRef()

    useEffect(() => {
        const onBodyClick = (e) => {
            if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
                return null
            } else {
                setOpen(false)
            }
        }
        document.body.addEventListener("click", onBodyClick, { capture: true })
        return () => {
            document.body.addEventListener("click", onBodyClick, { capture: true })
        }
    }, [])

    const renderedOptionList = optionList.map((option) => {
        if (option !== selected) {
            return <div key={option} className="item" onClick={() => { onSelect(option) }}>{option}</div>
        } else {
            return null
        }
    })

    return (
        <div ref={dropdownRef} className="ui selection dropdown" onClick={() => { setOpen(!open) }}>
            <i className="dropdown icon"></i>
            <div className="text">{selected}</div>
            <div className={`menu transition ${open ? "visible" : "hidden"}`}>
                {renderedOptionList}
            </div>
        </div>
    )
}

export default Dropdown