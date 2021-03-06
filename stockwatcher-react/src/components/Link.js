import React from "react"

const Link = ({ href, className, children, onLinkClick }) => {
    const onClick = (e) => {
        if (e.metaKey || e.ctrlKey) {
            return
        }
        e.preventDefault()
        window.history.pushState({}, "", href)
        const navEvent = new PopStateEvent("popstate")
        window.dispatchEvent(navEvent)
        onLinkClick(children)
    }
    return (
        <a className={className} href={href} onClick={onClick}>
            {children}
        </a>
    )
}

export default Link