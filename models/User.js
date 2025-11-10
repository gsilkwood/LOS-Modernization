'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  entitytype: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: String,
  last_name: String,
  phone: String,
  status: {
    email_verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    mfa: {
      type: Boolean,
      default: false,
    },
  },
  primaryasset: {
    type: Schema.Types.ObjectId,
    ref: 'Asset',
  },
  association: {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  userroles: [{
    type: Schema.Types.ObjectId,
    ref: 'Userrole',
  }],
});

module.exports = mongoose.model('User', UserSchema);
