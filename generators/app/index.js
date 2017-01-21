'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Generator.extend({
  init() {
    this.log(yosay(
      chalk.green('Welcome to rice!')
    ));

    this.argument('args', {
      type: Array,
      required: false
    });

    if (this.options && this.options.args) {
      return;
    }

    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'Your project name',
      default: this.appname
    }];

    return this.prompt(prompts).then(function(props) {
      this.props = props;
    }.bind(this));
  },

  writing() {
    if (this.options && this.options.args) {
      var name = (this.options.args[1]) ? this.options.args[1] : this.options.name,
        filename = name + this.options.args[0].substr(0, 1).toUpperCase() + this.options.args[0].substr(1)

      this.fs.copyTpl(
        this.templatePath(`${this.options.args[0]}.js`),
        this.destinationPath(`${filename}.js`), {
          name: (this.options.args[1]) ? this.options.args[1] : this.options.name
        }
      );

      return;
    }

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        "appname": this.props.appname
      }
    );

    this.fs.copy(
      this.templatePath('default'),
      this.destinationPath('./app')
    );

    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    this.fs.copy(
      this.templatePath('gitignore.txt'),
      this.destinationPath('.gitignore')
    );
  },


  install() {
    this.npmInstall(['ricejs'], {
      'save': true
    });

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });

    this.log("All set, good luck.")
  }
});