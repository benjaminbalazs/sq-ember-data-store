import Service from '../services/location';

export function initialize (app) {

	app.register('service:location', Service);
	app.inject('route', 'location', 'service:location');
    app.inject('component', 'location', 'service:location');

}

export default {
    name: 'location',
    initialize: initialize
};
