import TotalLookComponent from './total-look/total-look.component';

export default class Main {

	constructor() {
		const components = this.addComponents();
	}

	addComponents() {
		const SELECTORS = {
			'[total-look]': TotalLookComponent,
		};
		let instances = [];
		for (let key in SELECTORS) {
			instances = instances.concat(Array.from(document.querySelectorAll(key))
				.map(node => {
					const instance = new SELECTORS[key]().setNode(node);
					instance.on('click', () => {
						alert('clicked');
					});
					return instance;
				}));
		}
		instances.forEach(x => console.log(x));
		return instances;
	}

}

const main = new Main();
