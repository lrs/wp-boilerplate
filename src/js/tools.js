/// <reference path="../../typings/index.d.ts" />
const ROOT_URL = 'site/root/path'

const IsEmpty = (str) => {
  return ( !str || /^\s*$/.test(str) )
}

const SetScrollerMain = () => {
  if ($('.scroller-main').length) {
    $('.scroller-main').css({
      'display' : 'block'
    })
    if ($(window).scrollTop() < $(document).height() / 3) {
      $('.scroller-main').removeClass('scroll_top_in').addClass('scroll_top_out')
      return false
    }
    $('.scroller-main').removeClass('scroll_top_out').addClass('scroll_top_in')
    return true
  }
}

const DoScroller = (target, speed, offset) => {
  if ( ! IsEmpty(target.length) ) {
    $('html, body').animate({
      scrollTop: target.offset().top + offset
    }, {
      queue: false,
      duration: speed,
      easing: 'swing'
    })
  }
}

const SetScrollers = () => {
  let scroller,
    scroller_target,
    scroller_speed,
    scroller_offset,
    default_offset = -53,
    default_speed = 350

  if ($('[data-scroll-target]').length) {
    $('[data-scroll-target]').on('click', function(e) {

      e.preventDefault()

      // toggle twbs dropdown
      $('.navbar-collapse').removeClass('in')

      scroller = $(e.currentTarget)
      scroller_target = $(scroller.data('scroll-target'))
      scroller_speed = scroller.data('scroll-speed') || default_speed
      scroller_offset = scroller.data('scroll-offset') || default_offset

      DoScroller(scroller_target, scroller_speed, scroller_offset)
    })
  }

  if ($('a.smoothscroll').length && ROOT_URL === window.location.href.replace(/\#.*$/, '')) {
    $('a.smoothscroll').on('click', function(e) {
      e.preventDefault()

      // toggle twbs dropdown
      $('.navbar-collapse').removeClass('in')

      scroller = $(e.currentTarget)
      scroller_target = $(scroller.attr('href').match(/\#.*$/)[0])

      scroller_speed = default_speed
      scroller_offset = default_offset

      DoScroller(scroller_target, scroller_speed, scroller_offset)
    })
  }

  if ($('li.smoothscroll').length) {

    $('li.smoothscroll > a').on('click', function(e) {

      if (
        ROOT_URL === window.location.href.replace(/\#.*$/, '')
      ) {
        e.preventDefault()

        // toggle twbs dropdown
        $('.navbar-collapse').removeClass('in')

        scroller = $(e.currentTarget)
        scroller_target = $(scroller.attr('href').match(/\#.*$/)[0])

        scroller_speed = default_speed
        scroller_offset = default_offset

        DoScroller(scroller_target, scroller_speed, scroller_offset)
      }
    })
  }
}

$(document).ready( () => {

  SetScrollers()

  $(window).on('load scroll resize', function() {
    SetScrollerMain()
  })

})