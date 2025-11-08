'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  entitytype: {
    type: String,
    default: 'organization',
  },
  esign: {
    platform_terms_and_conditions: {
      consent: Boolean,
      version: String,
      date: Date,
      ip_address: String,
      user_agent: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    website_terms_of_service: {
      consent: Boolean,
      version: String,
      date: Date,
      ip_address: String,
      user_agent: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    privacy_policy: {
      consent: Boolean,
      version: String,
      date: Date,
      ip_address: String,
      user_agent: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  save_data: {
    type: Boolean,
    default: false,
  },
  data_retention: {
    type: Number,
    default: 7,
  },
  status: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  association: {
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
  },
});

module.exports = mongoose.model('Organization', OrganizationSchema);
