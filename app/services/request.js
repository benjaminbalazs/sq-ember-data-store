import Ember from 'ember';
import config from 'ember-get-config';
import fetch from 'ember-network/fetch';
import Host from 'sq-ember-data-store/mixins/host';

export default Ember.Service.extend(Host,{

    session: Ember.inject.service(),
    fastboot: Ember.inject.service(),

    // GET ---------------------------------------------------------------------

    GET(path, authenticate, relative, headers) {

        if ( this.get('fastboot.isFastBoot') === true ) {

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

            var object = {
    			method: method,
    		};

            if ( method !== "GET" ) {
                object.body = JSON.stringify(data);
            }
            if ( headers ) {
                object.headers = headers;
            }

            var url = "/" + config.APP.api_namespace + "/" + path;

            if ( self.get('fastboot.isFastBoot') === true ) {
                url = self.getHost() + "/" + config.APP.api_namespace + "/" + path;
            }
            if ( relative === true ) {
                url = path;
            }

            fetch( url, object ).then(self.checkStatus).then(function(response) { return response.json(); }).then(function(data) {

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
