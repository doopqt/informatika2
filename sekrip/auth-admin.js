const username = localStorage.getItem("username");

if (username !== "admin") {
    alert("Akses ditolak, halaman ini hanya untuk admin.");
    window.location.href = "index.html";
}