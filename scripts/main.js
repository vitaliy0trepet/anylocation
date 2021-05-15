var hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.menu');

hamburger.onclick = function(event) {
    hamburger.classList.toggle('opened')
    menu.classList.toggle('opened')
}

var positions = document.querySelectorAll('.positions');
positions.forEach(function(parent) {
	var child = parent.querySelector('.position')
	for(var i=1;i<4;i++){
		var clone = child.cloneNode(true);
		parent.append(clone)
	}
})