import { Promise as EmberPromise } from 'rsvp';
import Mixin from '@ember/object/mixin';

export default Mixin.create({

	saveAndLink(model, param) {

		var self = this;

		return this.save().then(function() {

			model.get(param).pushObject(self);

			return model.save().then(function() {

				return EmberPromise.resolve(self);

			});

		});

	}

});
