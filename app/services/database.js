import Ember from 'ember';

export default Ember.Service.extend({

	store: Ember.inject.service(),
	request: Ember.inject.service(),

	list(modelName, settings) {

		var list = this.get("store").peekAll(modelName);

		if ( list.get('length') > 0 ) {

			return Ember.RSVP.Promise.resolve(list);

		} else {

			return this.get("store").findAll(modelName, settings);

		}

	},

	// FIND --------------------------------------------------------------------

	find(modelName, id, included) {

		var record = this.get("store").peekRecord(modelName, id, included);

		if ( record ) {

			return Ember.RSVP.Promise.resolve(record);

		} else {

			return this.get("store").findRecord(modelName, id, included);

		}

	},

	// QUERY -------------------------------------------------------------------

	queryStore: [],

	query(list, authenticate) {

		var self = this;

		list = { list: list };
		var query = JSON.stringify(list);

		if ( this.get('queryStore').indexOf(query) !== -1 ) {

			return Ember.RSVP.Promise.resolve();

		} else {

			return this.get('request').GET("jsonapi/" + query, authenticate).then(function(data) {

				self.get('queryStore').push(query);

				self.get('store').pushPayload(data);

				return Ember.RSVP.Promise.resolve();

			});

		}

	},

});
