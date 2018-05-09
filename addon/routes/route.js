import Route from '@ember/routing/route';

export default Route.reopen({

    autoreset: true,

    resetController() {

        this._super();

        if ( this.get('autoreset') ) {
            var model = this.get('currentModel');
            if ( model ) {
                if ( model.get ) {
                    if ( model.get('isNew') ) {
                        model.deleteRecord();
                    }
                    if ( model.get('hasDirtyAttributes') ) {
                        model.rollbackAttributes();
                    }
                }
            }
        }

    },

});
