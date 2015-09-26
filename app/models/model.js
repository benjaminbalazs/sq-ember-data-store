import DS from 'ember-data';

export default DS.Model.reopen({

	ready() {

        this._super();

        this.store.increment(this.constructor.modelName);

    },

    didDelete() {

        this._super();

        this.store.decrement(this.constructor.modelName);

    }

});
