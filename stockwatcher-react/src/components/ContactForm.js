import React, { useEffect, useRef } from "react"
import "../CSS/ContactForm.css"

const ContactForm = ({ setContactOpen }) => {

    const submit = useRef();

    useEffect(() => {

        const submitClick = (e) => {
            e.preventDefault();
            fetch("/api/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: document.querySelector("#contact-name").value,
                    email: document.querySelector("#contact-email").value,
                    message: document.querySelector("#contact-textarea").value
                })
            })
                .then((resp) => resp.text())
                .then((data) => {
                    console.log(data);
                    alert("Your message has been received!");
                    setContactOpen(false);
                })
        }

        submit.current.addEventListener("click", submitClick);

        return () => { submit.current.removeEventListener("click", submitClick);}

    }, [])

    return (
        <div className="ui dimmer modals page transition visible active">
            <div className="ui standard test modal scrolling transition visible active signin">
                <i onClick={() => { setContactOpen(false) }} className="large x icon" />
                <div className="logo">SW</div>
                <div className="ui large header">Contact us</div>
                <form className="ui form">
                    <div className="field">
                        <label>Tell us your name...</label>
                        <input id="contact-name" type="text" />
                    </div>
                    <div className="field">
                        <label>And your email...</label>
                        <input id="contact-email" type="text" placeholder="me@example.com" />
                    </div>
                    <div className="field">
                        <label>Finally, tell us what you think!</label>
                        <textarea id="contact-textarea"></textarea>
                    </div>
                    <div className="contact-prompt">
                        <button ref={submit} className="ui primary button">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContactForm