$(document).ready(function(){

    //ready

    //nojs
    $('body').removeClass('no-js');

    //------------------------------------------------------------------------//

    //fakelink
    $('a[href="#"]').on('click', function(event) {
        event.preventDefault();
    });

    //------------------------------------------------------------------------//

    //placeholder
    $('input[placeholder], textarea[placeholder]').placeholder();

    //------------------------------------------------------------------------//

    //navigation
    $('.navigation-toggle').on('click', function(event) {
        event.preventDefault();
        $('body').toggleClass('navigation-open');
    });

    //------------------------------------------------------------------------//

    //scroll to
    $('a.scroll-link').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 70
                }, 400);
                return false;
            }
        }
    });

    //------------------------------------------------------------------------//

    //drop
    activePop = null;
    dropClass = $('.drop');
    function closeInactivePop() {
        dropClass.each(function (i) {
            if ($(this).hasClass('active') && i!=activePop) {
                $(this).removeClass('active');
            }
        });
        return false;
    }
    dropClass.mouseover(function() {
        activePop = dropClass.index(this);
    });
    dropClass.mouseout(function() {
        activePop = null;
    });
    $(document.body).click(function(){
        closeInactivePop();
    });
    $('.drop-toggle').on('click', function(event) {
        event.preventDefault();
        $(this).parent(dropClass).toggleClass('active');
    });

    //------------------------------------------------------------------------//

    //panel
    scrollHeader($(window).scrollTop());
    $(window).scroll(function() {
        scrollHeader($(window).scrollTop());
    });

    //------------------------------------------------------------------------//

    //slider
    $('.gallery-list').slick({
        dots: true,
        arrows: true,
        draggable: true,
        infinite: false,
        centerMode: false,
        centerPadding: '0px',
        autoplay: false,
        autoplaySpeed: 5000,
        speed: 500,
        pauseOnHover: false,
        pauseOnDotsHover: false,
        slide: '.gallery-item',
        slidesToShow: 1,
        slidesToScroll: 1,
        //asNavFor: '',
        //fade: true
    });

});//document ready

//*********************************************************************//

$(window).load(function() {

    //load

});//window load

//*********************************************************************//

$(window).resize(function() {

    //resize

});//window resize

function scrollHeader(value) {
    if( value > 26 ) {
        $('.header-global').addClass('header-fixed');
    } else {
        $('.header-global').removeClass('header-fixed');
    }
}