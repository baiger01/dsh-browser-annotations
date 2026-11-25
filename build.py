from pathlib import Path
from textwrap import indent
import json

root = Path(__file__).parent
src = root / 'src'
body = 'const React = require("react")\nconst { formatQuoteText } = require("@deepseek-ai/dsh-client-ui-primitives")\n'
body += 'const styles = ' + json.dumps((src / 'ui.css').read_text('utf-8'), ensure_ascii=False) + '\n\n'
for name in ['attachments', 'cards', 'hit-test', 'panel', 'activation']:
    body += (src / (name + '.js')).read_text('utf-8') + '\n'
body += "return { inject: ['slots', 'sessions', 'conversation'], apply }\n"
bundle = 'window.__ModuleLoader__.load({\n  id: "dsh-browser-annotations",\n  factory(require) {\n'
bundle += indent(body, '    ') + '  }\n})\n'
(root / 'lib/client.js').write_text(bundle, encoding='utf-8')

