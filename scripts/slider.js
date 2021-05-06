var $ = function(selector) {
    return document.querySelector(selector);
}

var Content = function() {
    this.images = [];
    this.pattern = 'images/inst(?).jpg';

    this.states = ['hide', 'prev', 'act', 'next', 'next new-next']
    this.init()
}

Content.prototype.init = function() {
    var _ = this;

    this.create_pull(4)

    var middle = Math.floor((this.images.length - 1) / 2);
    var act_slide = this.images[middle];
    var tasks = []

    this.states.forEach(function(state) {
        var offset = _.states.indexOf(state) - _.states.indexOf('act')

        var src = _.get_src(Number(_.get_id(act_slide)) + offset)
        src = !_.isValid(src) ? _.images[_.images.length - 1] : src;

        tasks.push(function(callback) {
            _.create(state, src, callback)
        })
    })

    function iterate(index) {
        if (index === tasks.length) {
            return finish()
        }
        var task = tasks[index]
        task(() => iterate(index + 1))
    }

    function finish() {
        console.log('finish')
    }

    iterate(0)
}

Content.prototype.create = function(state, src, callback) {
    var container = document.querySelector('.social-guts')
    var dom = document.createElement('div')
    dom.className = 'slide overlay ' + state;
    if (state === 'hide') {
        container.insertBefore(dom, container.firstChild);
    } else {
        container.appendChild(dom)
    }

    var image = document.createElement('img')
    image.src = src;

    image.onload = function() {
        dom.appendChild(image)
        callback()
    }
}

Content.prototype.get_id = function(src) {
    return /\(([^)]+)\)/.exec(src)[1]
}

Content.prototype.get_src = function(imageId) {
    return this.pattern.replace('?', imageId)
}

Content.prototype.isValid = function(src) {
    return this.images.indexOf(src) == -1 ? false : true
}

Content.prototype.next = function(state) {
    var _ = this;

    var next = 'images/' + document.querySelector('.slide.next img').src.split('\\').pop().split('/').pop();
    var src = _.get_src(Number(_.get_id(next)) + 1)
    src = !_.isValid(src) ? _.get_src(1) : src;

    this.create(state, src, function() {
        console.log('slide created ' + src)
    })
}

Content.prototype.prev = function(state) {
    var _ = this;

    var prev = 'images/' + document.querySelector('.slide.prev img').src.split('\\').pop().split('/').pop();
    var src = _.get_src(Number(_.get_id(prev)) - 1)
    src = !_.isValid(src) ? _.images[_.images.length - 1] : src;

    this.create(state, src, function() {
        console.log('slide created ' + src)
    })
}

Content.prototype.create_pull = function(l) {
    for (var i = 1; i <= l; i++) {
        this.images.push(this.pattern.replace('?', i))
    }
};

var content = new Content();

function next() {
    if ($('.hide')) {
        $('.hide').remove();
    }

    if ($('.prev')) {
        $('.prev').classList.add('hide');
        $('.prev').classList.remove('prev');
    }

    $('.act').classList.add('prev');
    $('.act').classList.remove('act');

    $('.next').classList.add('act');
    $('.next').classList.remove('next');

    $('.new-next').classList.remove('new-next');

    content.next('next new-next')
}

function prev() {
    $('.new-next').remove();

    $('.next').classList.add('new-next');

    $('.act').classList.add('next');
    $('.act').classList.remove('act');

    $('.prev').classList.add('act');
    $('.prev').classList.remove('prev');

    $('.hide').classList.add('prev');
    $('.hide').classList.remove('hide');

    content.prev('hide')
}

var slide = function(element) {
    if (element.classList.contains('next')) {
        next();
    } else if (element.classList.contains('prev')) {
        prev();
    }
}

var slider = $('.social-guts'),
    swipe = new Hammer($('.swipe'))

slider.onclick = function(event) {
    slide(event.target)
}

swipe.on('swipeleft', function(ev) {
    next()
})

swipe.on('swiperight', function(ev) {
    prev()
})