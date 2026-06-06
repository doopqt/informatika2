function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// Efek blur header saat scroll
const headerBg = document.getElementById("headerBg");

window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector(".header").offsetHeight;

    // Blur maksimal 10px saat scroll sejauh tinggi header
    const blurAmount = Math.min((scrollY / headerHeight) * 10, 10);

    headerBg.style.filter = "blur(" + blurAmount + "px)";
});

window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;
    // Geser gambar ke bawah seiring scroll (kecepatan 0.4 = lebih lambat dari scroll)
    headerBg.style.transform = "scale(1) translateY(" + scrollY * 0.4 + "px)";
});