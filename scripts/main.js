var hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.menu')

hamburger.onclick = function(event) {
    hamburger.classList.toggle('opened')
    menu.classList.toggle('opened')
}

