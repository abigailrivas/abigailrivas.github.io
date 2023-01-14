// ===== HEADER ======
function scrollHeader(params) {
    const header =  document.getElementById("header");
    const logo = document.getElementById("logo");
    if (this.scrollY > 120) {
        header.classList.add("header-sticky");
        logo.classList.add("logo--sticky");

    } else {
        header.classList.remove("header-sticky");
        logo.classList.remove("logo--sticky");
    }
}

window.addEventListener("scroll", scrollHeader);