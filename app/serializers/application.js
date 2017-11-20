import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

	keyForAttribute(key) {
		return key;
	},

	keyForRelationship(key) {
		return key;
	},

	_shouldSerializeHasMany(snapshot, key, relationship) {
    	return true;
  	},

});
