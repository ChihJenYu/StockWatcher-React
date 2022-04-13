import React, { useEffect } from "react"

const Signup = ({ onSignInClick }) => {

    useEffect(() => {
        import("../scripts/signup.js")
            .then(({ signup }) => { signup(document.referrer) })
    }, [])

    return (
        <div className="ui standard test modal scrolling transition visible active signup">
            <div className="logo">SW</div>
            <div className="ui large header">Create account</div>
            <form className="ui form">
                <div className="field">
                    <label>Email address</label>
                    <input id="register-email" type="text" placeholder="me@example.com" />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input id="register-password" type="password" />
                </div>
                <div className="field">
                    <label>Confirm password</label>
                    <input id="register-reenter-password" type="password" />
                </div>
                <div className="signin-prompt">
                    <button className="ui button" onClick={() => { onSignInClick(false) }}>Already have an account?</button>
                    <button className="register-submit ui primary button">Sign up</button>
                </div>
            </form>
        </div>
    )
}

export default Signup