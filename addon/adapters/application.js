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

        if ( this.get('fastboot.isFastBoot') === true ) {
            console.log(this.get('fastboot.request.host'));
            console.log(this.get('fastboot.request'));
        }

        if ( config.environment === "production" ) {
            this.set('host', config.APP.protocol + config.APP.domain);
        }

	},

});
