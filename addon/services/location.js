import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    fastboot: Ember.inject.service(),

    // ROOT

    root: Ember.computed(function() {

        let host = this.get('host').split('.');

        if ( host.length > 2 ) {

            let tld = host[host.length-1];
            let domain = host[host.length-2];

            return domain + "." + tld;

        } else {

            return this.get('host');

        }

    }),

    // HOST

    host: Ember.computed(function() {

        if ( this.get('fastboot.isFastBoot') === true ) {

            const headers = this.get('fastboot.request.headers');

            if ( headers.get('x-forwarded-host') ) {

                return  headers.get('x-forwarded-host');

            } else if ( config.fastboot.host ) {

                return config.fastboot.host;

            } else {

                return this.get('fastboot.request.host');

            }

        } else {

            return window.location.host;

        }

    }),

    // PROTOCOL

    protocol: Ember.computed(function() {

        if ( this.get('fastboot.isFastBoot') === true ) {

            const headers = this.get('fastboot.request.headers');

            if ( headers.get('x-forwarded-proto') ) {

                return  headers.get('x-forwarded-proto') + "://";

            } else if ( config.fastboot.protocol ) {

                return config.fastboot.protocol + "://";

            } else {

                return this.get('fastboot.request.protocol') + "//";

            }

        } else {

            return window.location.protocol + "//";

        }

    }),

    // DOMAIN

    domain: Ember.computed(function() {

        return this.get('protocol') + this.get('host');

    }),

    // PATH

    path: Ember.computed(function() {

        if ( this.get('fastboot.isFastBoot') === true ) {

            return this.get('fastboot.request.path');

        } else {

            return window.location.pathname;

        }

    }),

    //

    tld: Ember.computed(function() {

        if ( this.get('host').indexOf('.dev') !== -1 ) {
            return '.dev';
        } else {
            return '.com';
        }

    }),

});
