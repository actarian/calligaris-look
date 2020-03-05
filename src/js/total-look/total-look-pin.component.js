import Component from "../component/component";

export default class TotalLookPinComponent extends Component {

	constructor(item) {
		super();
		this.item = item;
	}

	onInit(node) {
		this.addListeners();
	}

	onDestroy() {
		this.removeListeners();
	}

	onResize() {
		console.log('TotalLookPinComponent.onResize');
		this.emit('click');
	}

	onClick() {
		// console.log('TotalLookPinComponent.onClick');
		this.emit('click');
	}

	addListeners() {
		this.onResize = this.onResize.bind(this);
		this.onClick = this.onClick.bind(this);
		window.addEventListener('resize', this.onResize);
		this.node.addEventListener('click', this.onClick);
	}

	removeListeners() {
		window.removeEventListener('resize', this.onResize);
		this.node.removeEventListener('click', this.onClick);
	}

	render() {
		return `<div class="pin"></div>`;
	}

	update() {
		if (this.item.active) {
			this.node.classList.add('active');
		} else {
			this.node.classList.remove('active');
		}
	}

}
