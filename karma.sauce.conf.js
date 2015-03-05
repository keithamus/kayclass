module.exports = function(config) {
    require('./karma.conf.js')(config);
    if (!process.env.SAUCELABS_ACCESSKEY) {
        console.warn('SAUCELABS_ACCESSKEY not set, attempting Chrome:');
        return;
    }
    var build = process.env.TRAVIS_JOB_NUMBER || Date.now();
    var tags = ['kayclass@' + build];
    if (process.env.TRAVIS_BRANCH) {
        tags.push('branch@' + process.env.TRAVIS_BRANCH);
    }
    if (process.env.TRAVIS_JOB_NUMBER) {
        tags.push('travis@' + process.env.TRAVIS_JOB_NUMBER);
    }
    var customLaunchers = {
        chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 8',
            version: '40',
        },
        firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Linux',
            version: '35.0',
        },
        safari: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.10',
            version: '8.0',
        }
    };
    config.set({

        sauceLabs: {
            username: process.env.SAUCELABS_USERNAME,
            accessKey: process.env.SAUCELABS_ACCESSKEY,
            startConnect: true,
            tags: tags,
            tunnelIdentifier: build,
            testName: 'KayClass',
        },

        customLaunchers: customLaunchers,

        reporters: ['progress', 'saucelabs'],

        browsers: Object.keys(customLaunchers),

        singleRun: true,
    });
};
