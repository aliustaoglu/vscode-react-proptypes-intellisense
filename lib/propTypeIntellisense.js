const vscode = require('vscode');

const propTypeIntellisense = () => {
  const editor = vscode.window.activeTextEditor;

  const sourceCode = editor.document.getText();
  const props = /.propTypes = {([\S\s]*?)}/.exec(sourceCode)[1];
  const propTypes = props.replace(/.PropTypes./g,'').split(',').map( p => p.replace(/\r\n/g, '') );
  
  const augmentString = "* @augments {Component<{" + propTypes.join() + ">}";
  const snippet = new vscode.SnippetString(augmentString);
  editor.insertSnippet(snippet);
};

module.exports = propTypeIntellisense;