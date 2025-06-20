// Импорты
import './navigation.js'

// Инициализация слайдера
document.addEventListener('DOMContentLoaded', () => {
	const heroSwiper = new Swiper('.hero-swiper', {
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		effect: 'fade',
		fadeEffect: {
			crossFade: true,
		},
	})
})

// DOM Elements
const header = document.querySelector('.main-header')
const burger = document.querySelector('.header__burger')
const overlayMenu = document.querySelector('.main-overlay-menu')
const closeMenu = document.querySelector('.main-overlay-menu__close')
const scrollLinks = document.querySelectorAll('a[href^="#"]')

// Функция открытия/закрытия меню
function toggleMenu(open) {
	if (!burger || !overlayMenu) return
	if (open === undefined) {
		burger.classList.toggle('active')
		overlayMenu.classList.toggle('active')
		document.body.classList.toggle('menu-open')
	} else if (open) {
		burger.classList.add('active')
		overlayMenu.classList.add('active')
		document.body.classList.add('menu-open')
	} else {
		burger.classList.remove('active')
		overlayMenu.classList.remove('active')
		document.body.classList.remove('menu-open')
	}
}

// Открытие меню по клику на бургер
if (burger && overlayMenu) {
	burger.addEventListener('click', () => toggleMenu())
}
// Закрытие меню по крестику
if (closeMenu) {
	closeMenu.addEventListener('click', () => toggleMenu(false))
}
// Закрытие меню по клику на ссылку
if (overlayMenu) {
	overlayMenu.addEventListener('click', e => {
		if (e.target.classList.contains('main-overlay-menu__link')) {
			toggleMenu(false)
		}
	})
}
// Закрытие меню по клику вне меню
if (overlayMenu) {
	document.addEventListener('click', e => {
		if (
			overlayMenu.classList.contains('active') &&
			!overlayMenu.contains(e.target) &&
			!burger.contains(e.target)
		) {
			toggleMenu(false)
		}
	})
}

// Header scroll behavior
let lastScroll = 0
window.addEventListener('scroll', () => {
	const currentScroll = window.pageYOffset

	if (currentScroll <= 0) {
		header.classList.remove('header--hidden')
		return
	}

	if (
		currentScroll > lastScroll &&
		!header.classList.contains('header--hidden')
	) {
		// Scroll down
		header.classList.add('header--hidden')
	} else if (
		currentScroll < lastScroll &&
		header.classList.contains('header--hidden')
	) {
		// Scroll up
		header.classList.remove('header--hidden')
	}

	lastScroll = currentScroll
})

// Smooth scroll for anchor links
scrollLinks.forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault()
		const targetId = link.getAttribute('href')
		const targetElement = document.querySelector(targetId)

		if (targetElement) {
			targetElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	})
})

// Intersection Observer for animations
const animateOnScroll = () => {
	const elements = document.querySelectorAll('.animate-on-scroll')

	elements.forEach(element => {
		const elementTop = element.getBoundingClientRect().top
		const elementBottom = element.getBoundingClientRect().bottom

		if (elementTop < window.innerHeight && elementBottom > 0) {
			element.classList.add('animate-on-scroll--visible')
		}
	})
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll)
window.addEventListener('load', animateOnScroll)

// Lazy loading images
const lazyLoadImages = () => {
	const images = document.querySelectorAll('img[data-src]')

	const imageObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target
				img.src = img.dataset.src
				img.removeAttribute('data-src')
				imageObserver.unobserve(img)
			}
		})
	})

	images.forEach(img => {
		imageObserver.observe(img)
	})
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', () => {
	lazyLoadImages()
})

// Shopping cart functionality
const cart = {
	items: [],

	addItem(product) {
		this.items.push(product)
		this.updateCart()
	},

	removeItem(productId) {
		this.items = this.items.filter(item => item.id !== productId)
		this.updateCart()
	},

	updateCart() {
		const cartCount = document.querySelector('.header__cart-count')
		if (cartCount) {
			cartCount.textContent = this.items.length
		}

		// Save to localStorage
		localStorage.setItem('cart', JSON.stringify(this.items))
	},

	init() {
		// Load from localStorage
		const savedCart = localStorage.getItem('cart')
		if (savedCart) {
			this.items = JSON.parse(savedCart)
			this.updateCart()
		}
	},
}

// Initialize cart
cart.init()

// Form validation
const forms = document.querySelectorAll('form[data-validate]')

forms.forEach(form => {
	form.addEventListener('submit', e => {
		e.preventDefault()

		let isValid = true
		const inputs = form.querySelectorAll('input[required], textarea[required]')

		inputs.forEach(input => {
			if (!input.value.trim()) {
				isValid = false
				input.classList.add('error')

				// Add error message
				const errorMessage = document.createElement('div')
				errorMessage.className = 'error-message'
				errorMessage.textContent = 'Это поле обязательно для заполнения'

				if (!input.nextElementSibling?.classList.contains('error-message')) {
					input.parentNode.insertBefore(errorMessage, input.nextSibling)
				}
			} else {
				input.classList.remove('error')
				const errorMessage = input.nextElementSibling
				if (errorMessage?.classList.contains('error-message')) {
					errorMessage.remove()
				}
			}
		})

		if (isValid) {
			// Here you would typically submit the form data
			console.log('Form is valid, submitting...')
		}
	})
})

