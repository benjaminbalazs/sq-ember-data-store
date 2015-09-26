import DS from 'ember-data';
import Model from './../models/model';

export default DS.Store.extend({

	lengths : Ember.Object.create(),

    increment(type) {

        if ( !this.get('lengths.'+type) ) {
            this.set('lengths.'+type, 0);
        }

        this.incrementProperty('lengths.'+type);

    },

    decrement(type) {
        this.decrementProperty('lengths.'+type);
    },

});
