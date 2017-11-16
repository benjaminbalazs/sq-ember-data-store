import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Service.extend({

    fastboot: Ember.inject.service(),

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

});
