import React, { useEffect, useRef } from "react"
const AddRemoveWatchlist = ({ inList, setInList, stock }) => {
    const button = useRef();
    useEffect(() => {
        const addHandler = () => {
            fetch(`/api/${stock}/add`)
                .then(res => res.text())
                .then(data => {
                    setInList(true);
                    alert(`Added ${stock} to watchlist!`)
                })
        }

        const removeHandler = () => {
            fetch(`/api/${stock}/remove`)
                .then(res => res.text())
                .then(data => {
                    setInList(false);
                    alert(`Removed ${stock} from watchlist!`)
                })
        }

        if (inList) {
            button.current.addEventListener("click", removeHandler);
        } else {
            button.current.addEventListener("click", addHandler);
        }

        return () => {
            if (inList) {
                button.current.removeEventListener("click", removeHandler);
            } else {
                button.current.removeEventListener("click", addHandler);
            }
        }

    }, [inList])

    if (!inList) {
        return <button ref={button} className="ui button to-watchlist submit">Add to watchlist</button>
    } else {
        return <button ref={button} className="ui red button to-watchlist submit">Remove from watchlist</button>
    }
}

export default AddRemoveWatchlist