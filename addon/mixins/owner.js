import Ember from 'ember';
import { belongsTo } from 'ember-data/relationships';

export default Ember.Mixin.create({

	owner: belongsTo('user'),

});
