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
		this.cursor01 = node.querySelector('.cursor-01');
		this.listing = node.querySelector('.listing--products');
		this.listingInner = node.querySelector('.listing--products__inner');
		this.cards = Array.prototype.slice.call(node.querySelectorAll('.card--product')).map(x => new TotalLookCardComponent().setNode(x));
		this.pins = this.cards.map(x => new TotalLookPinComponent(x.item).setParentNode(this.picture));
		this.addListeners();
	}

	onDestroy() {
		this.removeListeners();
	}

	onImage(img) {
		this.img = img;
		this.node.classList.add('init');
		this.addDragListener();
		if (this.cards.length) {
			this.setActive(this.cards[0].item);
		} else {
			this.onResize();
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
			/*
			setTimeout(() => {
				this.node.classList.remove('show-hint');
			}, 4000);
			*/
		}
	}

	/*
	onEnter() {
		this.node.classList.add('enter');
	}

	onLeave() {
		this.node.classList.remove('enter');
	}

	onMove(event) {
		gsap.set(this.cursor01, {
			x: event.clientX,
			y: event.clientY,
			// duration: 0.3,
			// overwrite: true,
		});
	}
	*/

	loadImage() {
		const img = this.node.querySelector('.group--look img');
		const loader = new Image();
		loader.onload = () => {
			this.onImage(img);
		}
		loader.src = img.src;
	}

	setActive(item) {
		this.cards.forEach(x => {
			x.item !== item ? x.item.active = false : x.item.active = true;
			x.update();
		});
		this.pins.forEach(x => x.update());
		this.onResize();
	}

	onResize() {
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
		this.listingInner.style.width = 'auto';
		this.cards.forEach((card, i) => {
			const listingInnerWidth = card.node.offsetWidth * Math.ceil(this.cards.length / 2);
			if (i === 0) {
				this.listingInner.style.width = `${listingInnerWidth}px`;
			}
			if (card.item.active) {
				// const x = (card.node.getBoundingClientRect().left - this.listing.getBoundingClientRect().left) + this.listing.scrollLeft;
				const dx = containerWidth - listingInnerWidth;
				const translation = this.getTranslate(this.listingInner);
				let x = (this.listing.getBoundingClientRect().left - card.node.getBoundingClientRect().left) + translation.x;
				x = Math.min(0, Math.max(dx, x));
				gsap.to(this.listingInner, {
					x: x,
					duration: 0.3,
					delay: 0.1,
					overwrite: true,
				});
			}
			this.listingInnerWidth = listingInnerWidth;
		});
		this.pins.forEach(pin => {
			const pinX = imageWidth / img.naturalWidth * pin.item.position.x;
			const pinY = imageWidth / img.naturalWidth * pin.item.position.y;
			gsap.set(pin.node, {
				x: pinX,
				y: pinY,
			});
			if (pin.item.active) {
				const dx = containerWidth - imageWidth;
				const dy = containerHeight - imageHeight;
				const x = containerWidth / 2 - pinX;
				const y = containerHeight / 2 - pinY;
				gsap.to(this.picture, {
					x: Math.min(0, Math.max(dx, x)),
					y: Math.min(0, Math.max(dy, y)),
					duration: 0.3,
					overwrite: true,
				});
			}
		});
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

	addListeners() {
		this.loadImage();
		this.onResize = this.onResize.bind(this);
		this.onDelayedResize = this.onDelayedResize.bind(this);
		this.onWheel = this.onWheel.bind(this);
		// this.onMove = this.onMove.bind(this);
		// this.onEnter = this.onEnter.bind(this);
		// this.onLeave = this.onLeave.bind(this);
		window.addEventListener('resize', this.onDelayedResize);
		this.listing.addEventListener('mousewheel', this.onWheel);

		// window.addEventListener('mousemove', this.onMove);
		// this.groupLook.addEventListener('mouseenter', this.onEnter);
		// this.groupLook.addEventListener('mouseleave', this.onLeave);
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
		// window.removeEventListener('mousemove', this.onMove);
		// this.groupLook.removeEventListener('mouseenter', this.onEnter);
		// this.groupLook.removeEventListener('mouseleave', this.onLeave);
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
