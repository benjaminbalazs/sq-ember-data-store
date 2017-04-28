import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Mixin.create({

    fastboot: Ember.inject.service(),

    getHost() {

        //var headers = this.get('fastboot.request.headers');
        //console.log(headers);
        //var host = headers.get('x-original-host');
        //var protocol = headers.get('x-original-protocol');

        //if ( host.indexOf('.com') !== -1 ) {
        //    protocol = "https";
        //}

        var host = config.APP.protocol + config.APP.domain;

        if ( config.fastboot.api_namespace ) {
            console.log(host + '/' + config.fastboot.api_namespace);
            return host + '/' + config.fastboot.api_namespace;

        } else {
            console.log(host);
            return host;
        }

    }

});
