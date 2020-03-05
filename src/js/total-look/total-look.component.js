import Component from "../component/component";
import DragListener from "../drag/drag.listener";
import TotalLookCardComponent from "./total-look-card.component";
import TotalLookPinComponent from "./total-look-pin.component";

export default class TotalLookComponent extends Component {

	onInit(node) {
		console.log('TotalLookComponent', node);
		this.groupLook = node.querySelector('.group--look');
		this.picture = node.querySelector('.group--look .picture');
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
		} else {
			imageWidth = (groupLook.offsetHeight * imgRatio);
			imageHeight = groupLook.offsetHeight;
		}
		picture.style.width = `${imageWidth}px`;
		picture.style.height = `${imageHeight}px`;
		this.containerWidth = containerWidth;
		this.containerHeight = containerHeight;
		this.imageWidth = imageWidth;
		this.imageHeight = imageHeight;
		if (this.cards.length) {
			const width = this.cards[0].node.offsetWidth * Math.ceil(this.cards.length / 2);
			this.listingInner.style.width = `${width}px`;
		}
		this.pins.forEach(x => {
			gsap.set(x.node, {
				x: imageWidth / img.naturalWidth * x.item.position.x,
				y: imageWidth / img.naturalWidth * x.item.position.y,
			});
		});
	}

	loadImage() {
		const img = this.node.querySelector('.group--look img');
		img.onload = () => {
			this.onImage(img);
		}
	}

	setActive(item) {
		this.cards.forEach(x => {
			x.item !== item ? x.item.active = false : x.item.active = true;
			x.update();
		});
		this.pins.forEach(x => x.update());
	}

	addListeners() {
		this.loadImage();
		this.onResize = this.onResize.bind(this);
		window.addEventListener('resize', this.onResize);
		this.cards.forEach(x => {
			x.on('click', () => {
				console.log('TotalLookComponent.card.click', x.item);
				this.setActive(x.item);
			});
		});
		this.pins.forEach(x => {
			x.on('click', () => {
				console.log('TotalLookComponent.pin.click', x.item);
				this.setActive(x.item);
			});
		});
	}

	removeListeners() {
		this.removeDragListener();
		window.removeEventListener('resize', this.onResize);
	}

	addDragListener() {
		const picture = this.picture;
		let x_ = 0,
			y_ = 0;
		this.draglistener = new DragListener(this.groupLook, (e) => {
			const transform = picture.style.transform;
			if (transform) {
				const coords = transform.split('(')[1].split([')'])[0].split(',');
				x_ = parseFloat(coords[0]);
				y_ = parseFloat(coords[1]);
			}
		}, (e) => {
			const dx = this.containerWidth - this.imageWidth;
			const dy = this.containerHeight - this.imageHeight;
			const x = x_ + e.distance.x;
			const y = y_ + e.distance.y;
			gsap.to(picture, {
				x: Math.min(0, Math.max(dx, x)),
				y: Math.min(0, Math.max(dy, y)),
				duration: 0.3,
				overwrite: true,
			});
		}, (e) => {
			//
		});
	}

	removeDragListener() {
		if (this.draglistener) {
			this.draglistener.destroy();
		}
	}

}
