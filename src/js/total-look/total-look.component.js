import Component from "../component/component";
import DragListener from "../drag/drag.listener";
import TotalLookCardComponent from "./total-look-card.component";
import TotalLookPinComponent from "./total-look-pin.component";

let to;

export default class TotalLookComponent extends Component {

	onInit(node) {
		// console.log('TotalLookComponent', node);
		this.groupLook = node.querySelector('.group--look');
		this.picture = node.querySelector('.group--look .picture');
		this.listing = node.querySelector('.listing--products');
		this.listingInner = node.querySelector('.listing--products__inner');
		this.cards = Array.prototype.slice.call(node.querySelectorAll('.card--product')).map(x => new TotalLookCardComponent().setNode(x));
		this.pins = this.cards.map(x => new TotalLookPinComponent(x.item).setParentNode(this.picture));
		this.more = node.querySelector('.btn--more');
		this.close = node.querySelector('.btn--close');
		this.addListeners();
	}

	onDestroy() {
		this.removeListeners();
	}

	onImage(img) {
		this.img = img;
		this.node.classList.add('init');
		this.addDragListener();
		if (this.cards.length && window.innerWidth >= 1024) {
			this.setActive(this.cards[0].item, true);
		} else {
			this.onResize(true);
		}
	}

	set direction(direction) {
		if (this.direction_ !== direction) {
			this.direction_ = direction;
			if (direction === 'vertical') {
				this.node.classList.add('vertical');
				this.node.classList.remove('horizontal');
			} else {
				this.node.classList.add('horizontal');
				this.node.classList.remove('vertical');
			}
			this.node.classList.add('show-hint');
		}
	}

	loadImage() {
		const img = this.node.querySelector('.group--look img');
		const loader = new Image();
		loader.onload = () => {
			this.onImage(img);
		};
		loader.src = img.src;
	}

	setActive(item, immediate = false) {
		this.cards.forEach(x => {
			x.item !== item ? x.item.active = false : x.item.active = true;
			x.update();
		});
		this.pins.forEach(x => x.update());
		this.onResize(immediate);
	}

	onResize(event) {
		this.windowWidth = window.innerWidth;
		const img = this.img;
		const groupLook = this.groupLook;
		const picture = this.picture;
		const containerWidth = groupLook.offsetWidth;
		const containerHeight = groupLook.offsetHeight;
		const containerRatio = containerWidth / containerHeight;
		const imgRatio = img.naturalWidth / img.naturalHeight;
		let imageWidth, imageHeight;
		if (containerRatio > imgRatio) {
			imageWidth = groupLook.offsetWidth;
			imageHeight = (groupLook.offsetWidth / imgRatio);
			this.direction = 'vertical';
		} else {
			imageWidth = (groupLook.offsetHeight * imgRatio);
			imageHeight = groupLook.offsetHeight;
			this.direction = 'horizontal';
		}
		picture.style.width = `${imageWidth}px`;
		picture.style.height = `${imageHeight}px`;
		this.containerWidth = containerWidth;
		this.containerHeight = containerHeight;
		this.imageWidth = imageWidth;
		this.imageHeight = imageHeight;
		this.cards.forEach((card, i) => {
			const listingInnerWidth = Math.ceil(card.node.getBoundingClientRect().width) * Math.ceil(this.cards.length / 2);
			if (i === 0) {
				this.listingInner.style.minWidth = `${listingInnerWidth}px`;
			}
			if (card.item.active) {
				const dx = containerWidth - listingInnerWidth;
				const translation = this.getTranslate(this.listingInner);
				let x = (this.listing.getBoundingClientRect().left - card.node.getBoundingClientRect().left) + translation.x;
				x = Math.min(0, Math.max(dx, x));
				(event ? gsap.set : gsap.to)(this.listingInner, {
					x: x,
					duration: 0.3,
					delay: 0.1,
					overwrite: true,
				});
			}
			this.listingInnerWidth = listingInnerWidth;
		});
		const pinPosition = {
			x: 0,
			y: 0
		};
		this.pins.forEach(pin => {
			const pinX = imageWidth / img.naturalWidth * pin.item.position.x;
			const pinY = imageWidth / img.naturalWidth * pin.item.position.y;
			pin.item.pinX = pinX;
			pin.item.pinY = pinY;
			gsap.set(pin.node, {
				x: pinX,
				y: pinY,
			});
			// fix baloon position x
			if (pinX < 110) {
				gsap.set(pin.content, {
					x: Math.max(0, 110 - pinX),
				});
			} else if (pinX > imageWidth - 110) {
				gsap.set(pin.content, {
					x: Math.min(0, imageWidth - 110 + pinX),
				});
			}
			if (pin.item.active) {
				pinPosition.x = pinX;
				pinPosition.y = pinY;
			}
		});
		const dx = containerWidth - imageWidth;
		const dy = containerHeight - imageHeight;
		let x = containerWidth / 2 - pinPosition.x;
		let y = containerHeight / 2 - pinPosition.y;
		if (event) {
			gsap.set(this.picture, {
				x: Math.min(0, Math.max(dx, x)),
				y: Math.min(0, Math.max(dy, y)),
			});
			this.onPictureUpdate();
		} else {
			gsap.to(this.picture, {
				x: Math.min(0, Math.max(dx, x)),
				y: Math.min(0, Math.max(dy, y)),
				duration: 0.3,
				overwrite: true,
				onUpdate: this.onPictureUpdate,
				callbackScope: this,
			});
		}
	}

