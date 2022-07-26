export const sidebarEventHandlers = () => {
    const logout = document.querySelector(".logout");

    if (logout) {
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            fetch("/api/logout", { method: "POST" })
                .then(res => res.text())
                .then(() => {
                    alert("You have logged out!");
                    window.location.href = "/";
                })
        })
    }
} 