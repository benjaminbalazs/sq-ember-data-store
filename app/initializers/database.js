import Service from '../services/database';

export function initialize (app) {

	app.register('service:database', Service);
	app.inject('route', 'database', 'service:database');
    app.inject('component', 'database', 'service:database');

}

export default {
    name: 'database',
    initialize: initialize
};
