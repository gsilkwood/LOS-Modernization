'use strict';

const periodic = require('periodicjs');
const Promisie = require('promisie');
const utilities = require('../utilities');
const helpers = utilities.helpers;
const logger = periodic.logger;
const path = require('path');
const CoreMailer = periodic.core.mailer;
const mailerSendEmail = Promisie.promisify(CoreMailer.sendEmail);

let emailTemplateData = {
  welcome_to_ClariFI: {
    subject: 'Welcome to ClariFI’s Loan Origination Platform!',
    from: 'ClariFI <support@clarifi.io>',
    templatename: 'welcome_to_ClariFI.ejs',
    templatedata: {
      appname: periodic.settings.name,
      hostname: periodic.settings.application.hostname || periodic.settings.name,
      basepath: '/auth/sign-in',
      url: periodic.settings.application.url,
      protocol: periodic.settings.application.protocol,
    }
  },
  thanks_for_signing_up: {
    subject: 'Thanks for signing up',
    from: 'Brad Vanderstarren <brad@digifi.io>',
    templatename: 'thanks_for_signing_up.ejs',
    templatedata: {
      appname: periodic.settings.name,
      hostname: periodic.settings.application.hostname || periodic.settings.name,
      basepath: '/auth/sign-in',
      url: periodic.settings.application.url,
      protocol: periodic.settings.application.protocol,
    }
  },
  learn_more_use_cases: {
    subject: 'ClariFI - Learn More: Common Use Cases & Applications',
    from: 'ClariFI <support@clarifi.io>',
    templatename: 'learn_more_use_cases.ejs',
    templatedata: {
      appname: periodic.settings.name,
      hostname: periodic.settings.application.hostname || periodic.settings.name,
      basepath: '/auth/sign-in',
      url: periodic.settings.application.url,
      protocol: periodic.settings.application.protocol,
    }
  },
  learn_more_evolution: {
    subject: 'ClariFI - Learn More: The Evolution of Decision Automation',
    from: 'ClariFI <support@clarifi.io>',
    templatename: 'learn_more_evolution.ejs',
    templatedata: {
      appname: periodic.settings.name,
      hostname: periodic.settings.application.hostname || periodic.settings.name,
      basepath: '/auth/sign-in',
      url: periodic.settings.application.url,
      protocol: periodic.settings.application.protocol,
    }
  },
  tutorial_machine_learning_models: {
    subject: 'ClariFI - Tutorial: Training Machine Learning',
    from: 'ClariFI <support@clarifi.io>',
    templatename: 'tutorial_machine_learning_models.ejs',
    templatedata: {
      appname: periodic.settings.name,
      hostname: periodic.settings.application.hostname || periodic.settings.name,
      basepath: '/auth/sign-in',
      url: periodic.settings.application.url,
      protocol: periodic.settings.application.protocol,
    }
  },
  learn_more_automl: {
    subject: 'ClariFI - Learn More: How AutoML is Leveling the Playing Field',
    from: 'ClariFI <support@clarifi.io>',
    templatename: 'learn_more_automl.ejs',
    templatedata: {
      appname: periodic.settings.name,
      hostname: periodic.settings.application.hostname || periodic.settings.name,
      basepath: '/auth/sign-in',
      url: periodic.settings.application.url,
      protocol: periodic.settings.application.protocol,
    }
  },
}

async function sendEmail(req, res, next) {
  req.controllerData = req.controllerData || {};
  let { templatename, user, } = req.body;
  let options = emailTemplateData[ templatename ];
  let config = {
    from: `${options.from}`,
    subject: `${options.subject}`,
    generateTextFromHTML: true,
    bcc: periodic.settings.periodic.emails.notification_address,
    emailtemplatefilepath: path.resolve(periodic.config.app_root, `content/container/decision-engine-service-container/utilities/views/email/${options.templatename}`),
    emailtemplatedata: options.templatedata,
  };
  config.emailtemplatedata.user = user;
  config.emailtemplatedata.user.unsubscribe_link = config.emailtemplatedata.protocol + config.emailtemplatedata.url + `/unsubscribe/${user.email}`;
  config.to = user.email;
  let email = await periodic.core.mailer.sendEmail(config);
  return next();
}

module.exports = {
  sendEmail
}