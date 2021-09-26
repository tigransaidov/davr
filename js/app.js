window.onload = function () {
    // Age verification
    if (document.body.classList.contains('age-restriction')) {
        const labelInput = document.querySelector('.age-gate-remember');
        labelInput.insertAdjacentHTML('beforeend', '<span class="custom-checkbox"></span>');
    }
    
    const contactButtons = document.querySelectorAll('.contact__button');
    if (contactButtons) {
        for (i = 0; i < contactButtons.length; i++) {
            const button = contactButtons[i];
            button.addEventListener('click', () => flipCard(button));
        }
    }

    const contactFooter = document.querySelector('.contact__footer');
    function flipCard(button) {
        if (button.id === 'to-info') {
            contactFooter.classList.add('_flipped');
        } else {
            contactFooter.classList.remove('_flipped');
        }
    }

    const videoButton = document.querySelectorAll('[id=play-pause]')

    if (videoButton) {
        for (let i = 0; i < videoButton.length; i++) {
            const video = videoButton[i].closest('.gallery-page__images-box').getElementsByTagName('video');
            videoButton[i].addEventListener('click', () => togglePlayPause(event, video));
            video[0].addEventListener('timeupdate', function() {
                const videoLine = videoButton[i].closest('.gallery-page__images-box').querySelector('.video-controls_line');
                linePos = video[0].currentTime / video[0].duration;
                videoLine.style.width = linePos * 100 + '%';
                if (video[0].ended) {
                    videoButton.className = "_play";
                }
            })
        }
    }

    function togglePlayPause(event, video) {
        if (video[0].paused) {
            event.currentTarget.className = "_pause";
            video[0].play();
        } else {
            event.currentTarget.className = "_play";
            video[0].pause();
        }
    }

    // Header
    const headerElement = document.querySelector('.header');
    
    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            headerElement.classList.remove('_scroll');
        } else {
            headerElement.classList.add('_scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);

    // Counter
    const counters = document.querySelectorAll('.counter');
    const countSpeed = 400;

    const updateCount = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;

        const inc = target / countSpeed;
        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => updateCount(counter), 1);
        } else {
            counter.innerText = target;
        }
    }

    let countersObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                updateCount(entry.target);
                countersObserver.unobserve(entry.target);
            }
        })
    })

    if (counters) {
        counters.forEach(function(counter) {
            countersObserver.observe(counter);
        })
    }

    // Lazy Load 
    const lazyImages = document.querySelectorAll('._lazy-parent');
    const loadMapBlock = document.querySelector('._load-map');
    const windowHeight = document.documentElement.clientHeight;

    let lazyImagesPositions = [];
    if (lazyImages.length > 0) {
        lazyImages.forEach(img => {
            if (img.querySelectorAll('img')[0].dataset.src) {
                lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
                lazyScrollCheck();
            }
        })
    }
    
    function lazyScrollCheck() {
        let imgIndex = lazyImagesPositions.findIndex(
            item => pageYOffset > item - windowHeight
        );
        if (imgIndex >= 0) {
            let lazyImage = lazyImages[imgIndex].querySelectorAll('img')[0]; 
            if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.removeAttribute('data-src');
                lazyImages[imgIndex].classList.remove('_lazy-parent');
            } else if (lazyImage.dataset.srcset) {
                lazyImage.srcset = lazyImage.dataset.srcset;
                lazyImage.removeAttribute('data-srcset');
                lazyImages[imgIndex].classList.remove('_lazy-parent');
            }
            delete lazyImagesPositions[imgIndex];
        }
        
    }

    window.addEventListener('scroll', lazyScroll);

    function lazyScroll() {
        if (document.querySelectorAll('._lazy-parent').length > 0) {
            lazyScrollCheck();
        }
        if (loadMapBlock) {
            if (!loadMapBlock.classList.contains('_loaded')) {
                getMap();
            }
        }
    }

    function getMap() {
        const loadMapGetPos = loadMapBlock.getBoundingClientRect().top + pageYOffset;
        if (pageYOffset > loadMapGetPos - windowHeight) {
            const loadMapUrl = loadMapBlock.dataset.map;
            if (loadMapUrl) {
                loadMapBlock.insertAdjacentHTML(
                    "beforeend",
                    `<iframe src="${loadMapUrl}" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
                )
                loadMapBlock.classList.add('_loaded');
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Pause video not in view
    const pauseVideos = document.querySelectorAll('._need-to-stop');
    if (pauseVideos) {
        const toggleVideo = function (entries, observer) {
            entries.forEach(function(entry) {
                var promise = entry.target.play();
                if (entry.isIntersecting) {
                    if (entry.target.paused == true) {
                        entry.target.play();
                    }
                } else {
                    if (entry.target.paused == false) {
                        if (promise !== undefined) {
                            promise.then( () => {
                                entry.target.pause();
                            })
                            .catch(error => {

                            })
                        }
                    }
                }
            })
        }
        pauseVideos.forEach(function(item) {
            const videosObserver = new IntersectionObserver(toggleVideo);
            videosObserver.observe(item);
        })
    }
    


    var lazyBackgrounds = [].slice.call(document.querySelectorAll("._lazy-background"));

    if ("IntersectionObserver" in window) {
        let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
            entry.target.classList.add("_visible");
            lazyBackgroundObserver.unobserve(entry.target);
            }
        });
        });

        lazyBackgrounds.forEach(function(lazyBackground) {
        lazyBackgroundObserver.observe(lazyBackground);
        });
    }
    var lazyImages = [].slice.call(document.querySelectorAll("._lazy-parent-image"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
            let lazyParent = entry.target;
            let lazyImage = lazyParent.querySelectorAll('img')[0];
            lazyImage.src = lazyImage.dataset.src;
            lazyParent.classList.remove("_lazy-parent-image");
            lazyImageObserver.unobserve(lazyParent);
            }
        });
        });

        lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
        });
    }

    var lazyPosters = [].slice.call(document.querySelectorAll("._lazy-poster"));
    if ("IntersectionObserver" in window) {
        let lazyPostersObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
            let lazyPoster = entry.target;
            lazyPoster.poster = lazyPoster.dataset.poster;
            lazyPoster.classList.remove("_lazy-poster");
            lazyPostersObserver.unobserve(lazyPoster);
            }
        });
        });

        lazyPosters.forEach(function(lazyPoster) {
        lazyPostersObserver.observe(lazyPoster);
        });
    }


});

;
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');
const headerBody = document.querySelector('.header__body');

iconMenu.addEventListener('click', function() {
    if (window.innerWidth <= 932) {
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
        headerBody.classList.toggle('_active');
        document.body.classList.toggle('_no-scroll');
    }
});
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(',')[0];
    });
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(',')[0];
    });
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params =  item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(',');
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
        });
        // Get Unique breakpoints
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        }); 

        // Work with each breakpoint
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(',');
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            // Match needed objects 
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            })

            // Event
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        })
    }

    // Init
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener('click', setSpollerAction);
            }
        })
    }
    // Content
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('[data-one-spoller]') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollerBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500)
            }
            e.preventDefault();
        }
    }
    function hideSpollerBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelectorAll('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
} 

// ================================================================
let _slideUp = (target, duration=500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = 'true';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration) 
    }
}

let _slideDown = (target, duration=500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration) 
    }
}
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
};
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
    for (let i = 0; i < sliders.length; i++) {
        let slider = sliders[i];
        if (!slider.classList.contains('swiper-bild')) {
            let slider_items = slider.children;
            if (slider_items) {
                for (let i = 0; i < slider_items.length; i++) {
                    let el = slider_items[i];
                    el.classList.add('swiper-slide');
                }
            }
            let slider_content = slider.innerHTML;
            let slider_wrapper = document.createElement('div');
            slider_wrapper.classList.add('swiper-wrapper');
            slider_wrapper.innerHTML = slider_content;
            slider.innerHTML = '';
            slider.appendChild(slider_wrapper);
            slider.classList.add('swiper-bild');

            if (slider.classList.contains('_swiper-scroll')) {
                let sliderScroll = document.createElement('div');
                sliderScroll.classList.add('swiper-scrollbar');
                slider.appendChild(sliderScroll);
            }
        }
    }
    sliders_bild_callback();
}

function sliders_bild_callback(params) {}

var introSlider = undefined;
if (document.querySelector('.slider-intro__body')) {
    var screenWidth = $(window).width();
    if (screenWidth > 932 && introSlider == undefined) {
        const introSlider = new Swiper('.slider-intro__body', {
            observer: true,
            observePerents: true,
            slidesPerView: 1,
            swipe: false,
            spaceBetween: 16,
            loop: true,
            speed: 800,
            loopAdditionalSlides: 5,
            preloadImages: false,
            lazy: true,
            navigation: { 
                nextEl: '.slider-intro__arrows .intro__arrow_next',
                prevEl: '.slider-intro__arrows .intro__arrow_prev',
            },
        });
        const introSlides = document.querySelectorAll('.slider-intro__slide');
        for (let i = 0; i < introSlides.length; i++) {
            if (!introSlides[i].classList.contains('swiper-slide-active')) {
                introSlides[i].querySelector('[id=intro-video]').pause();
            } else {
                introSlides[i].querySelector('[id=intro-video]').play();
            }
            introSlides[i].querySelector('[id=intro-video]').addEventListener('ended', function() {
                introSlider.slideNext();
            })
        }
        introSlider.on('transitionEnd', function () {
            const introSlides = document.querySelectorAll('.slider-intro__slide');
            for (let i = 0; i < introSlides.length; i++) {
                if (!introSlides[i].classList.contains('swiper-slide-active')) {
                    introSlides[i].querySelector('[id=intro-video]').pause();
                } else {
                    introSlides[i].querySelector('[id=intro-video]').play();
                }
            }
        });
    } else if (screenWidth < 931 && introSlider != undefined){
        introSlider.destroy();
    }
}


if (document.querySelector('.slider-blog__body')) {
    new Swiper('.slider-blog__body', {
        observer: true,
        observePerents: true,
        slidesPerView: 3,
        spaceBetween: 32,
        watchOverflow: true,
        speed: 800,
        loop: true,
        preLoadImages: false,
        // dots
        pagination: {
            el: '.slider-blog__dotts',
            clickable: true,
        },
        // arrows
        navigation: { 
            nextEl: '.slider-blog .slider__arrow-next',
            prevEl: '.slider-blog .slider__arrow-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1.1,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1150: {
                slidesPerView: 3,
                spaceBetween: 32
            }
        }
    });
}

if (document.querySelector('.reviews__body')) {
    new Swiper('.reviews__body', {
        observer: true,
        observePerents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 800,
        loop: true,
        // arrows
        navigation: { 
            nextEl: '.reviews__arrow_next',
            prevEl: '.reviews__arrow_prev',
        },
    });
}

if (document.querySelector('._activity-slider .activity-page__article-body')) {
    new Swiper('._activity-slider .activity-page__article-body', {
        observer: true,
        observePerents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 800,
        loop: true,
        effect: 'cube',
        // arrows
        navigation: { 
            nextEl: '._activity-slider .activity-page__article-arrow_next',
            prevEl: '._activity-slider .activity-page__article-arrow_prev',
        },
        // dots
        pagination: {
            el: '._activity-slider .activity-page__article-dotts',
            clickable: true,
        },
        preLoadImages: false,
        lazy: true,
    });
}

if (document.querySelector('._young-slider .activity-page__article-body')) {
    new Swiper('._young-slider .activity-page__article-body', {
        observer: true,
        observePerents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 800,
        loop: true,
        effect: 'flip',
        // arrows
        navigation: { 
            nextEl: '._young-slider .activity-page__article-arrow_next',
            prevEl: '._young-slider .activity-page__article-arrow_prev',
        },
        // dots
        preLoadImages: false,
        lazy: true,
    });
}

if (document.querySelector('.article-slider-01__body')) {
    new Swiper('.article-slider-01__body', {
        observer: true,
        observePerents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 800,
        loop: true,
        effect: 'fade',
        // arrows
        navigation: { 
            nextEl: '.article-slider-01 .slider__arrow-next',
            prevEl: '.article-slider-01 .slider__arrow-prev',
        },
        // dots
        pagination: {
            el: '.article-slider-01__dotts',
            clickable: true,
        },
        preLoadImages: false,
        lazy: true,
    });
}

if (document.querySelector('.article-slider-02__body')) {
    var gallery = new Swiper('.article-slider-02__body', {
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 800,
        // arrows
        navigation: { 
            nextEl: '.article-slider-02 .thumb-arrow_next',
            prevEl: '.article-slider-02 .thumb-arrow_prev',
        },
        preLoadImages: false,
        lazy: true,
        autoplay: true,
    });
}

if (document.querySelector('.article-slider-03')) {
    var galleryThumbs = new Swiper('.article-slider-03', {
        spaceBetween: 10,
        centredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        preLoadImages: true,
    });
    gallery.controller.control = galleryThumbs;
    galleryThumbs.controller.control = gallery;
}

if (document.querySelector('.locality-slider_top__body')) {
    var localityTop = new Swiper('.locality-slider_top__body', {
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 800,
        // arrows
        navigation: { 
            nextEl: '.locality-slider_top .thumb-arrow_next',
            prevEl: '.locality-slider_top .thumb-arrow_prev',
        },
        preLoadImages: false,
        lazy: true,
        autoplay: true,
    });
}

if (document.querySelector('.locality-slider_bottom')) {
    var localityBottom = new Swiper('.locality-slider_bottom', {
        spaceBetween: 10,
        centredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        preLoadImages: true,
    });
    localityTop.controller.control = localityBottom;
    localityBottom.controller.control = localityTop;
}

if (document.querySelector('.production-slider_body')) {
    new Swiper('.production-slider_body', {
        observer: true,
        observePerents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 800,
        loop: true,
        effect: 'cube',
        // arrows
        navigation: { 
            nextEl: '.production-slider .slider_arrow_next',
            prevEl: '.production-slider .slider_arrow_prev',
        },
        // dots
        pagination: {
            el: '.production-slider .production-slider_dotts',
            clickable: true,
        },
        preLoadImages: false,
        lazy: true,
    });
}

if (document.querySelector('.employees-slider_body')) {
    new Swiper('.employees-slider_body', {
        observer: true,
        observePerents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 800,
        loop: true,
        effect: 'flip',
        // arrows
        navigation: { 
            nextEl: '.employees-slider .slider_arrow_next',
            prevEl: '.employees-slider .slider_arrow_prev',
        },
        // dots
        preLoadImages: false,
        lazy: true,
    });
}

if (document.querySelector('.slider-history__body')) {
    new Swiper('.slider-history__body', {
        observer: true,
        observePerents: true,
        spaceBetween: 32,
        watchOverflow: true,
        speed: 800,
        parallax: true,
        preLoadImages: false,
        // loopFillGroupWithBlank: true,
        slidesPerGroup: 1,
        // arrows
        navigation: { 
            nextEl: '.slider-history__arrows .slider__arrow-next',
            prevEl: '.slider-history__arrows .slider__arrow-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            700: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            840: {
                slidesPerView: 3,
                spaceBetween: 32
            }
        }
    });
}

if (document.querySelector('.slider-partners__body')) {
    new Swiper('.slider-partners__body', {
        slidesPerView: 5,
        preLoadImages: false,
        speed: 800,
        loop: true,
        autoplay: true,
        centeredSlides: true,
        parallax: true,
        // arrows
        navigation: { 
            nextEl: '.slider-partners__arrows .slider__arrow-next',
            prevEl: '.slider-partners__arrows .slider__arrow-prev',
        },
        pagination: {
            el: '.slider-partners__dotts',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1.1,
                spaceBetween: 15
            },
            700: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            1000: {
                slidesPerView: 5,
                spaceBetween: 14
            }
        }
    });
};
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();;
if (document.getElementById('gallery')) {
        lightGallery(document.getElementById('gallery'), {
                selector: '.row-gallery__item',
                background: '#fff'
        });
        // Gallery
        const galleryBody = document.querySelector('.gallery__body');
        if (galleryBody) {
                const galleryItems = galleryBody.querySelector('.gallery__items');
                const galleryColumn = galleryBody.querySelectorAll('.gallery__column');

                const speed = galleryBody.dataset.speed;

                let positionX = 0;
                let coordXprocent = 0;

                function setMouseGalleryStyle() {
                        let galleryItemsWidth = 0;
                        for (let i = 0; i < galleryColumn.length; i++) {
                                galleryItemsWidth += galleryColumn[i].offsetWidth;
                        }

                        const galleryDifferent = galleryItemsWidth - galleryBody.offsetWidth;
                        const distX = Math.floor(coordXprocent - positionX);

                        positionX = positionX + (distX * speed);
                        let position = galleryDifferent / 200 * positionX;

                        galleryItems.style.cssText = `transform: translate3d(${-position}px, 0, 0);`;
                        
                        if (Math.abs(distX) > 0) {
                                requestAnimationFrame(setMouseGalleryStyle);
                        } else {
                                galleryBody.classList.remove('_init');
                        }
                }
                galleryBody.addEventListener('mousemove', function (e) {
                        // Get Width
                        const galleryWidth = galleryBody.offsetWidth;
                        // Set 0 position on middle 
                        const coordX = e.pageX - galleryWidth / 2;
                        // Get percentage (-100% left; 100% right, 0 middle)
                        coordXprocent = coordX / galleryWidth * 200;

                        if (!galleryBody.classList.contains('_init')) {
                                requestAnimationFrame(setMouseGalleryStyle);
                                galleryBody.classList.add('_init');
                        }
                })
        }
}

if (document.getElementById('article-slider-03')) {
        lightGallery(document.getElementById('article-slider-03'), {
                selector: '.article-slider-03__image',
                background: '#fff'
        });
}

if (document.getElementById('locality-slider')) {
        lightGallery(document.getElementById('locality-slider'), {
                selector: '.locality-slider_bottom .locality-slider_bottom-image',
                background: '#fff'
        });
};
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', formSend);
        var telInput = document.querySelector('#phone');
        var iti = window.intlTelInput(telInput, {
            utilsScript: '../img/utils.js',
            initialCountry: 'uz',
            nationalMode: true,
            separateDialCode: true,
        });
        const popup = document.querySelector('#popup'); 
        const msgCloseButton = document.querySelector('.popup__close');
        msgCloseButton.addEventListener('click', () => closeMessage, false);
    }

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        if (error === 0) {
            form.closest('.contact__message').classList.add('_sending');
            let formData = new FormData(form);
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            }) 
            if (response.ok) {
                let result = await response.json();
                form.reset();
            } else {
                alert('На сайте возникла ошибка')
                form.closest('.contact__message').classList.remove('_sending');
            }

            // showMessage(popup);

        } else {
            const inputsWithError = document.querySelectorAll('._req._error');
            const emptyInput = '<div class="contact__form-error"><i class="fas fa-exclamation-triangle"></i> Это поле является обязательным!</div>';
            const wrongEmail = '<div class="contact__form-error"><i class="fas fa-exclamation-triangle"></i> Почта является не действительной!</div>';
            const wrongPhone = '<div class="contact__form-error"><i class="fas fa-exclamation-triangle"></i> Номер является не действительным!</div>';
            for (let i = 0; i < inputsWithError.length; i++) {
                if (!inputsWithError[i].classList.contains('_email')) {
                    inputsWithError[i].closest('.contact__form-group').insertAdjacentHTML('beforeend', emptyInput)
                } else {
                    if (inputsWithError[i].value) {
                        inputsWithError[i].closest('.contact__form-group').insertAdjacentHTML('beforeend', wrongEmail)
                    } else {
                        inputsWithError[i].closest('.contact__form-group').insertAdjacentHTML('beforeend', emptyInput)
                    }
                }
            }
            if (telInput.classList.contains('_error')) {
                telInput.closest('.contact__form-group').insertAdjacentHTML('beforeend', wrongPhone)
            }
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = form.querySelectorAll('._req');

        formRemoveErrorLabel(telInput);
        formRemoveError(telInput);
        if (!iti.isValidNumber() && telInput.value.trim() !== '') {
            formAddError(telInput);
            error++;
        }

        for (let i = 0; i < formReq.length; i++) {
            const input = formReq[i];
            formRemoveError(input);
            formRemoveErrorLabel(input);

            if (input.classList.contains('_email')) {
                if (!emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                } 
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function formRemoveErrorLabel(input) {
        if (input.closest('.contact__form-group').querySelector('.contact__form-error')) {
            input.closest('.contact__form-group').querySelector('.contact__form-error').remove();
        }
    }

    function emailTest(input) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(input.value);
    } 

    function showMessage(msg) {
        msg.classList.add('_open');
        setDelay(msg);
    };

    function setDelay(msg) {
        const delay = setTimeout(function() {
            if (msg.classList.contains('_open')) {
                msg.classList.remove('_open');
            }
            return () => clearTimeout(delay);
        }, 6000);
    }

    function closeMessage(event) {
        event.Target.closest('.popup').classList.remove('_open');
    }
});
const scrollLinks = document.querySelectorAll('._scroll-link');

if (scrollLinks) {
    for (i = 0; i < scrollLinks.length; i++) {
        scrollLinks[i].addEventListener('click', scrollLinkClick);
    }
}

function scrollLinkClick(event) {
    if (document.body.classList.contains('_no-scroll')) {
        iconMenu.classList.remove('_active');
        menuBody.classList.remove('_active');
        document.body.classList.remove('_no-scroll');
    }
    smoothScroll(event);
}

function smoothScroll(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    if (document.body.classList.contains('_no-scroll')) {
        iconMenu.classList.remove('_active');
        menuBody.classList.remove('_active');
        headerBody.classList.remove('_active');
    }
    let top;
    console.log(targetId);
    if (targetId === '#') {
        top = 0;
    } else if (targetId === 'after-intro') {
        let intro = event.currentTarget.closest('_intro');
        top = intro.querySelector(targetId).offsetTop + intro.offsetHeight;
    } else {
        top = document.querySelector(targetId).offsetTop - 80;
    }
    window.scrollTo({
        top: top,
        behavior: 'smooth'
    })
};
$(document).ready(function() {
    $('.video-player').each(function (i, videoPlayer) {
        let eleVideoObj = $(videoPlayer).find('video');
        let elePlayPauseBtn = $(videoPlayer).find('.toggle-play-pause');
        let eleStartTime = $(videoPlayer).find('.start-time');
        let eleEndTime = $(videoPlayer).find('.end-time');
        let eleVideoSeekbar = $(videoPlayer).find('.video-seekbar');
        let eleVideoProgress = $(eleVideoSeekbar).find('.progress');
        let eleToggleVolume = $(videoPlayer).find('.toggle-volume');
        let eleVolumeSeekbar = $(videoPlayer).find('.volume-seekbar');
        let eleVolumeProgress = $(eleVolumeSeekbar).find('.progress');
        let eleVideoPoster = $(videoPlayer).find('.video-player_poster');
        let eleVideoExpand = $(videoPlayer).find('.toggle-expand');

        let totalDurationInSeconds = 0;
        let currentTimeInSeconds = 0;
        let currentDuration = null;
        let totalDuration = null;
        let seekPercentage = 0;
        let volumeValue = 1;
        let volumePercentage = 100;

        // update functions 
        const updateTotalDuration = () => {
            $(eleEndTime).html(`${totalDuration.minutes}:${totalDuration.seconds}`);
        }
        const updateCurrentTime = () => {
            $(eleStartTime).html(`${currentDuration.minutes}:${currentDuration.seconds}`);
        }
        const updateSeekbar = () => {
            seekPercentage = helper_getPercentage(currentTimeInSeconds, totalDurationInSeconds);
            $(eleVideoProgress).css({width:`${seekPercentage}%`});
        }
        const updateVolumeBar = () => {
            $(eleVolumeProgress).css({width:`${volumePercentage}%`})
        }

        $(videoPlayer).hover(() => {
            $(videoPlayer).removeClass('_hide-controls');
        }, () => {
            if(!eleVideoObj['0'].paused) {
                $(videoPlayer).addClass('_hide-controls');
            }
        })
        $(eleVideoPoster).hover(() => {
            $(videoPlayer).removeClass('_hide-controls');
        }, () => {
            if(!eleVideoObj['0'].paused) {
                $(videoPlayer).addClass('_hide-controls');
            }
        })

        // update total duration
        eleVideoObj.on('loadeddata', () => {
            totalDurationInSeconds = eleVideoObj['0'].duration;
            totalDuration = helper_calculateDuration(totalDurationInSeconds);
            updateTotalDuration();
            updateSeekbar();
            updateVolumeBar();
        });

        // update the seekbar
        eleVideoObj.on('timeupdate', () => {
            currentTimeInSeconds = eleVideoObj['0'].currentTime;
            currentDuration = helper_calculateDuration(currentTimeInSeconds);
            updateCurrentTime();
            updateSeekbar();
        });

        eleVideoObj.on('volumechange', () => {
            volumePercentage = eleVideoObj['0'].volume * 100;
            updateVolumeBar();
        })

        eleVideoObj.on('ended', () => {
            eleVideoObj.currentTime = 0;
            $(elePlayPauseBtn).removeClass('_pause').addClass('_play');
            $(this).removeClass('_pause').addClass('_play');
            $(videoPlayer).removeClass('_hide-controls');
        })



        // user events
        // play the video
        $(elePlayPauseBtn['1']).on('click', () => {
            if ($(elePlayPauseBtn).hasClass('_play')) {
                eleVideoObj['0'].play();
            } else {
                eleVideoObj['0'].pause();
            }
            $(elePlayPauseBtn).toggleClass('_play _pause');
            $(this).toggleClass('_play _pause');

        })

        $(eleVideoPoster).on('click', () => {
            if ($(elePlayPauseBtn).hasClass('_play')) {
                eleVideoObj['0'].play();
            } else {
                eleVideoObj['0'].pause();
            }
            $(elePlayPauseBtn).toggleClass('_play _pause');
            $(this).toggleClass('_play _pause');
        })

        $(eleVideoObj).on('click', () => {
            if ($(elePlayPauseBtn).hasClass('_play')) {
                eleVideoObj['0'].play();
            } else {
                eleVideoObj['0'].pause();
            }
            $(elePlayPauseBtn).toggleClass('_play _pause');
            $(this).toggleClass('_play _pause');
        })

        // toggle volume
        $(eleToggleVolume).on('click', () => {
            eleVideoObj['0'].volume = eleVideoObj['0'].volume ? 0 : volumeValue;
            $(eleToggleVolume).toggleClass('_on _off');
        })
        // seekbar click 
        $(eleVideoSeekbar).on('click', e => {
            let tempSeekPosition = e.pageX - videoPlayer.offsetLeft - eleVideoSeekbar['0'].offsetLeft;
            let tempSeekValue = tempSeekPosition / eleVideoSeekbar['0'].clientWidth;
            eleVideoObj['0'].currentTime = tempSeekValue * totalDurationInSeconds;
        }) 
        // volumebar click
        $(eleVolumeSeekbar).on('click', e => {
            let tempVolumePosition = e.pageX - videoPlayer.offsetLeft - eleVolumeSeekbar['0'].offsetLeft;
            let tempVolumeValue = tempVolumePosition / eleVolumeSeekbar['0'].clientWidth;
            volumeValue = tempVolumeValue;
            eleVideoObj['0'].volume = tempVolumeValue.toFixed(1);
            volumePercentage = tempVolumeValue.toFixed(1) * 100;
            $(eleToggleVolume).addClass('_on').removeClass('_off');
        })
        // scroll a seekbar
        $(eleVideoSeekbar).on('mousewheel', e => {
            e.deltaY === 1 ? (eleVideoObj['0'].currentTime += 5) : (eleVideoObj['0'].currentTime -= 5)
        });
        // scroll a volume seekbar
        $(eleVolumeSeekbar).on('mousewheel', e => {
            let tempVolumeValue = eleVideoObj['0'].volume;
            if (e.deltaY === 1) {
                tempVolumeValue >= 1 ? (tempVolumeValue = 1) : (tempVolumeValue += 0.1);
            } else {
                tempVolumeValue <= 0 ? (tempVolumeValue = 0) : (tempVolumeValue -= 0.1);
            }
            volumeValue = tempVolumeValue.toFixed(1);
            eleVideoObj['0'].volume = tempVolumeValue.toFixed(1);
            if (eleVideoObj['0'].volume === 0) {
                $(eleToggleVolume)
                .addClass('off')
                .removeClass('on');
            } else {
                $(eleToggleVolume)
                .addClass('on')
                .removeClass('off');
            }
        });
        // expand
        $(eleVideoExpand).on('click', e => {
            $(eleVideoExpand).toggleClass('_small _expanded')
            $(eleVideoObj['0']).toggleClass('_small _expanded')
            if ($(eleVideoExpand).hasClass('_expanded')) {
                helper_openFullscreen(videoPlayer)
            } else {
                helper_exitFullscreen($(this))
            }
        })
    })
    const helper_getPercentage = (presentTime, totalTime) => {
        let calcPercentage = (presentTime / totalTime) * 100;
        return parseFloat(calcPercentage.toString());
    }
    const helper_calculateDuration = duration => {
        let seconds = parseInt(duration % 60);
        let minutes = parseInt((duration % 3600) / 60)
        return {
            minutes: helper_pad(minutes.toFixed()),
            seconds: helper_pad(seconds.toFixed())
        }
    }
    
    const helper_pad = number => {
        if (number > -10 && number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }
    function helper_openFullscreen(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
    function helper_exitFullscreen(elem) {
         var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
        if (isInFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
});
jQuery(document).ready(function() {
    $(function() {
        $('#partners-tabs').responsiveTabs({
            animation: 'slide',
            active: 2,
        })
    }) 
    jQuery.each( $('.partners-page__controls-item'), function(index) {
        $(this).removeClass('r-tabs-state-active');
    })
})
;
if (document.querySelector('.coctails-page__coctails')) {
    var mixer = mixitup(document.querySelector('.coctails-page__coctails'), {
        selectors: {
            target: '.coctails-page__item'
        },
        animation: {
            duration: 300
        }
    });
}
;
function isMobileDevice() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function removeClasses(targets, classToDelete) {
    for (let i = 0; i < targets.length; i++) {
        target = targets[i];
        target.classList.remove(classToDelete);
    }
}

function supportsTouch() {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

if (supportsTouch) {
    document.body.classList.add('_touch');
};
// Get dropdowns and form
const dropdowns = document.querySelectorAll('[data-dropdown]');
const form = document.querySelector('.products-page__search');

// Check if dropdowns exist on page
if(dropdowns.length > 0) {
  // Loop through dropdowns and create custom dropdown for each select element
  dropdowns.forEach(dropdown => {
    createCustomDropdown(dropdown);
  });
}

// Check if form element exist on page
if(form !== null) {
  // When form is submitted console log the value of the select field
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Selected country:', form.querySelector('[name="products"]').value);
  });
}

// Create custom dropdown
function createCustomDropdown(dropdown) {
  // Get all options and convert them from nodelist to array
  const options = dropdown.querySelectorAll('option');
  const optionsArr = Array.prototype.slice.call(options);

  // Create custom dropdown element and add class dropdown to it
  // Insert it in the DOM after the select field
  const customDropdown = document.createElement('div');
  customDropdown.classList.add('dropdown');
  dropdown.insertAdjacentElement('afterend', customDropdown);

  // Create element for selected option
  // Add class to this element, text from the first option in select field and append it to custom dropdown
  const selected = document.createElement('div');
  selected.classList.add('dropdown__selected');
  selected.textContent = optionsArr[0].textContent;
  customDropdown.appendChild(selected);

  // Create element for dropdown menu, add class to it and append it to custom dropdown
  // Add click event to selected element to toggle dropdown menu
  const menu = document.createElement('div');
  menu.classList.add('dropdown__menu');
  customDropdown.appendChild(menu);
  selected.addEventListener('click', toggleDropdown.bind(menu));

  // Create serach input element
  // Add class, type and placeholder to this element and append it to menu element
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('dropdown__menu_search_container')
  const search = document.createElement('input');
  search.placeholder = 'Введите ключевое слово';
  search.type = 'text';
  search.classList.add('dropdown__menu_search');
  searchContainer.appendChild(search);
  searchContainer.insertAdjacentHTML('afterbegin', '<i class="fas fa-search"></i>');
  menu.appendChild(searchContainer);

// focuse input
    search.addEventListener('focus', function() {
        search.closest('.dropdown__menu_search_container').classList.add('_focused');
    } )
    search.addEventListener('blur', function() {
        search.closest('.dropdown__menu_search_container').classList.remove('_focused');
    } )

  // Create wrapper element for menu items, add class to it and append to menu element
  const menuItemsWrapper = document.createElement('div');
  menuItemsWrapper.classList.add('dropdown__menu_items');
  menu.appendChild(menuItemsWrapper);

  // Loop through all options and create custom option for each option and append it to items wrapper element
  // Add click event for each custom option to set clicked option as selected option
  optionsArr.forEach(option => {
    const item = document.createElement('div');
    item.classList.add('dropdown__menu_item');
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    menuItemsWrapper.appendChild(item);

    item.addEventListener('click', setSelected.bind(item, selected, dropdown, menu));
  });

  // Add selected class to first custom option
  menuItemsWrapper.querySelector('div').classList.add('selected');

  // Add input event to search input element to filter items
  // Add click event to document element to close custom dropdown if clicked outside of it
  // Hide original dropdown(select)
  search.addEventListener('input', filterItems.bind(search, optionsArr, menu));
  document.addEventListener('click', closeIfClickedOutside.bind(customDropdown, menu));
  dropdown.style.display = 'none';
}

// Toggle dropdown
function toggleDropdown() {
  // Check if dropdown is opened and if it is close it, otherwise open it and focus search input
  if(this.offsetParent !== null) {
    this.style.display = 'none';
  }else {
    this.style.display = 'block';
    this.querySelector('input').focus();
  }
}

// Set selected option
function setSelected(selected, dropdown, menu) {
  // Get value and label from clicked custom option
  const value = this.dataset.value;
  const label = this.textContent;

  // Change the text on selected element
  // Change the value on select field
  selected.textContent = label;
  dropdown.value = value;

  // Close the menu
  // Reset search input value
  // Remove selected class from previously selected option and show all divs if they were filtered
  // Add selected class to clicked option
  menu.style.display = 'none';
  menu.querySelector('input').value = '';
  menu.querySelectorAll('div').forEach(div => {
    if(div.classList.contains('selected')) {
      div.classList.remove('selected');
    }
    if(div.offsetParent === null) {
      div.style.display = 'block';
    }
  });
  this.classList.add('selected');
}

// Filter items
function filterItems(itemsArr, menu) {
  // Get all custom options
  // Get the value of search input and convert it to all lowercase characters
  // Get filtered items
  // Get the indexes of filtered items
  const customOptions = menu.querySelectorAll('.dropdown__menu_items div');
  const value = this.value.toLowerCase();
  const filteredItems = itemsArr.filter(item => item.value.toLowerCase().includes(value));
  const indexesArr = filteredItems.map(item => itemsArr.indexOf(item));

  // Check if option is not inside indexes array and hide it and if it is inside indexes array and it is hidden show it
  itemsArr.forEach(option => {
    if(!indexesArr.includes(itemsArr.indexOf(option))) {
      customOptions[itemsArr.indexOf(option)].style.display = 'none';
    }else {
      if(customOptions[itemsArr.indexOf(option)].offsetParent === null) {
        customOptions[itemsArr.indexOf(option)].style.display = 'block';
      }
    }
  });
}

// Close dropdown if clicked outside dropdown element
function closeIfClickedOutside(menu, e) {
  if(e.target.closest('.dropdown') === null && e.target !== this && menu.offsetParent !== null) {
    menu.style.display = 'none';
  }
};