// Remove error class on input
document.querySelectorAll('input, textarea').forEach(input => {
	input.addEventListener('input', () => {
		input.classList.remove('error')
		const errorMessage = input.nextElementSibling
		if (errorMessage?.classList.contains('error-message')) {
			errorMessage.remove()
		}
	})
})

// --- Фильтрация магазинов ---
if (document.querySelector('.shops__grid')) {
	const shopCards = Array.from(document.querySelectorAll('.shop-card'))
	const selects = document.querySelectorAll('.shops__filter .filter-select')

	// Для примера: добавим data-атрибуты к карточкам (лучше добавить в HTML, но можно и тут)
	const shopMeta = [
		{ category: 'clothing', floor: '2', brand: 'mass-market' }, // ZARA
		{ category: 'clothing', floor: '1', brand: 'mass-market' }, // H&M
		{ category: 'accessories', floor: '1', brand: 'premium' }, // Furla
		{ category: 'toys', floor: '3', brand: 'kids' }, // Lego
		{ category: 'beauty', floor: '2', brand: 'premium' }, // Natura Siberica
		{ category: 'gifts', floor: '2', brand: 'mass-market' }, // Красный Куб
		{ category: 'sports', floor: '3', brand: 'sports' }, // Nike
		{ category: 'food', floor: '-1', brand: 'mass-market' }, // Перекрёсток
		{ category: 'electronics', floor: '2', brand: 'premium' }, // Samsung
		{ category: 'jewelry', floor: '1', brand: 'premium' }, // Sokolov
		{ category: 'home', floor: '2', brand: 'premium' }, // Zara Home
	]
	shopCards.forEach((card, i) => {
		if (shopMeta[i]) {
			card.dataset.category = shopMeta[i].category
			card.dataset.floor = shopMeta[i].floor
			card.dataset.brand = shopMeta[i].brand
		}
	})

	function filterShops() {
		const [catSel, floorSel, brandSel] = selects
		const catVal = catSel.value
		const floorVal = floorSel.value
		const brandVal = brandSel.value
		shopCards.forEach(card => {
			let show = true
			if (catVal && card.dataset.category !== catVal) show = false
			if (floorVal && card.dataset.floor !== floorVal) show = false
			if (brandVal && card.dataset.brand !== brandVal) show = false
			card.style.display = show ? '' : 'none'
		})
	}
	selects.forEach(sel => sel.addEventListener('change', filterShops))
}

// --- Поиск магазинов ---
if (document.querySelector('.shop-search-input')) {
	const searchInput = document.querySelector('.shop-search-input')
	const shopCards = Array.from(document.querySelectorAll('.shop-card'))

	// Функция фильтрации по поиску и фильтрам
	function filterShopsFull() {
		// Фильтрация по select'ам
		const selects = document.querySelectorAll('.shops__filter .filter-select')
		const [catSel, floorSel, brandSel] = selects
		const catVal = catSel ? catSel.value : ''
		const floorVal = floorSel ? floorSel.value : ''
		const brandVal = brandSel ? brandSel.value : ''
		// Поиск
		const searchVal = searchInput.value.trim().toLowerCase()
		shopCards.forEach(card => {
			let show = true
			if (catVal && card.dataset.category !== catVal) show = false
			if (floorVal && card.dataset.floor !== floorVal) show = false
			if (brandVal && card.dataset.brand !== brandVal) show = false
			// Поиск по названию и описанию
			const title =
				card.querySelector('.shop-card__title')?.textContent.toLowerCase() || ''
			const desc =
				card
					.querySelector('.shop-card__description')
					?.textContent.toLowerCase() || ''
			if (searchVal && !title.includes(searchVal) && !desc.includes(searchVal))
				show = false
			card.style.display = show ? '' : 'none'
		})
	}
	// Событие на поиск
	searchInput.addEventListener('input', filterShopsFull)
	// Также обновлять при смене фильтров
	const selects = document.querySelectorAll('.shops__filter .filter-select')
	selects.forEach(sel => sel.addEventListener('change', filterShopsFull))
}

// --- Поиск событий ---
if (document.querySelector('.event-search-input')) {
	const searchInput = document.querySelector('.event-search-input')
	const eventCards = Array.from(document.querySelectorAll('.event-card'))
	function filterEvents() {
		const searchVal = searchInput.value.trim().toLowerCase()
		eventCards.forEach(card => {
			const title =
				card.querySelector('.event-card__title')?.textContent.toLowerCase() ||
				''
			const desc =
				card
					.querySelector('.event-card__description')
					?.textContent.toLowerCase() || ''
			const show =
				!searchVal || title.includes(searchVal) || desc.includes(searchVal)
			card.style.display = show ? '' : 'none'
		})
	}
	searchInput.addEventListener('input', filterEvents)
}
