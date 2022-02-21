const carousel = document.querySelector('.carousel')

const carouselInner = document.querySelector('.carousel-inner')

const indicatorsInner = document.querySelector('.indicators')

const slides = 
  document.querySelectorAll('.carousel-inner .carousel-item')

const totalSlides = slides.length

const prev = document.querySelector('.prev')

const next = document.querySelector('.next')

let step = 100 / totalSlides

let activeSlide = 0
let activeIndicator = 0

let jump = 1

let intervalId
const duration = 4500


let direction = 1 //slideToNext: direction = 1, slideToPrev: direction = -1

// start carousel
loadIndicators() // load current slide
loop(true)

function loadIndicators() {
  let html = ''
  slides.forEach((slide, index) => {
    if (index === 0) {
      html += `<span class="active" data-slide-to="${index}"></span>`
    } else {
      html += `<span data-slide-to="${index}"></span>`
    }
  })
  indicatorsInner.innerHTML = html
  indicatorsInner.style.width = 30 * `${totalSlides}` + 20 + (`${totalSlides}` - 1) * 5 + 'px'
}

function updateIndicators() {
  let indicators = indicatorsInner.querySelectorAll('span')

  indicators.forEach((indicator) => {
    indicator.classList.remove('active')
  })
  indicators[activeSlide].classList.add('active')
}

next.addEventListener('click', () => {
  slideToNext()
})

prev.addEventListener('click', () => {
  slideToPrev()
})

function slideToNext() {
  if (direction === -1) {
    direction = 1
    carouselInner.prepend(carouselInner.lastElementChild)
  }
  carouselInner.style.transform = `translateX(-${step}%)`
  carouselInner.style.transition = 'all 0.7s'
  carousel.style.justifyContent = 'flex-start'
}

function slideToPrev() {
  if (direction === 1) {
    direction = -1
    carouselInner.append(carouselInner.firstElementChild)
  }
  updateIndicators()
  carouselInner.style.transform = `translateX(${step}%)`
  carouselInner.style.transition = 'all 0.7s'
  carousel.style.justifyContent = 'flex-end'
}

carousel.addEventListener('mouseover', () => {
  loop(false)
})

carousel.addEventListener('mouseout', () => {
  loop(true)
})

carouselInner.addEventListener('transitionend', () => {
  carouselInner.style.transform = 'translateX(0)'
  if (direction === 1) {
    for (let i = 0; i < jump; i++) {
        carouselInner.append(carouselInner.firstElementChild)
      }
  } else if (direction === -1) {
    for (let i = 0; i < jump; i++) {
      carouselInner.prepend(carouselInner.lastElementChild)
    }
  }
  jump = 1
  carouselInner.style.transition = 'none'
})
carouselInner.addEventListener('transitionstart', () => {
  if (direction === 1) {
    for (let i = 0; i < jump; i++) {
      if (activeSlide >= slides.length - 1) {
        activeSlide = 0
      } else {
        ++activeSlide
      }
    }
    updateIndicators()
  } else if (direction === -1) {
    for (let i = 0; i < jump; i++) {
      if (activeSlide <= 0) {
        activeSlide = slides.length - 1
      } else {
        --activeSlide
      }
    }
    updateIndicators()
  }
})

function loop(status) {
  if (status) {
    intervalId = setInterval(slideToNext, duration)
  } else {
    clearInterval(intervalId)
  }
}

document.querySelectorAll('.indicators > span').forEach(indicator => {
  indicator.addEventListener('click', (e) => {
    const slideTo = e.target.dataset.slideTo
    const indicators = document.querySelectorAll('.indicators > span')
    
    indicators.forEach((indicator, index) => {
      if (indicator.classList.contains('active')) {
        activeIndicator = index
      }
    })

    if (slideTo - activeIndicator > 1) {
      jump = slideTo - activeIndicator
      step *= jump
      slideToNext()
    } else if (slideTo - activeIndicator === 1) {
      slideToNext()
    } else if (slideTo - activeIndicator < 1) {
      jump = Math.abs(slideTo - activeIndicator)
      step *= jump
      slideToPrev()
    }
    step = 100 / totalSlides
  })
})