	onPictureUpdate() {
		if (this.windowWidth < 1024) {
			const pin = this.pins.find(x => x.item.active);
			if (pin) {
				console.log(pin, pin.item.pinX);
			}
		}
	}

	onWheel(event) {
		// console.log(event.deltaY);
		event.preventDefault();
		const dx = this.containerWidth - this.listingInnerWidth;
		const translation = this.getTranslate(this.listingInner);
		let x = translation.x - event.deltaY;
		x = Math.min(0, Math.max(dx, x));
		gsap.to(this.listingInner, {
			x: x,
			duration: 0.3,
			overwrite: true,
		});
	}

	onDelayedResize() {
		gsap.set(this.listingInner, {
			x: 0,
		});
		to ? clearTimeout(to) : null;
		to = setTimeout(this.onResize, 5);
	}

	onOpenPanel() {
		this.listing.classList.add('opened');
	}

	onClosePanel() {
		this.listing.classList.remove('opened');
	}

	addListeners() {
		this.loadImage();
		this.onResize = this.onResize.bind(this);
		this.onDelayedResize = this.onDelayedResize.bind(this);
		this.onWheel = this.onWheel.bind(this);
		this.onOpenPanel = this.onOpenPanel.bind(this);
		this.onClosePanel = this.onClosePanel.bind(this);
		window.addEventListener('resize', this.onDelayedResize);
		this.listing.addEventListener('mousewheel', this.onWheel);
		this.more.addEventListener('click', this.onOpenPanel);
		this.close.addEventListener('click', this.onClosePanel);
		this.cards.forEach(x => {
			x.on('click', () => {
				// console.log('TotalLookComponent.card.click', x.item);
				this.setActive(x.item);
				this.node.classList.remove('open');
				this.node.classList.remove('show-hint');
			});
		});
		this.pins.forEach(x => {
			x.on('click', () => {
				// console.log('TotalLookComponent.pin.click', x.item);
				this.setActive(x.item);
				this.node.classList.add('open');
				this.node.classList.remove('show-hint');
			});
		});
	}

	removeListeners() {
		this.removeDragListener();
		window.removeEventListener('resize', this.onResize);
		this.listing.removeEventListener('mousewheel', this.onWheel);
		this.more.removeEventListener('click', this.onOpenPanel);
		this.close.removeEventListener('click', this.onClosePanel);
	}

	addDragListener() {
		const picture = this.picture;
		let translation = {
			x: 0,
			y: 0
		};
		this.draglistener = new DragListener(this.groupLook, (e) => {
			translation = this.getTranslate(picture);
			this.node.classList.remove('open');
			this.node.classList.remove('show-hint');
			this.node.classList.add('grabbing');
			this.pins.forEach(x => x.node.classList.remove('active-info'));
		}, (e) => {
			const dx = this.containerWidth - this.imageWidth;
			const dy = this.containerHeight - this.imageHeight;
			const x = translation.x + e.distance.x;
			const y = translation.y + e.distance.y;
			gsap.to(picture, {
				x: Math.min(0, Math.max(dx, x)),
				y: Math.min(0, Math.max(dy, y)),
				duration: 0.3,
				overwrite: true,
				onUpdate: this.onPictureUpdate,
				callbackScope: this,
			});
		}, (e) => {
			//
			this.node.classList.remove('grabbing');
		});
	}

	removeDragListener() {
		if (this.draglistener) {
			this.draglistener.destroy();
		}
	}

	getTranslate(node) {
		let x = 0,
			y = 0;
		const transform = node.style.transform;
		if (transform) {
			const coords = transform.split('(')[1].split([')'])[0].split(',');
			x = parseFloat(coords[0]);
			y = parseFloat(coords[1]);
		}
		return {
			x,
			y
		};
	}

}
