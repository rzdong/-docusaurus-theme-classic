"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _DocPaginator = _interopRequireDefault(require("@theme/DocPaginator"));

var _DocVersionBanner = _interopRequireDefault(require("@theme/DocVersionBanner"));

var _Seo = _interopRequireDefault(require("@theme/Seo"));

var _LastUpdated = _interopRequireDefault(require("@theme/LastUpdated"));

var _TOC = _interopRequireDefault(require("@theme/TOC"));

var _EditThisPage = _interopRequireDefault(require("@theme/EditThisPage"));

var _Heading = require("@theme/Heading");

var _clsx = _interopRequireDefault(require("clsx"));

var _stylesModule = _interopRequireDefault(require("./styles.module.css"));

var _useDocs = require("@theme/hooks/useDocs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function DocItem(props) {
  const {
    content: DocContent,
    versionMetadata
  } = props;
  const {
    metadata,
    frontMatter
  } = DocContent;
  const {
    image,
    keywords,
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents
  } = frontMatter;
  const {
    description,
    title,
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy
  } = metadata;
  const {
    pluginId
  } = (0, _useDocs.useActivePlugin)({
    failfast: true
  });
  const versions = (0, _useDocs.useVersions)(pluginId); // If site is not versioned or only one version is included
  // we don't show the version badge
  // See https://github.com/facebook/docusaurus/issues/3362

  const showVersionBadge = versions.length > 1; // We only add a title if:
  // - user asks to hide it with frontmatter
  // - the markdown content does not already contain a top-level h1 heading

  const shouldAddTitle = !hideTitle && typeof DocContent.contentTitle === 'undefined';
  return <>
      <_Seo.default {...{
      title,
      description,
      keywords,
      image
    }} />

      <div className="row">
        <div className={(0, _clsx.default)('col', {
        [_stylesModule.default.docItemCol]: !hideTableOfContents
      })}>
          <_DocVersionBanner.default versionMetadata={versionMetadata} />
          <div className={_stylesModule.default.docItemContainer}>
            <article>
              {showVersionBadge && <span className="badge badge--secondary">
                  Version: {versionMetadata.label}
                </span>}

              <div className="markdown">
                {
                /*
                Title can be declared inside md content or declared through frontmatter and added manually
                To make both cases consistent, the added title is added under the same div.markdown block
                See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
                */
              }
                {shouldAddTitle && <_Heading.MainHeading>{title}</_Heading.MainHeading>}

                <DocContent />
              </div>

              {(editUrl || lastUpdatedAt || lastUpdatedBy) && <footer className="row docusaurus-mt-lg">
                  <div className="col">
                    {editUrl && <_EditThisPage.default editUrl={editUrl} />}
                  </div>

                  <div className={(0, _clsx.default)('col', _stylesModule.default.lastUpdated)}>
                    {(lastUpdatedAt || lastUpdatedBy) && <_LastUpdated.default lastUpdatedAt={lastUpdatedAt} formattedLastUpdatedAt={formattedLastUpdatedAt} lastUpdatedBy={lastUpdatedBy} />}
                  </div>
                </footer>}
            </article>

            <_DocPaginator.default metadata={metadata} />
          </div>
        </div>
        {!hideTableOfContents && DocContent.toc && <div className="col col--3">
            <_TOC.default toc={DocContent.toc} />
          </div>}
      </div>
    </>;
}

var _default = DocItem;
exports.default = _default;