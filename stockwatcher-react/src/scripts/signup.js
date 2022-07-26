export const signup = (referrer) => {
    const registerSubmit = document.querySelector(".register-submit");
    registerSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        let regEmail = document.querySelector("#register-email").value;
        let regPassword = document.querySelector("#register-password").value;
        let regReenterPassword = document.querySelector(
            "#register-reenter-password"
        ).value;

        if (regPassword != regReenterPassword) {
            alert("Please make sure password is entered correctly!");
            return;
        } else {
            fetch("/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: regEmail,
                    password: regPassword,
                }),
            })
                .then((resp) => {
                    if (resp.status == 400) {
                        throw new Error();
                    } else {
                        resp.text();
                    }
                })
                .then((data) => {
                    console.log(data);
                    fetch("/api/user/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: regEmail,
                            password: regPassword,
                        }),
                    })
                        .then((resp) => {
                            if (resp.status == 400) {
                                throw new Error();
                            } else {
                                resp.json();
                            }
                        })
                        .then((data) => {
                            console.log(data);
                            alert(`Welcome, ${regEmail.split("@")[0]}!`);
                            if (!referrer) {
                                window.location.href = "/";
                            } else {
                                window.location.replace(referrer);
                            }
                        });
                })
                .catch((e) => {
                    alert("This email has already been registered!");
                });
        }
    });
};
