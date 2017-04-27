import Ember from 'ember';

export default Ember.Mixin.create({

    fastboot: Ember.inject.service(),

    getHost() {

        var headers = this.get('fastboot.request.headers');
        
        var host = headers.get('x-original-host');
        var protocol = headers.get('x-original-protocol');

        if ( host.indexOf('soluqi') !== -1 ) {
            protocol = "https";
        }

        return protocol + '://' + host;

    }

});
