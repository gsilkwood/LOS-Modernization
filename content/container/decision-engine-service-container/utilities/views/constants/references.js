'use strict';

const guideLinks = {
  models: {
    modelTraining: 'https://docs.ClariFI.io/docs/model-training-and-evaluation',
    basicInformation:'https://docs.ClariFI.io/docs/model-training-and-evaluation#section-step-1-basic-information',
    selectType: 'https://docs.ClariFI.io/docs/model-training-and-evaluation#section-step-2-select-model-type',
    historicalData: 'https://docs.ClariFI.io/docs/model-training-and-evaluation#section-step-3-upload-historical-data',
    reviewTrain: 'https://docs.ClariFI.io/docs/model-training-and-evaluation#section-step-4-review-train',
    individualProcessing: 'https://docs.ClariFI.io/docs/generating-ml-model-predictions#section-interface-processing-individual',
    batchProcessing: 'https://docs.ClariFI.io/docs/generating-ml-model-predictions#section-interface-processing-batch',
    evaluation: 'https://docs.ClariFI.io/docs/model-training-and-evaluation#section-model-evaluation',
    modelSelection: 'https://docs.ClariFI.io/docs/model-training-and-evaluation#section-automl-modeling-process',
  },
  ocr: {
    templates: 'https://docs.ClariFI.io/docs/templates',
    individualProcessing: 'https://docs.ClariFI.io/docs/processing-1#section-interface-processing-individual',
    batchProcessing: 'https://docs.ClariFI.io/docs/processing-1#section-interface-processing-batch',
  },
  rulesEngine: {
    variables: 'https://docs.ClariFI.io/docs/decision-automation-strategies#section-data-structuring',
    strategies: 'https://docs.ClariFI.io/docs/decision-automation-strategies#section-creating-a-new-strategy',
    strategiesDetailProcessFlow: 'https://docs.ClariFI.io/docs/decision-automation-strategies#section-implementing-a-decision-flow',
    strategiesDetailRules: 'https://docs.ClariFI.io/docs/decision-automation-strategies#section-adding-rules-logic',
    strategiesDetailVersions: 'https://docs.ClariFI.io/docs/decision-automation-strategies#section-versions-locking',
    individualProcessing: 'https://docs.ClariFI.io/docs/processing-rules-engine#section-interface-processing-individual',
    batchProcessing: 'https://docs.ClariFI.io/docs/processing-rules-engine#section-interface-processing-batch',
    APIProcessing: 'https://docs.ClariFI.io/docs/processing-rules-engine#section-api-processing',
  },
  optimization: {
    '/data_sources': 'https://docs.ClariFI.io/docs/adding-a-data-source',
    '/data_sources/:id': 'https://docs.ClariFI.io/docs/adding-a-data-source',
    '/artificialintelligence': 'https://docs.ClariFI.io/docs/model-training-and-evaluation',
    '/mlmodels/:id': 'https://docs.ClariFI.io/docs/model-training-and-evaluation',
    '/analysis': 'https://docs.ClariFI.io/docs/evaluating-predictive-power',
  },
  simulation: {
    '/test_cases': 'https://docs.ClariFI.io/docs/reusable-cases',
    '/test_cases/:id/detail': 'https://docs.ClariFI.io/docs/reusable-cases',
    '/simulation': 'https://docs.ClariFI.io/docs/running-strategies',
    '/analysis': 'https://docs.ClariFI.io/docs/analyze-results',
  },
  integration: {
    '/dataintegrations': 'https://docs.ClariFI.io/docs/data-integrations',
    '/dataintegrations/:id/overview': 'https://docs.ClariFI.io/docs/data-integrations',
    '/dataintegrations/:id/data_setup': 'https://docs.ClariFI.io/docs/data-integrations',
    '/api_request': 'https://docs.ClariFI.io/docs/api-request',
    '/api_response': 'https://docs.ClariFI.io/docs/api-response',
  },
  companySettings: {
    userManagement: 'https://docs.ClariFI.io/docs/user-management',
    apiSetup: 'https://docs.ClariFI.io/docs/api-setup',
  },
  account: {
    profile: 'https://docs.ClariFI.io/docs/overview-of-my-account',
  },
}; 

module.exports = {
  guideLinks,
};