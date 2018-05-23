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

	serializeAttribute(snapshot, json, key, attribute) {

	    if ( attribute.options && attribute.options.readOnly ) {
	    	return;
	    }
		
	    this._super(...arguments);

  	},

});
