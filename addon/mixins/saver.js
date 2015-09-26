import Ember from 'ember';

export default Ember.Mixin.create({

	save(model, param) {

		var self = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {

            self._super().then(function() {

				if ( model ) {

					model.get(param).pushObject(self);
					model.save().then(function() {
						resolve();
					}).catch(function(error) {
						reject(error);
					});

				} else {
					resolve();
				}

			}).catch(function(error) {
				reject(error);
			});

        });

	}

});
