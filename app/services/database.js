import Ember from 'ember';

export default Ember.Service.extend({

	store: Ember.inject.service(),
	request: Ember.inject.service(),
	fastboot: Ember.inject.service(),

	//

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

	init() {

		this._super();

	},

	query(list, authenticate) {

		var self = this;

		list = { list: list };
		var query = JSON.stringify(list);

		if ( this.getShoebox(query) === true ) {

			return Ember.RSVP.Promise.resolve();

		} else {

			return this.get('request').GET("query/" + encodeURIComponent(query), authenticate, null, null, false).then(function(data) {

				self.addShoebox(query);
				
				self.get('store').pushPayload(data);

				return Ember.RSVP.Promise.resolve();

			});

		}

	},

	// SHOEBOX -----------------------------------------------------------------

    addShoebox(query) {

		var selector = this.getSelector(query);

		if ( this.get('fastboot.isFastBoot') === true ) {
			this.get('fastboot.shoebox').put(selector, { status: true });
		}

		if ( this.get('queryStore') ) {
			this.get('queryStore').push(selector);
		} else {
			this.set('queryStore', [selector]);
		}

    },

    getShoebox(query) {

		var selector = this.getSelector(query);

		if ( this.get('fastboot.isFastBoot') !== true ) {

			var data = this.get('fastboot.shoebox').retrieve(selector);

			if ( data ) {
				return true;
			}

		}

		if ( this.get('queryStore') ) {
			return ( this.get('queryStore').indexOf(selector) !== -1 );
		} else {
			return false;
		}

    },

    getSelector(query) {

		query = JSON.parse(query);

		var list = query.list.map(function(item) {
			return item.modelName;
		});

		var string = 'QUERY-' + list.join('-');

		return string;

    }

});
