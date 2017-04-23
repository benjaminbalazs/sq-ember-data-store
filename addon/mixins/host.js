import Ember from 'ember';

export default Ember.Mixin.create({

    fastboot: Ember.inject.service(),

    getHost() {

        let headers = this.get('fastboot.request.headers');

        let host = headers.get('x-original-host');
        let protocol = headers.get('x-original-protocol');

        if ( host.indexof('soluqi') !== -1 ) {
            protocol = "https";
        }

        return protocol + '://' + host;

    }

});
