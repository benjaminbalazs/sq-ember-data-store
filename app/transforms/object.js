import DS from 'ember-data';

export default DS.Transform.extend({

  deserialize(value) {
    if (typeof(value) !== 'object') {
      return {};
    } else {
      return value;
    }
  },

  serialize(value) {
    if (typeof(value) !== 'object') {
      return {};
    } else {
      return value;
    }
  }

});
