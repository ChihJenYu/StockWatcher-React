import React, { useEffect } from "react"

const Signin = ({ onCreateClick }) => {

    useEffect(() => {
        import("../scripts/signin.js")
            .then(({ signin }) => { signin(document.referrer) })
    }, [])

    return (
        <div className="ui standard test modal scrolling transition visible active signin">
            <div className="logo">SW</div>
            <div className="ui large header">Sign in</div>
            <form className="ui form">
                <div className="field">
                    <label>Email address</label>
                    <input id="signin-email" type="text" placeholder="me@example.com" />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input id="signin-password" type="password" />
                </div>
                <div className="signin-prompt">
                    <button className="ui button" onClick={() => { onCreateClick(true) }}>Create account</button>
                    <button className="ui primary button">Sign in</button>
                </div>
            </form>
        </div>
    )
}

export default Signin