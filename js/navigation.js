// Пункты меню
const menuItems = [
	{
		title: 'Главная',
		url: 'index.html',
	},
	{
		title: 'Магазины',
		url: 'pages/shops.html',
	},
	{
		title: 'О ТРЦ',
		url: 'pages/about.html',
	},
]

// DOM Elements
const header = document.querySelector('.main-header')
const burger = document.querySelector('.header__burger')
const mobileMenu = document.querySelector('.mobile-menu')
const closeMenu = document.querySelector('.mobile-menu__close')
const mobileLinks = document.querySelectorAll('.mobile-menu__nav-link')

// Функция для создания мобильного меню
function createMobileMenu() {
	const mobileNav = document.querySelector('.main-overlay-menu__nav')
	if (!mobileNav) return

	// Очищаем существующие ссылки
	mobileNav.innerHTML = ''

	menuItems.forEach(item => {
		const link = document.createElement('a')
		link.href = item.url
		link.className = 'main-overlay-menu__link'
		link.textContent = item.title

		// Добавляем класс active для текущей страницы
		if (window.location.pathname.endsWith(item.url)) {
			link.classList.add('active')
		}

		mobileNav.appendChild(link)
	})
}

// Функция открытия/закрытия меню
function toggleMenu() {
	if (burger && mobileMenu) {
		burger.classList.toggle('active')
		mobileMenu.classList.toggle('active')
		document.body.style.overflow = mobileMenu.classList.contains('active')
			? 'hidden'
			: ''
	}
}

// Инициализация меню при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
	createMobileMenu()

	// Открытие меню по клику на бургер
	if (burger) {
		burger.addEventListener('click', toggleMenu)
	}

	// Закрытие меню по клику на крестик
	if (closeMenu) {
		closeMenu.addEventListener('click', toggleMenu)
	}

	// Закрытие меню по клику на ссылку
	if (mobileLinks.length) {
		mobileLinks.forEach(link => {
			link.addEventListener('click', toggleMenu)
		})
	}

	// Закрытие меню по клику вне меню
	document.addEventListener('click', e => {
		if (
			mobileMenu &&
			mobileMenu.classList.contains('active') &&
			!mobileMenu.contains(e.target) &&
			!burger.contains(e.target)
		) {
			toggleMenu()
		}
	})

	// Активная ссылка в мобильной навигации
	const currentPath = window.location.pathname
	mobileLinks.forEach(link => {
		if (
			link.getAttribute('href') === currentPath ||
			(currentPath === '/' && link.getAttribute('href') === 'index.html')
		) {
			link.classList.add('active')
		}
	})

	// Скрытие/показ шапки при скролле
	let lastScroll = 0
	const scrollThreshold = 100

	window.addEventListener('scroll', () => {
		const currentScroll = window.pageYOffset

		if (currentScroll <= scrollThreshold) {
			header.classList.remove('header--hidden')
			return
		}

		if (
			currentScroll > lastScroll &&
			!header.classList.contains('header--hidden')
		) {
			// Скролл вниз - скрываем шапку
			header.classList.add('header--hidden')
		} else if (
			currentScroll < lastScroll &&
			header.classList.contains('header--hidden')
		) {
			// Скролл вверх - показываем шапку
			header.classList.remove('header--hidden')
		}

		lastScroll = currentScroll
	})
})
