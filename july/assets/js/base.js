// ===== HEADER ======
function scrollHeader(params) {
    let header =  document.getElementById("header");
    if (this.scrollY > 120) {
        header.classList.add("header-sticky");
    } else {
        header.classList.remove("header-sticky");
    }
}

window.addEventListener("scroll", scrollHeader);