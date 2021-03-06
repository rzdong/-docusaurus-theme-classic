"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@mdx-js/react");

var _useDocusaurusContext = _interopRequireDefault(require("@docusaurus/useDocusaurusContext"));

var _renderRoutes = _interopRequireDefault(require("@docusaurus/renderRoutes"));

var _Layout = _interopRequireDefault(require("@theme/Layout"));

var _DocSidebar = _interopRequireDefault(require("@theme/DocSidebar"));

var _MDXComponents = _interopRequireDefault(require("@theme/MDXComponents"));

var _NotFound = _interopRequireDefault(require("@theme/NotFound"));

var _IconArrow = _interopRequireDefault(require("@theme/IconArrow"));

var _router = require("@docusaurus/router");

var _Translate = require("@docusaurus/Translate");

var _clsx = _interopRequireDefault(require("clsx"));

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
function getSidebar({
  versionMetadata,
  currentDocRoute
}) {
  function addTrailingSlash(str) {
    return str.endsWith('/') ? str : `${str}/`;
  }

  function removeTrailingSlash(str) {
    return str.endsWith('/') ? str.slice(0, -1) : str;
  }

  const {
    permalinkToSidebar,
    docsSidebars
  } = versionMetadata; // With/without trailingSlash, we should always be able to get the appropriate sidebar
  // note: docs plugin permalinks currently never have trailing slashes
  // trailingSlash is handled globally at the framework level, not plugin level

  const sidebarName = permalinkToSidebar[currentDocRoute.path] || permalinkToSidebar[addTrailingSlash(currentDocRoute.path)] || permalinkToSidebar[removeTrailingSlash(currentDocRoute.path)];
  const sidebar = docsSidebars[sidebarName];
  return {
    sidebar,
    sidebarName
  };
}

function DocPageContent({
  currentDocRoute,
  versionMetadata,
  children
}) {
  var _siteConfig$themeConf, _siteConfig$themeConf2;

  const {
    siteConfig,
    isClient
  } = (0, _useDocusaurusContext.default)();
  const {
    pluginId,
    version
  } = versionMetadata;
  const {
    sidebarName,
    sidebar
  } = getSidebar({
    versionMetadata,
    currentDocRoute
  });
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = (0, _react.useState)(false);
  const [hiddenSidebar, setHiddenSidebar] = (0, _react.useState)(false);
  const toggleSidebar = (0, _react.useCallback)(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }

    setHiddenSidebarContainer(!hiddenSidebarContainer);
  }, [hiddenSidebar]);
  return <_Layout.default key={isClient} wrapperClassName={_themeCommon.ThemeClassNames.wrapper.docPages} pageClassName={_themeCommon.ThemeClassNames.page.docPage} searchMetadatas={{
    version,
    tag: (0, _themeCommon.docVersionSearchTag)(pluginId, version)
  }}>
      <div className={_stylesModule.default.docPage}>
        {sidebar && <aside className={(0, _clsx.default)(_stylesModule.default.docSidebarContainer, {
        [_stylesModule.default.docSidebarContainerHidden]: hiddenSidebarContainer
      })} onTransitionEnd={e => {
        if (!e.currentTarget.classList.contains(_stylesModule.default.docSidebarContainer)) {
          return;
        }

        if (hiddenSidebarContainer) {
          setHiddenSidebar(true);
        }
      }}>
            <_DocSidebar.default key={// Reset sidebar state on sidebar changes
        // See https://github.com/facebook/docusaurus/issues/3414
        sidebarName} sidebar={sidebar} path={currentDocRoute.path} sidebarCollapsible={(_siteConfig$themeConf = (_siteConfig$themeConf2 = siteConfig.themeConfig) === null || _siteConfig$themeConf2 === void 0 ? void 0 : _siteConfig$themeConf2.sidebarCollapsible) !== null && _siteConfig$themeConf !== void 0 ? _siteConfig$themeConf : true} onCollapse={toggleSidebar} isHidden={hiddenSidebar} />

            {hiddenSidebar && <div className={_stylesModule.default.collapsedDocSidebar} title={(0, _Translate.translate)({
          id: 'theme.docs.sidebar.expandButtonTitle',
          message: 'Expand sidebar',
          description: 'The ARIA label and title attribute for expand button of doc sidebar'
        })} aria-label={(0, _Translate.translate)({
          id: 'theme.docs.sidebar.expandButtonAriaLabel',
          message: 'Expand sidebar',
          description: 'The ARIA label and title attribute for expand button of doc sidebar'
        })} tabIndex={0} role="button" onKeyDown={toggleSidebar} onClick={toggleSidebar}>
                <_IconArrow.default className={_stylesModule.default.expandSidebarButtonIcon} />
              </div>}
          </aside>}
        <main className={(0, _clsx.default)(_stylesModule.default.docMainContainer, {
        [_stylesModule.default.docMainContainerEnhanced]: hiddenSidebarContainer || !sidebar
      })}>
          <div className={(0, _clsx.default)('container padding-top--md padding-bottom--lg', _stylesModule.default.docItemWrapper, {
          [_stylesModule.default.docItemWrapperEnhanced]: hiddenSidebarContainer
        })}>
            <_react2.MDXProvider components={_MDXComponents.default}>{children}</_react2.MDXProvider>
          </div>
        </main>
      </div>
    </_Layout.default>;
}

function DocPage(props) {
  const {
    route: {
      routes: docRoutes
    },
    versionMetadata,
    location
  } = props;
  const currentDocRoute = docRoutes.find(docRoute => (0, _router.matchPath)(location.pathname, docRoute));

  if (!currentDocRoute) {
    return <_NotFound.default {...props} />;
  }

  return <DocPageContent currentDocRoute={currentDocRoute} versionMetadata={versionMetadata}>
      {(0, _renderRoutes.default)(docRoutes, {
      versionMetadata
    })}
    </DocPageContent>;
}

var _default = DocPage;
exports.default = _default;