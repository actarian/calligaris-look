import Component from "../component/component";

export default class TotalLookPinComponent extends Component {

	constructor(item) {
		super();
		this.item = item;
	}

	onInit(node) {
		this.info = this.node.querySelector('.info');
		this.content = this.node.querySelector('.content');
		this.arrow = this.node.querySelector('.arrow');
		this.addListeners();
	}

	onDestroy() {
		this.removeListeners();
	}

	onResize() {
		// console.log('TotalLookPinComponent.onResize');
		this.emit('click');
	}

	onClick() {
		// console.log('TotalLookPinComponent.onClick');
		this.emit('click');
	}

	addListeners() {
		// this.onResize = this.onResize.bind(this);
		this.onClick = this.onClick.bind(this);
		// window.addEventListener('resize', this.onResize);
		this.node.addEventListener('click', this.onClick);
	}

	removeListeners() {
		// window.removeEventListener('resize', this.onResize);
		this.node.removeEventListener('click', this.onClick);
	}

	render() {
		return /* html */ `<div class="pin">
			<div class="info">
				<div class="content">${this.item.info}</div>
				<div class="arrow"></div>
			</div>
		</div>`;
	}

	update() {
		if (this.item.active) {
			this.node.classList.add('active', 'active-info');
		} else {
			this.node.classList.remove('active', 'active-info');
		}
	}

}
