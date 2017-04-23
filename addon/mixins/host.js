import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Mixin.create({

    fastboot: Ember.inject.service(),

    getHost() {

        if ( this.get('fastboot.isFastBoot') === true ) {

            var headers = this.get('fastboot.request.headers');

            return headers.get('x-original-protocol') + '://' + headers.get('x-original-host');

        } else {

            return config.APP.protocol + config.APP.domain;

        }

    }

});
