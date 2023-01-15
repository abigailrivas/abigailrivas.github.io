// ===== HEADER ======
function scrollHeader() {
    const header =  document.getElementById("header")
    const logo = document.getElementById("logo")
    if (this.scrollY > 120) {
        header.classList.add("header-sticky")
        logo.classList.add("logo--sticky")

    } else {
        header.classList.remove("header-sticky")
        logo.classList.remove("logo--sticky")
    }
}

window.addEventListener("scroll", scrollHeader)

// Hover on Shop july
const shopJuly = document.getElementById("has-dropdown")
const dropdownMenu = document.getElementById("dropdown-menu")
shopJuly.addEventListener('mouseover', () => {
    dropdownMenu.style.visibility = 'visible'
})

dropdownMenu.addEventListener('mouseleave', () => {
    dropdownMenu.style.visibility = 'hidden'
})