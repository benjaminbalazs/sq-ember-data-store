import Ember from 'ember';
import config from 'ember-get-config';
import fetch from 'fetch';
import Host from 'sq-ember-data-store/mixins/host';

export default Ember.Service.extend(Host,{

    session: Ember.inject.service(),
    fastboot: Ember.inject.service(),

    // GET ---------------------------------------------------------------------

    GET(path, authenticate, relative, headers, shoebox) {

        if ( !headers ) {
            headers = this.get('session.headers');
        }

        if ( this.get('fastboot.isFastBoot') !== true && shoebox !== false ) {

            var data = this.getShoebox('GET', path);

            if ( data ) {
                return Ember.RSVP.Promise.resolve(data);
            } else {
                return this._get(path, authenticate, relative, headers, shoebox);
            }

        } else {

            return this._get(path, authenticate, relative, headers, shoebox);

        }

    },

    _get(path, authenticate, relative, headers, shoebox) {

        if ( authenticate ) {
            return this.factory('GET', path, this.get('session.headers'), relative, 'application/vnd.api+json', shoebox);
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
            headers['User-ID'] = this.get('session.headers.User-ID');
            headers['Token'] = this.get('session.headers.Token');
        }

        return this.factory('POST', path, headers, data, relative, 'application/vnd.api+json');

    },

    // PRIVATE -----------------------------------------------------------------

    factory(method, path, headers, data, relative, contentType, shoebox) {

        this.set('processing', true);

        var self = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {

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

            var url = "/" + config.APP.api_namespace + "/" + path;

            if ( self.get('fastboot.isFastBoot') === true ) {
                url = self.getHost() + "/" + config.APP.api_namespace + "/" + path;
            }
            if ( relative === true ) {
                url = path;
            }

            fetch( url, object ).then(self.checkStatus).then(function(response) { return response.json(); }).then(function(data) {

                if ( self.get('fastboot.isFastBoot') === true && shoebox !== false ) {
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
            return response.json().then(function(result) {
                throw result;
            });
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
        return id.split('/').join('-');

    }

});
