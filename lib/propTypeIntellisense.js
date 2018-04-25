const vscode = require('vscode');

const propTypeIntellisense = () => {
  const editor = vscode.window.activeTextEditor;

  const sourceCode = editor.document.getText();
  const props = /.propTypes = {([\S\s]*?)}/.exec(sourceCode);
  if (!props) {
    vscode.window.showWarningMessage('Proptypes not found');
    return;
  }
  const propTypesRaw = props[1]
    .replace(/.PropTypes./g, '')
    .split(',')
    .map(p => p.replace(/\r/g, '').replace(/\n/g, ''));
  const propTypes = propTypesRaw.map(t => t.replace(':func', ':Function').replace(':bool', ':boolean'));

  const reactClassName = sourceCode
    .substring(sourceCode.substring(0, props.index).lastIndexOf('\n'), props.index)
    .replace(/\r/g, '')
    .replace(/\n/g, '');

  const augmentString = '/**\r\n* @augments {Component<{' + propTypes.join() + '>}\r\n*/\r\n';
  const snippet = new vscode.SnippetString(augmentString);
  const reactClassLinePosition = editor.document.positionAt(sourceCode.indexOf('class ' + reactClassName));
  editor.insertSnippet(snippet, reactClassLinePosition);
};

module.exports = propTypeIntellisense;
