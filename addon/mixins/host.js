import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Mixin.create({

    fastboot: Ember.inject.service(),

    getHost() {

        var host = config.APP.protocol + config.APP.domain;

        var headers = this.get('fastboot.request.headers');
        var realHost = headers.get('X-Real-Host');
        var realScheme = headers.get('X-Real-Scheme');

        if ( realHost && realScheme ) {
            host = realScheme + '://' + realHost;
        }
        console.log(realHost, realScheme);

        if ( config.fastboot.api_namespace ) {
            return host + '/' + config.fastboot.api_namespace;
        } else {
            return host;
        }

    }

});
