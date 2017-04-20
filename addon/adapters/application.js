import DS from 'ember-data';
import Ember from 'ember';
import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend({

    fastboot: Ember.inject.service(),

    headers: Ember.computed('session.headers.Token', 'session.headers.User-ID', 'session.headers.Socket-ID', function() {

        if ( this.get('session.headers.User-ID') ) {
            return this.get('session.headers');
        } else {
            return {
                'User-ID': '',
                'Token': '',
            };
        }

    }),

    init() {

		this._super();

		this.set('namespace', config.APP.api_namespace);

        if ( config.environment === "production" ) {
            this.set('host', config.APP.protocol + config.APP.domain);
        }

	},

});
