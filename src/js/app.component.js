import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import UserService from './user/user.service';

export default class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		// console.log('context', context);
		UserService.user$.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(user => {
			console.log('AppComponent.user$', user);
			this.user = user;
			this.pushChanges();
		});
	}

	onDropped(id) {
		console.log('AppComponent.onDropped', id);
	}

	// onView() { const context = getContext(this); }

	// onChanges() {}

	// onDestroy() {}
}

AppComponent.meta = {
	selector: '[app-component]',
};
