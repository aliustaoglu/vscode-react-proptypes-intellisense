const vscode = require('vscode');
const propTypeIntellisense = require('./lib/propTypeIntellisense');

const activate = context => {
  let disposable = vscode.commands.registerCommand('aliustaoglu.proptypesIntellisense', propTypeIntellisense);
  context.subscriptions.push(disposable);
};

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
