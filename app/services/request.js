import { Promise as EmberPromise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import config from 'ember-get-config';
import fetch from 'fetch';

export default Service.extend({

    session: service(),
    fastboot: service(),
    location: service(),

    // GET ---------------------------------------------------------------------

    GET(path, authenticate, relative, headers, shoebox) {

        if ( !headers && authenticate === true ) {
            headers = this.get('session.headers');
        } else {
            headers = {};
        }

        if ( this.get('fastboot.isFastBoot') !== true && shoebox !== false ) {

            var data = this.getShoebox('GET', path);

            if ( data ) {

                return EmberPromise.resolve(data);

            } else {

                return this.factory('GET', path, headers, relative, 'application/vnd.api+json', shoebox);

            }

        } else {

            return this.factory('GET', path, headers, relative, 'application/vnd.api+json', shoebox);

        }

    },

    // POST --------------------------------------------------------------------

    POST(path, attributes, authenticate, relative, headers) {

        var data = { data: { attributes: attributes } };

        if ( !headers ) {
            headers = {};
        }

        headers['Access-Control-Allow-Origin'] = '*';

        if ( authenticate ) {
            headers['Authorization'] = this.get('session.headers.Authorization');
        }

        return this.factory('POST', path, headers, data, relative, 'application/vnd.api+json');

    },

    // PRIVATE -----------------------------------------------------------------

    async factory(method, path, headers, data, relative, contentType, shoebox) {

        this.set('processing', true);

        var object = { method: method, };

        // HEADERS
        if ( !headers ) { headers = {}; }

        // CONTENT TYPE
        if ( contentType ) {
            headers['Content-Type'] = contentType;
        }
        if ( headers ) {
            object.headers = headers;
        }

        // GET
        if ( method !== "GET" ) {

            if ( contentType ) {
                object.body = JSON.stringify(data);
            } else {
                object.body = data;
            }

        }

        // URL
        var url = this.get('location.domain') + "/" + config.APP.api_namespace + "/" + path;

        if ( relative === true ) {
            url = path;
        }

        try {

            const response = await fetch( url, object );
            const result = await response.json();

            if ( response.status < 200 || response.status >= 300 ) {
                throw result;
            }

            if ( this.get('fastboot.isFastBoot') === true && shoebox !== false ) {
                this.addShoebox(method, path, result);
            }

            this.set('processing', false);

            return result;

        } catch (error) {

            this.set('processing', false);

            return EmberPromise.reject(error);

        }

    },

    // SHOEBOX -----------------------------------------------------------------

    addShoebox(method, path, data) {

        this.get('fastboot.shoebox').put(this.getSelector(method, path), data);

    },

    getShoebox(method, path) {

        var data = this.get('fastboot.shoebox').retrieve(this.getSelector(method, path));

        return data;

    },

    getSelector(path, method) {

        var id = path + "-" + method;
        id = id.split('/').join('-');
        id = id.split('?').join('-');
        id = id.split('=').join('-');

        return id;

    }

});
