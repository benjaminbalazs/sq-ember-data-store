import Ember from 'ember';

export default Ember.Service.extend({

	store: Ember.inject.service(),

	list(modelName, settings) {

		var list = this.get("store").peekAll(modelName);

		if ( list.get('length') > 0 ) {

			return Ember.RSVP.Promise.resolve(list);

		} else {

			return this.get("store").findAll(modelName, settings);

		}

	},

	find(modelName, id, included) {

		var record = this.get("store").peekRecord(modelName, id, included);

		if ( record ) {

			return Ember.RSVP.Promise.resolve(record);

		} else {

			return this.get("store").findRecord(modelName, id, included);

		}

	},

});
