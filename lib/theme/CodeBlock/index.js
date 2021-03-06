"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CodeBlock;

var _react = _interopRequireWildcard(require("react"));

var _clsx = _interopRequireDefault(require("clsx"));

var _prismReactRenderer = _interopRequireWildcard(require("prism-react-renderer"));

var _copyTextToClipboard = _interopRequireDefault(require("copy-text-to-clipboard"));

var _parseNumericRange = _interopRequireDefault(require("parse-numeric-range"));

var _usePrismTheme = _interopRequireDefault(require("@theme/hooks/usePrismTheme"));

var _Translate = _interopRequireWildcard(require("@docusaurus/Translate"));

var _stylesModule = _interopRequireDefault(require("./styles.module.css"));

var _themeCommon = require("@docusaurus/theme-common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const highlightLinesRangeRegex = /{([\d,-]+)}/;

const getHighlightDirectiveRegex = (languages = ['js', 'jsBlock', 'jsx', 'python', 'html']) => {
  // supported types of comments
  const comments = {
    js: {
      start: '\\/\\/',
      end: ''
    },
    jsBlock: {
      start: '\\/\\*',
      end: '\\*\\/'
    },
    jsx: {
      start: '\\{\\s*\\/\\*',
      end: '\\*\\/\\s*\\}'
    },
    python: {
      start: '#',
      end: ''
    },
    html: {
      start: '<!--',
      end: '-->'
    }
  }; // supported directives

  const directives = ['highlight-next-line', 'highlight-start', 'highlight-end'].join('|'); // to be more reliable, the opening and closing comment must match

  const commentPattern = languages.map(lang => `(?:${comments[lang].start}\\s*(${directives})\\s*${comments[lang].end})`).join('|'); // white space is allowed, but otherwise it should be on it's own line

  return new RegExp(`^\\s*(?:${commentPattern})\\s*$`);
}; // select comment styles based on language


const highlightDirectiveRegex = lang => {
  switch (lang) {
    case 'js':
    case 'javascript':
    case 'ts':
    case 'typescript':
      return getHighlightDirectiveRegex(['js', 'jsBlock']);

    case 'jsx':
    case 'tsx':
      return getHighlightDirectiveRegex(['js', 'jsBlock', 'jsx']);

    case 'html':
      return getHighlightDirectiveRegex(['js', 'jsBlock', 'html']);

    case 'python':
    case 'py':
      return getHighlightDirectiveRegex(['python']);

    default:
      // all comment types
      return getHighlightDirectiveRegex();
  }
};

function CodeBlock({
  children,
  className: languageClassName,
  metastring,
  title
}) {
  const {
    prism
  } = (0, _themeCommon.useThemeConfig)();
  const [showCopied, setShowCopied] = (0, _react.useState)(false);
  const [mounted, setMounted] = (0, _react.useState)(false); // The Prism theme on SSR is always the default theme but the site theme
  // can be in a different mode. React hydration doesn't update DOM styles
  // that come from SSR. Hence force a re-render after mounting to apply the
  // current relevant styles. There will be a flash seen of the original
  // styles seen using this current approach but that's probably ok. Fixing
  // the flash will require changing the theming approach and is not worth it
  // at this point.

  (0, _react.useEffect)(() => {
    setMounted(true);
  }, []); // TODO: the title is provided by MDX as props automatically
  // so we probably don't need to parse the metastring
  // (note: title="xyz" => title prop still has the quotes)

  const codeBlockTitle = (0, _themeCommon.parseCodeBlockTitle)(metastring) || title;
  const button = (0, _react.useRef)(null);
  let highlightLines = [];
  const prismTheme = (0, _usePrismTheme.default)(); // In case interleaved Markdown (e.g. when using CodeBlock as standalone component).

  const content = Array.isArray(children) ? children.join('') : children;

  if (metastring && highlightLinesRangeRegex.test(metastring)) {
    // Tested above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const highlightLinesRange = metastring.match(highlightLinesRangeRegex)[1];
    highlightLines = (0, _parseNumericRange.default)(highlightLinesRange).filter(n => n > 0);
  }

  let language = languageClassName && // Force Prism's language union type to `any` because it does not contain all available languages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  languageClassName.replace(/language-/, '');

  if (!language && prism.defaultLanguage) {
    language = prism.defaultLanguage;
  } // only declaration OR directive highlight can be used for a block


  let code = content.replace(/\n$/, '');

  if (highlightLines.length === 0 && language !== undefined) {
    let range = '';
    const directiveRegex = highlightDirectiveRegex(language); // go through line by line

    const lines = content.replace(/\n$/, '').split('\n');
    let blockStart; // loop through lines

    for (let index = 0; index < lines.length;) {
      const line = lines[index]; // adjust for 0-index

      const lineNumber = index + 1;
      const match = line.match(directiveRegex);

      if (match !== null) {
        const directive = match.slice(1).reduce((final, item) => final || item, undefined);

        switch (directive) {
          case 'highlight-next-line':
            range += `${lineNumber},`;
            break;

          case 'highlight-start':
            blockStart = lineNumber;
            break;

          case 'highlight-end':
            range += `${blockStart}-${lineNumber - 1},`;
            break;

          default:
            break;
        }

        lines.splice(index, 1);
      } else {
        // lines without directives are unchanged
        index += 1;
      }
    }

    highlightLines = (0, _parseNumericRange.default)(range);
    code = lines.join('\n');
  }

  const handleCopyCode = () => {
    (0, _copyTextToClipboard.default)(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return <_prismReactRenderer.default {..._prismReactRenderer.defaultProps} key={String(mounted)} theme={prismTheme} code={code} language={language}>
      {({
      className,
      style,
      tokens,
      getLineProps,
      getTokenProps
    }) => <div className={_stylesModule.default.codeBlockContainer}>
          {codeBlockTitle && <div style={style} className={_stylesModule.default.codeBlockTitle}>
              {codeBlockTitle}
            </div>}
          <div className={(0, _clsx.default)(_stylesModule.default.codeBlockContent, language)}>
            <pre
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
        tabIndex={0} className={(0, _clsx.default)(className, _stylesModule.default.codeBlock, 'thin-scrollbar', {
          [_stylesModule.default.codeBlockWithTitle]: codeBlockTitle
        })} style={style}>
              <code className={_stylesModule.default.codeBlockLines}>
                {tokens.map((line, i) => {
              if (line.length === 1 && line[0].content === '') {
                line[0].content = '\n'; // eslint-disable-line no-param-reassign
              }

              const lineProps = getLineProps({
                line,
                key: i
              });

              if (highlightLines.includes(i + 1)) {
                lineProps.className += ' docusaurus-highlight-code-line';
              }

              return <span key={i} {...lineProps}>
                      {line.map((token, key) => <span key={key} {...getTokenProps({
                  token,
                  key
                })} />)}
                    </span>;
            })}
              </code>
            </pre>

            <button ref={button} type="button" aria-label={(0, _Translate.translate)({
          id: 'theme.CodeBlock.copyButtonAriaLabel',
          message: 'Copy code to clipboard',
          description: 'The ARIA label for copy code blocks button'
        })} className={(0, _clsx.default)(_stylesModule.default.copyButton, 'clean-btn')} onClick={handleCopyCode}>
              {showCopied ? <_Translate.default id="theme.CodeBlock.copied" description="The copied button label on code blocks">
                  Copied
                </_Translate.default> : <_Translate.default id="theme.CodeBlock.copy" description="The copy button label on code blocks">
                  Copy
                </_Translate.default>}
            </button>
          </div>
        </div>}
    </_prismReactRenderer.default>;
}