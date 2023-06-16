const menu = document.getElementById('menu-icon')
const menuContainer = document.getElementById('menu-container')
const menuClose = document.getElementById('menu-close-icon')
const menuItem = document.querySelectorAll('.menu-item');

menu.addEventListener( 'click', () => {
    menuContainer.style.visibility = "visible";
    document.body.style.overflow = "hidden";
})

menuClose.addEventListener('click', () => {
    menuContainer.style.visibility = "hidden";
    document.body.style.overflow = "visible";
})

menuItem.forEach((item) => {
    
    item.addEventListener('click', () => {
        menuContainer.style.visibility = "hidden";
        document.body.style.overflow = "visible";
    })
})

