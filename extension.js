const vscode = require("vscode");
const path = require("path");
const https = require("https");

function activate(context) {
  // Show React Webview Command
  let showWebviewCommand = vscode.commands.registerCommand(
    "extension.showReactWebview",
    function () {
      const panel = vscode.window.createWebviewPanel(
        "reactWebview",
        "React Webview",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.join(__dirname, "dist"))],
          retainContextWhenHidden: true,
        }
      );

      panel.webview.html = getWebviewContent(panel);

      panel.webview.onDidReceiveMessage(
        (message) => {
          if (message.command === "alert") {
            vscode.window.showInformationMessage(message.text);
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  // Stack Overflow Hover Command
  let stackOverflowCommand = vscode.commands.registerCommand(
    "extension.searchStackOverflow",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection).trim();

      if (!selectedText) {
        vscode.window.showInformationMessage("Please select some code to search.");
        return;
      }

      const query = encodeURIComponent(selectedText);
      const options = {
        hostname: "api.stackexchange.com",
        path: `/2.3/search/advanced?order=desc&sort=relevance&q=${query}&site=stackoverflow`,
        headers: {
          "User-Agent": "vscode-extension"
        }
      };

      https.get(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);

            if (parsed.error_message) {
              vscode.window.showErrorMessage(
                `Stack Overflow API Error: ${parsed.error_message}`
              );
              return;
            }

            if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
              vscode.window.showInformationMessage("No results found on Stack Overflow.");
              return;
            }

            const topResults = parsed.items.slice(0, 3);
            const markdown = new vscode.MarkdownString(
              topResults
                .map((item, idx) => `**${idx + 1}. [${item.title}](${item.link})**`)
                .join("\n\n")
            );
            markdown.isTrusted = true;

            const hover = new vscode.Hover(markdown);

            const provider = {
              provideHover() {
                return hover;
              },
            };

            const disposableHover = vscode.languages.registerHoverProvider("*", provider);
            context.subscriptions.push(disposableHover);

            vscode.window.showInformationMessage(
              " Hover over the selected code to see Stack Overflow results."
            );
          } catch (err) {
            vscode.window.showErrorMessage(" Error parsing Stack Overflow response.");
            console.error("Raw Response:", data);
            console.error(err);
          }
        });
      }).on("error", (err) => {
        vscode.window.showErrorMessage(" HTTPS request failed.");
        console.error(err);
      });
    }
  );

  context.subscriptions.push(showWebviewCommand, stackOverflowCommand);
}

function getWebviewContent(panel) {
  const bundlePath = vscode.Uri.file(path.join(__dirname, "dist", "bundle.js"));
  const bundleUri = panel.webview.asWebviewUri(bundlePath);
  const nonce = getNonce();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src data: https:; connect-src *;">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React Webview</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        #root {
          height: 100vh;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${bundleUri}"></script>
    </body>
    </html>
  `;
}

function getNonce() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 32 }, () =>
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join("");
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};