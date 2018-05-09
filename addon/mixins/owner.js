import Mixin from '@ember/object/mixin';
import { belongsTo } from 'ember-data/relationships';

export default Mixin.create({

	owner: belongsTo('user'),

});
