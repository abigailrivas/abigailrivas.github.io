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

// SCROLL REVEAL 
ScrollReveal().reveal('.home-title');
ScrollReveal().reveal('.subtitle--home', {delay: 200});

ScrollReveal().reveal('.about-me-first');
ScrollReveal().reveal('.about-me-second', {delay: 800});

ScrollReveal().reveal('.skills_title');

ScrollReveal().reveal('.my-work__title');

ScrollReveal().reveal('.comment', {delay: 200});

ScrollReveal().reveal('.cta', {delay: 200});




