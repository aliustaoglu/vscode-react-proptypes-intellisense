const vscode = require('vscode');

const propTypeIntellisense = () => {

  // Get the source code
  const editor = vscode.window.activeTextEditor;
  const sourceCode = editor.document.getText();

  // Get props from source file
  const props = /\bpropTypes\b\s*=\s*{([^}]*)}/.exec(sourceCode);

  // If there are no props in the current file
  if (!props) {
    vscode.window.showWarningMessage('Proptypes not found');
    return;
  }

  // Get class name
  const name = /.*\bclass\b\s+\b([a-zA-Z_]\w*)\b/.exec(sourceCode.substring(0, props.index));

  // If the propTypes are not in a class
  if (!name) {
    vscode.window.showWarningMessage('Prop types must be in a class.');
    return;
  }

  // Parse the propTypes
  const propTypesRaw = props[1]
    .replace(/\s*PropTypes\s*\.\s*/g, '') // Remove the "PropTypes."
    .split(',') // split by prop type
    .map(p => p.replace(/[\r\n, ]/g, '')); // Remove the useless spaces

  // Replace the types with valid Javascript types
  const propTypes = propTypesRaw
    .filter((value) => value.length > 0) // Remove empty strings
    .map(t => t.replace(':func', ':Function').replace(':bool', ':boolean'));

  // Get the class name
  const reactClassName = name[1];

  // Get the end of line
  let eol;
  if (editor.document.eol === vscode.EndOfLine.CRLF) {
    eol = '\r\n';
  }
  else {
    eol = '\n';
  }

  // Create the snippet
  const augmentString = `/**${eol}* @extends {React.Component<{${propTypes.join(', ')}}>}${eol}*/${eol}`;
  const snippet = new vscode.SnippetString(augmentString);

  // Get the line position of the class name
  const reactClassLinePosition = editor.document.positionAt(sourceCode.indexOf('class ' + reactClassName));

  // Insert the snippet
  editor.insertSnippet(snippet, reactClassLinePosition);
};

// Export the module
module.exports = propTypeIntellisense;
