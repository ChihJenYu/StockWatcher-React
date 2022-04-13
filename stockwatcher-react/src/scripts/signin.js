export const signin = (referrer) => {
    const signinButton = document.querySelector(".primary.button")
    signinButton.addEventListener("click", (e) => {
        e.preventDefault();
        let signinEmail = document.querySelector("#signin-email").value;
        let signinPassword = document.querySelector("#signin-password").value;
        fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: signinEmail,
                password: signinPassword
            })
        })
            .then((resp) => {
                if (resp.status == 400) {
                    throw new Error();
                }
                else {
                    resp.json();
                }
            })
            .then((data) => {
                console.log(data);
                alert(`Welcome back, ${signinEmail.split("@")[0]}!`)
                if (!referrer) {
                    window.location.href = "/"
                } else {
                    window.location.replace(referrer)
                }
            })
            .catch((e) => { alert("Wrong email or password!") })
    })
}