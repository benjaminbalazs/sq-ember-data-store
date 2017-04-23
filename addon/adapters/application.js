import DS from 'ember-data';
import Ember from 'ember';
import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend({

    fastboot: Ember.inject.service(),

    headers: Ember.computed('session.headers.Token', 'session.headers.User-ID', 'session.headers.Socket-ID', 'session.headers.Site-ID', function() {

        return this.get('session.headers');

    }),

    init() {

		this._super();

		this.set('namespace', config.APP.api_namespace);
        console.log('d',  this.get('fastboot.isFastBoot'), config.environment);
        if ( this.get('fastboot.isFastBoot') === true && config.environment === "production" ) {

            var headers = this.get('fastboot.request.headers');

            var host = headers.get('x-original-host');

            this.set('host', host);

        }

        //if ( config.environment === "production" ) {
        //    this.set('host', config.APP.protocol + config.APP.domain);
        //}

	},

});
