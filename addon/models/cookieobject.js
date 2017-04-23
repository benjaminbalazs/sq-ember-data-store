import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Object.extend({

    cookies: Ember.inject.service(),
    fastboot: Ember.inject.service(),

    set(keyName, value) {

        this._super(keyName, value);

    },

    init(...args) {

        this._super(...args);

        if ( this.get('storageKey') ) {

            var data = this.get('cookies').read(this.get('storageKey'));

            if ( data ) {

                try {

                    data = JSON.parse(data);

                    var self = this;

                    Object.keys(data).forEach(function(param) {
                        self.set(param, data[param]);
                    });

                } catch (error) {
                    console.error(error);
                }

            }

        }

        if ( this.get('observables') ) {

            var list = this.get('observables');

            for (var i = 0; i < list.length; i++) {
                var param = list[i];
                this.addObserver(param, this, 'write');
            }

        }

    },

    getContent() {

        var self = this;

        var list = Object.keys(this);

        if ( this.get('observables') ) {
            list = list.filter(function(item) {
                return ( self.get('observables').indexOf(item) !== -1 );
            });
        }

        var object = {};
        for (var i = 0; i < list.length; i++) {
            var value = this.get(list[i]);
            if ( value ) {
                object[list[i]] = value;
            }
        }

        return object;

    },

    host() {

        if ( this.get('fastboot.isFastBoot') !== true ) {
            return window.location.host;
        } else {
            return this.get('fastboot.request.host');
        }

    },

    write() {

        try {

            var date = new Date();
            date.setTime(date.getTime() + (365*24*60*60*1000));
            var expires = date.toUTCString();

            var domain = this.host();

            var secure = false;
            if ( config.environment === "production" ) { secure = true; }

            this.get('cookies').write(this.get('storageKey'), JSON.stringify(this.getContent()), {
                secure: secure,
                expires: expires,
                domain: domain,
                path: '/'
            });

        } catch (error) {
            console.error(error);
        }

    }

});
