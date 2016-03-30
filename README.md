# Survey

A tool for benchmarking in the surveying sense, not in a competitive sense. The
goal of Survey is _not_ to declare a "winner". The results are sorted in order
of lowest-duration-first not to determine which one is the "fastest"; instead,
to simply determine which versions took longer to run than other. Hopefully
that information can inform some decision you have to make, but that duration
is just data.

## Basic installation & usage

Survey is installed via npm:

```
npm install -g survey
```

Survey is used from the command-line:

```
survey some-module-here.js
```

## Test module format

```js
var crypto = require('crypto');

module.exports = {
  'id via Math.random': function () {
    Math.random().toString().slice(2);
  },
  'id via crypto.randomBytes': function () {
    crypto.randomBytes(24).toString('hex');
  }
};
```

Given a module like the one above, named `random-id.js`, and if you run Survey
with `survey random-id` or `survey random-id.js`, survey would print a report
not quite entirely unlike the following:

```
Surveying: random-id

 [=============================] 100% 0.0s

Name                       Actual Count  Average Duration (µs)
-------------------------  ------------  ---------------------
id via Math.random                10012                   2.99
id via crypto.randomBytes          9988                   8.11
```

## Available options

| Flag(s) | Description |
|---------|-------------|
| `--count n, -c n` | An approximate number of times to run each test. Since tests are run at random, tests may be run a little more or less often than the desired `count` before Survey considers the testing complete. |
| `--verbose, -v` | If enabled, Survey will print a message each time a test function is run. This can be useful for debugging, especially if Survey seems to hang or take a long time running tests. |
| `--json, -j` | If enabled, Survey will print _nothing_ save a single report of the results in JSON format: an Array of test results, sorted by duration, with three keys: the `name` of the test, the actual `count` of test runs, and the `average` duration. |
| `--parallel n, -p n` | If enabled, Survey will parallelize tests as much as possible. A single, numerical option can be provided to enable parallelization with a limited number of parallel runs. |
| `--help, -h` | If enabled, Survey will print basic usage information, then exit without running tests. |

## Synchronous vs asynchronous tests

If a test function takes an argument, it should be a single `callback` argument
the test is expected to invoke once the test has completed. If no argument is
expected by the function, none with be provided, and the test will be considered
complete once the function has returned execution to its caller.
