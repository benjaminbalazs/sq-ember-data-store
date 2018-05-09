import { A } from '@ember/array';
import DS from 'ember-data';

export default DS.Transform.extend({

    serialize: function(deserialized) {
        return !!deserialized ? deserialized.toArray() : null;
    },

    deserialize: function(serialized) {
        return A(serialized);
    }
    
});
