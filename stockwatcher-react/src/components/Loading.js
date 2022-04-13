import React from "react"

const Loading = ({ isLoading }) => {
    if (isLoading) {
        return (
            <div className="ui segment react-loader">
                <div className="ui active dimmer">
                    <div className="ui text loader">Loading</div>
                </div>
                <p></p>
            </div>
        )
    } else {
        return null
    }

}

export default Loading