import Ember from 'ember';
import config from 'ember-get-config';
import fetch from 'ember-network/fetch';

export default Ember.Service.extend({

    session: Ember.inject.service(),

    // GET ---------------------------------------------------------------------

    GET(path, authenticate, relative, headers) {

        if ( this.get('fastboot.isFastBoot') === false ) {

            var data = this.getShoebox('GET', path);

            if ( data ) {
                return Ember.RSVP.Promise.resolve(data);
            } else {
                return this._get(path, authenticate, relative, headers);
            }

        } else {
            return this._get(path, authenticate, relative, headers);
        }

    },

    _get(path, authenticate, relative, headers) {

        if ( authenticate ) {
            return this.factory('GET', path, this.get('session.headers'), relative);
        } else {
            return this.factory('GET', path, headers, relative);
        }

    },

    // POST --------------------------------------------------------------------

    POST(path, attributes, authenticate, relative) {

        var data = { data: { attributes: attributes } };

        var headers = { 'Access-Control-Allow-Origin': '*' };

        if ( authenticate ) {
            headers['User-ID'] = this.get('session.headers.User-ID');
            headers['Token'] = this.get('session.headers.Token');
        }

        return this.factory('POST', path, headers, data, relative);

    },

    // PRIVATE -----------------------------------------------------------------

    factory(method, path, headers, data, relative) {

        this.set('processing', true);

        var self = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {

            if ( !headers ) { headers = {}; }
            headers['Content-Type'] = 'application/vnd.api+json';

            data = {
    			method: method,
    			body: JSON.stringify(data),
    			headers: headers,
    		};

            var url = config.APP.protocol + config.APP.domain + "/" + config.APP.api_namespace + "/" + path;
            if ( relative === true ) {
                url = path;
            }

            fetch( url, data ).then(self.checkStatus).then(function(response) { return response.json(); }).then(function(data) {

                if ( self.get('fastboot.isFastBoot') === true ) {
                    self.addShoebox(method, path, data);
                }

                self.set('processing', false);
                resolve(data);

            }).catch(function(error) {

                self.set('processing', false);
                reject(error);

            });

        });

    },

    checkStatus(response) {

        if ( response.status >= 200 && response.status < 300 ) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }

    },

    // SHOEBOX -----------------------------------------------------------------

    fastboot: Ember.inject.service(),

    addShoebox(method, path, data) {

        this.get('fastboot.shoebox').put(this.getSelector(method, path), data);

    },

    getShoebox(method, path) {

        var data = this.get('fastboot.shoebox').retrieve(this.getSelector(method, path));

        return data;

    },

    getSelector(path, method) {

        var id = path + "-" + method;
        return id.split('/').join('-');

    }

});
