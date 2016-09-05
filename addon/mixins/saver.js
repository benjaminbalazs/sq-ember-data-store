import Ember from 'ember';

export default Ember.Mixin.create({

	save(model, param) {

		var self = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {

            self._super().then(function(data) {

				if ( model ) {

					model.get(param).pushObject(self);

					if ( model.get('hasDirtyAttributes') === true ) {

						model.save().then(function() {
							resolve(data);
						}).catch(function(error) {
							reject(error);
						});

					} else {
						resolve();
					}
				} else {
					resolve();
				}
			}).catch(function(error) {
				reject(error);
			});

        });

	}

});
