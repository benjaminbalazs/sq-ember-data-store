import DS from 'ember-data';
import Ember from 'ember';
import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend({

    fastboot: Ember.inject.service(),

    headers: Ember.computed('session.headers.Token', 'session.headers.User-ID', 'session.headers.Socket-ID', 'session.headers.Site-ID', function() {

        return this.get('session.headers');

    }),

    init() {

		this._super();

		this.set('namespace', config.APP.api_namespace);

        if ( this.get('fastboot.isFastBoot') === true && config.environment === "production" ) {

            var headers = this.get('fastboot.request.headers');
        
            this.set('host', headers.get('x-original-protocol') + '/' + headers.get('x-original-host'));

        }

	},

});
