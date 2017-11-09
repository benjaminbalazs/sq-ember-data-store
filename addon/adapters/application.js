import DS from 'ember-data';
import Ember from 'ember';
import config from 'ember-get-config';
import Host from 'sq-ember-data-store/mixins/host';

export default DS.JSONAPIAdapter.extend(Host,{

    fastboot: Ember.inject.service(),

    headers: Ember.computed('session.headers.Authorization', 'session.headers.Socket-ID', 'session.headers.Site-ID', function() {

        return this.get('session.headers');

    }),

    init() {

		this._super();

		this.set('namespace', config.APP.api_namespace);

        if ( this.get('fastboot.isFastBoot') === true ) {

            this.set('host', this.getHost());

        }

	},

});
