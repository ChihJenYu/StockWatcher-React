import React, { useState } from "react"
import Signin from "./Signin"
import Signup from "./Signup"
import "../CSS/User.css"

const User = () => {

    const [atSignUp, setAtSignUp] = useState(false)

    return (
        <div className="ui dimmer modals page transition visible active">
            {atSignUp ? null : <Signin onCreateClick={setAtSignUp}/>}
            {atSignUp ? <Signup onSignInClick={setAtSignUp}/> : null}
        </div>


    )
}

export default User