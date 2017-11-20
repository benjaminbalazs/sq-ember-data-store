import DS from 'ember-data';
import Ember from 'ember';
import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend({

    init() {

		this._super();

		this.set('namespace', config.APP.api_namespace);

	},

    headers: Ember.computed('session.headers.Authorization', 'session.headers.Socket', function() {

        return this.get('session.headers');

    }),

});
