#!/usr/bin/env node
var path = require('path'),
    optimist = require('optimist'),
    survey = require('../lib/survey'),
    argv = optimist.usage('Run a series of benchmarks exported from FILENAME.\nUsage:survey [options] FILENAME')
        .options({
            'count': {
                alias: 'c',
                description: 'An approximate number of times to run each test.',
                'default': 1000
            },
            'help': {
                description: 'Show this help message, then exit.'
            }
        })
        .demand(1)
        .argv,
    subject;

if (argv.help) {
    optimist.showHelp();
    process.exit();
}

try {
    subject = require(path.resolve(process.cwd(), process.argv[2]));
} catch(e) {
    console.error('Failed to load:', process.argv[2]);
    process.exit();
}

survey.run(subject, argv.count, console.log);
