import Ember from 'ember';

export default Ember.Mixin.create({

	saveAndLink(model, param) {

		var self = this;

		return this.save().then(function() {

			model.get(param).pushObject(self);

			return model.save().then(function() {

				return Ember.RSVP.Promise.resolve(self);

			});

		});

	}

});
