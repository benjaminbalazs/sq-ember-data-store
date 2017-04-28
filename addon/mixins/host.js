import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Mixin.create({

    fastboot: Ember.inject.service(),

    getHost() {

        var host = config.APP.protocol + config.APP.domain;

        if ( config.fastboot.api_namespace ) {
            return host + '/' + config.fastboot.api_namespace;
        } else {
            return host;
        }

    }

});
