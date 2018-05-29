import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import config from 'ember-get-config';

export default Service.extend({

    fastboot: service(),

    // ROOT

    root: computed(function() {

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

    host: computed(function() {

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

    protocol: computed(function() {

        if ( this.get('fastboot.isFastBoot') === true ) {

            const headers = this.get('fastboot.request.headers');

            if ( headers.get('x-forwarded-protocol') ) {

                return  headers.get('x-forwarded-protocol') + "://";

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

    domain: computed(function() {

        return this.get('protocol') + this.get('host');

    }),

    // PATH

    path: computed(function() {

        if ( this.get('fastboot.isFastBoot') === true ) {

            return this.get('fastboot.request.path');

        } else {

            return window.location.pathname;

        }

    }),

    //

    tld: computed(function() {

        if ( this.get('host').indexOf('.test') !== -1 ) {
            return '.test';
        } else {
            return '.com';
        }

    }),

});
