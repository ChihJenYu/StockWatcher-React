import React, { useEffect, useRef } from "react"

const ChartIFrame = ({ htmlString, setIsLoading }) => {

    let iframe = useRef()
    useEffect(() => {
        if (iframe.current) {
            iframe.current.contentDocument.open()
            iframe.current.contentDocument.write(htmlString)
            iframe.current.contentDocument.close()
            iframe.current.style.width = '100%'
            iframe.current.style.height = "300px"
            if (htmlString !== "") {
                setIsLoading(false)
            }
        }
    }, [htmlString])

    return (
        <iframe ref={iframe} title={iframe} src="about:blank" scrolling="no" frameBorder="0"
        />
    );
};

export default ChartIFrame