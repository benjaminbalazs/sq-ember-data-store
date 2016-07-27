import DS from 'ember-data';
import Ember from 'ember';

export default DS.JSONAPIAdapter.extend({

    headers: Ember.computed('session.headers.id', 'session.headers.token', 'session.headers.socket_id', function() {

        if ( this.get('session') ) {
            return this.get('session.headers');
        } else {
            return {};
        }

    }),

    init() {

		this._super();

		var config = Ember.getOwner(this)._lookupFactory('config:environment');
		this.namespace = config.APP.api_namespace;

	},

});
