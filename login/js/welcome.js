document.addEventListener("DOMContentLoaded", function () {

    function goLogin() {
        window.location.href = "login/index.html";
    }

    function logout() {
        localStorage.removeItem("username");
        location.reload();
        window.location.href = "index.html";
    }

    const user = localStorage.getItem("username");

    if (user) {
        document.getElementById("userInfo").innerText = "Halo, " + user;
        document.getElementById("userInfo").className = "sudah-login";
        if (user === "admin") {
            document.getElementById("userAdmin").classList.remove("disabled");
        }

        document.getElementById("authArea").innerHTML = `
            <button onclick="logout()" class="nav-cta">Logout</button>
        `;
    }

    window.goLogin = goLogin;
    window.logout = logout;

});
