import RequestService from '../services/request';

export function initialize () {

	let app = arguments[1] || arguments[0];

	app.register('request:session', RequestService);

    app.inject('route', 'request', 'service:request');
    app.inject('adapter', 'request', 'service:request');
    app.inject('component', 'request', 'service:request');
    app.inject('controller', 'request', 'service:request');

}

export default {
    name: 'request',
    initialize: initialize
};
