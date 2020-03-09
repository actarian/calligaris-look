import Component from "../component/component";

export default class TotalLookCardComponent extends Component {

	onInit(node) {
		this.item = node.hasAttribute('data-item') ? new Function(`return ${node.getAttribute('data-item')}`)() : {};
		this.item.info = node.querySelector('.group--info').innerHTML;
		this.buy = node.querySelector('.btn--buy');
		this.addListeners();
	}

	onDestroy() {
		this.removeListeners();
	}

	onResize() {
		// console.log('TotalLookCardComponent.onResize');
	}

	onClick(event) {
		if (window.innerWidth >= 1024) {
			event.preventDefault();
			// console.log('TotalLookCardComponent.onClick');
			this.emit('click');
		}
	}

	onBuyClick() {
		// console.log('TotalLookCardComponent.onBuyClick');
		window.location.href = this.node.getAttribute('href');
	}

	addListeners() {
		// this.onResize = this.onResize.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onBuyClick = this.onBuyClick.bind(this);
		// window.addEventListener('resize', this.onResize);
		this.node.addEventListener('click', this.onClick);
		this.buy.addEventListener('click', this.onBuyClick);
	}

	removeListeners() {
		// window.removeEventListener('resize', this.onResize);
		this.node.removeEventListener('click', this.onClick);
		this.buy.removeEventListener('click', this.onBuyClick);
	}

	update() {
		if (this.item.active) {
			this.node.classList.add('active');
		} else {
			this.node.classList.remove('active');
		}
	}

}
