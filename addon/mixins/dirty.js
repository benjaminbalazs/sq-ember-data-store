import Mixin from '@ember/object/mixin';

export default Mixin.create({

    hasDirtyRelationships: false,

    //

    cache: {},

    init() {

        this._super();

        var self = this;
        this.eachRelationship(function(key, relationship) {

            console.log(key, self);

            self.addObserver(key, function(object, valami, nagy) {

                console.log(key, object, valami, nagy);

            });

        });

    }

});
