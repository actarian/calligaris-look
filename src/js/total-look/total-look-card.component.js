import Component from "../component/component";

export default class TotalLookCardComponent extends Component {

	onInit(node) {
		this.item = node.hasAttribute('data-item') ? new Function(`return ${node.getAttribute('data-item')}`)() : {};
		this.addListeners();
	}

	onDestroy() {
		this.removeListeners();
	}

	onResize() {
		console.log('TotalLookCardComponent.onResize');
	}

	onClick() {
		// console.log('TotalLookCardComponent.onClick');
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

	update() {
		if (this.item.active) {
			this.node.classList.add('active');
		} else {
			this.node.classList.remove('active');
		}
	}

}
