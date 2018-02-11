import DS from 'ember-data';
import Ember from 'ember';
import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend({

    location: Ember.inject.service(),
    fastboot: Ember.inject.service(),

    init() {

		this._super();

		this.set('namespace', config.APP.api_namespace);

        if ( this.get('fastboot.isFastBoot') === true ) {
            this.set('host', this.get('location.domain'));
        }

	},

    headers: Ember.computed('session.headers.Authorization', 'session.headers.Socket', function() {

        return this.get('session.headers');

    }),

});
