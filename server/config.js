/*
* Create and export configuratin variables
*/

// Container for all the environments
const environments = {};

// Staging default environment
environments.staging = {
    httpPort: 7000,
    envName: 'staging',
    hashingSecret: 'thisisasecret',
}

// Production Environment
environments.production = {
    port: 5000,
    envName: 'production',
    hashingSecret: 'thisisasecret'
}

const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module

module.exports = environmentToExport;