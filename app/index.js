'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the brilliant' + chalk.red('Mservice') + ' generator!'
    ));

    function hasAMQPServer(answers) {
      return answers.connectorAMQPServer === true;
    }

    function hasSQLConnection(answers) {
      return answers.connectorSQL === true;
    }

    function defineSQLSchema(answers) {
      return answers.connectorSQL_createSchema === true;
    }

    function hasS3(answers) {
      return answers.connectorS3 === true;
    }

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name?',
        default: this.appname.replace(/\s/g, '-').replace('mservice-', '')
      },
      {
        type: 'input',
        name: 'username',
        message: 'What\'s your Github username?',
        store: true
      },
      {
        type: 'input',
        name: 'email',
        message: 'Your email?',
        store: true
      },
      {
        type: 'input',
        name: 'description',
        message: 'What does this module do?',
        default: 'Microservice for Ark AMQP infrastructure'
      },
      {
        type: 'input',
        name: 'main',
        message: 'default executable file',
        default: 'bin/start.js'
      },
      {
        type: 'confirm',
        name: 'connectorAMQPClient',
        message: 'Do you need AMQP client?',
        default: true
      },
      {
        type: 'confirm',
        name: 'connectorAMQPServer',
        message: 'Do you need AMQP server?',
        default: false
      },
      {
        type: 'input',
        name: 'connectorAMQPServer_listen',
        message: 'What route should AMQP server listen to?',
        when: hasAMQPServer
      },
      {
        type: 'input',
        name: 'connectorAMQPServer_queue',
        message: 'What queue name should it have?',
        when: hasAMQPServer
      },
      {
        type: 'confirm',
        name: 'connectorAMQPServer_neck',
        message: 'Should the messages be acked?',
        when: hasAMQPServer,
        default: false
      },
      {
        type: 'input',
        name: 'connectorAMQPServer_neck_size',
        message: 'How many messages should be processed at the same time?',
        when: function (answers) {
          return answers.connectorAMQPServer_neck === true;
        }
      },
      {
        type: 'confirm',
        name: 'connectorSQL',
        message: 'Should it include SQL connector?',
        default: false
      },
      {
        type: 'input',
        name: 'connectorSQL_database',
        message: 'SQL database name',
        when: hasSQLConnection
      },
      {
        type: 'confirm',
        name: 'connectorSQL_createSchema',
        message: 'Should we define SQL schema?',
        when: hasSQLConnection,
        default: false
      },
      {
        type: 'input',
        name: 'connectorSQL_createSchema_sequenceName',
        message: 'SQL sequence name',
        when: defineSQLSchema
      },
      {
        type: 'confirm',
        name: 'connectorS3',
        message: 'Should it include S3 connector?',
        default: false
      },
      {
        type: 'input',
        name: 'connectorS3_user',
        message: 'What user should be used for connecting to S3?',
        default: 'test',
        when: hasS3
      },
      {
        type: 'input',
        name: 'connectorS3_bucket',
        message: 'What bucket should be used for connecting to S3?',
        default: 'test-bucket',
        when: hasS3
      }
    ];

    this.prompt(prompts, function (props) {
      this.answers = props;
      done();
    }.bind(this));
  },

  configuring: {

    app: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('npmignore'),
        this.destinationPath('.npmignore')
      );
    }

  },

  writing: {
    app: function () {

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.answers
      );

      // add amqp client
      if (this.answers.connectorAMQPClient) {
        this.fs.copyTpl(
          this.templatePath('connectors/_amqp-client.js'),
          this.destinationPath('connectors/amqp-client.js'),
          this.answers
        );
      }

      // add amqp server
      if (this.answers.connectorAMQPServer) {
        this.fs.copyTpl(
          this.templatePath('connectors/_amqp-server.js'),
          this.destinationPath('connectors/amqp.js'),
          this.answers
        );
      }

      // add SQL client
      if (this.answers.connectorSQL) {
        this.fs.copyTpl(
          this.templatePath('connectors/_sql.js'),
          this.destinationPath('connectors/sql.js'),
          this.answers
        );

        if (this.answers.connectorSQL_createSchema) {
          this.fs.copyTpl(
            this.templatePath('connectors/sql/_schema.sql'),
            this.destinationPath('connectors/sql/schema.sql'),
            this.answers
          );

          this.fs.copyTpl(
            this.templatePath('connectors/sql/_sequence.sql'),
            this.destinationPath('connectors/sql/sequence.sql'),
            this.answers
          );
        }
      }

      // add S3 client
      if (this.answers.connectorS3) {
        this.fs.copyTpl(
          this.templatePath('connectors/_s3.js'),
          this.destinationPath('connectors/s3.js'),
          this.answers
        );
      }

      // now add configuration
      this.fs.copyTpl(
        this.templatePath('lib/_config.js'),
        this.destinationPath('lib/config.js'),
        this.answers
      );

      this.fs.copyTpl(
        this.templatePath('_config.json'),
        this.destinationPath('config.json'),
        this.answers
      );

      // add default logger
      this.fs.copyTpl(
        this.templatePath('lib/_logger.js'),
        this.destinationPath('lib/logger.js'),
        this.answers
      );

      // generate bin file
      this.fs.copyTpl(
        this.templatePath('bin/_start.js'),
        this.destinationPath('bin/start.js'),
        this.answers
      );

      // generate main service file
      this.fs.copyTpl(
        this.templatePath('lib/_service.js'),
        this.destinationPath('lib/service.js'),
        this.answers
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
