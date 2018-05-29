import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import config from 'ember-get-config';

export default DS.JSONAPIAdapter.extend({

    location: service(),
    fastboot: service(),

    init() {

		this._super();

		this.set('namespace', config.APP.api_namespace);

        if ( this.get('fastboot.isFastBoot') === true ) {
            this.set('host', this.get('location.domain'));
        }

	},

    headers: computed('session.headers.Authorization', 'session.headers.Socket', function() {

        return this.get('session.headers');

    }),

    ajaxOptions(url, type, options) {

      let hash = this._super(...arguments);

      hash.withCredentials = false;
      hash.xhrFields = { withCredentials: false };

      return hash;

    }

});
