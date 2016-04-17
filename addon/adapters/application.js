import DS from 'ember-data';
import Ember from 'ember';

export default DS.JSONAPIAdapter.extend({

    headers: Ember.computed('session.headers.id', 'session.headers.token', function() {

        if ( this.get('session') ) {
            return this.get('session.headers');
        } else {
            return {};
        }

    }),

    init() {

		this._super();

		var config = Ember.getOwner(this)._lookupFactory('config:environment');
		this.namespace = config.APP.api_namespace;

	},

    findRecord: function(store, type, id, snapshot) {

        var included = this.getIncludedRelationships(type);
        var query = {};
        if ( included.length !== 0 ) {
            query.included = included.toString();
        }

        return this.ajax(this.buildURL(type.modelName, id, snapshot, 'findRecord'), 'GET', { data: query } );

    },

    findAll: function(store, type, sinceToken) {

        var query, url;

        if (sinceToken) {
            query = { since: sinceToken };
        }

        var included = this.getIncludedRelationships(type);
        if ( included.length !== 0 ) {
            if ( !query ) {
                query = {};
            }
            query.included = included.toString();
        }

        url = this.buildURL(type.modelName, null, null, 'findAll');

        return this.ajax(url, 'GET', { data: query });

    },

    getIncludedRelationships(type) {

        var included = [];

        var relationshipsByName = Ember.get(type, 'relationshipsByName');
        type.eachRelationship(function(param) {
            var relationship = relationshipsByName.get(param);
            if ( relationship.options.async === false ) {
                included.push(param);
            }
        });

        return included;

    }

});
