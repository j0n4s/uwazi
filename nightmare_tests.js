require('babel-core/register')();

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var reporters = require('jasmine-reporters');
var exec = require('child_process').exec;

var dbConfig = require('./app/api/config/database.js');
dbConfig.db_url = dbConfig.development;

var systemKeys = require('./app/api/i18n/systemKeys.js');
var translations = require('./app/api/i18n/translations.js');

jasmine.loadConfig({
  spec_dir: '/',
  spec_files: [
    'nightmare/helpers/extensions.js',
    // 'nightmare/**/*.spec.js'
    'nightmare/zones/*.spec.js'
  ]
});

jasmine.addReporter(new reporters.TerminalReporter({
  verbosity: 2,
  color: true,
  showStack: true
}));

exec('cd nightmare/fixtures;./restore.sh', (error) => {
  if (error) {
    console.log(error);
    return;
  }
  jasmine.execute();
})
.stdout.pipe(process.stdout);
