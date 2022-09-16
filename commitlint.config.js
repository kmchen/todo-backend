/**
 * # Commitlint Configuration
 *
 * See: https://commitlint.js.org/#/ -
 *      https://commitlint.js.org/#/reference-rules
 */

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-case': [0, 'never'],
        'subject-full-stop': [0, 'always'],
    },
}
