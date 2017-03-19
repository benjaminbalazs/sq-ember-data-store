import Ember from 'ember';

export default Ember.Mixin.create({

	save(model, param) {

		var self = this;

        return self._super().then(function() {

			if ( model ) {

				model.get(param).pushObject(self);

				model.save().then(function() {

					return Ember.RSVP.Promise.resolve();

				});

			} else {
				return Ember.RSVP.Promise.resolve();
			}
		});

	}

});
