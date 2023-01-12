function scrollHeader(){
    const header = document.getElementById("header")
    const logoHeader = document.getElementById("logoHeader")
    if  (this.scrollY >= 1) {
        header.classList.add("fixed-header")
        logoHeader.style.display = "block"
    } else {
        header.classList.remove("fixed-header")
        logoHeader.style.display = "none"
    }

    if (window.innerWidth <= 767) {
        logoHeader.style.display = "block"
    }
}

window.addEventListener("scroll", scrollHeader)

function adultVerification() {
    const popup = document.getElementById("adultVerification")
    popup.style.display = "none"
}

// HAMBURGUER MENU
const menuIcon = document.getElementById("hamMenuIcon"),
    closeMenu = document.getElementById("closeMenu"),
    hamMenuNav = document.getElementById("hamMenuNav")

if  (menuIcon) {
    menuIcon.addEventListener("click", () => {
        hamMenuNav.style.display = "block"
    })
} 

if(closeMenu){
    closeMenu.addEventListener("click", () => {
        hamMenuNav.style.display = "none"
    })
}