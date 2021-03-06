import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { advancedSort } from 'app/utils/advancedSort';

import { isClient } from '../../utils';
import PDFJS from '../PDFJS';
import PDFPage from './PDFPage.js';

class PDF extends Component {
  constructor(props) {
    super(props);
    this.state = { pdf: { numPages: 0 } };
    this.pagesLoaded = {};
    if (isClient) {
      PDFJS.getDocument(props.file).then((pdf) => {
        this.setState({ pdf });
      });
    }

    this.currentPage = '1';
    this.pages = {};
    this.pdfReady = false;

    this.pageUnloaded = this.pageUnloaded.bind(this);
    this.pageLoading = this.pageLoading.bind(this);
    this.onPageVisible = this.onPageVisible.bind(this);
    this.onPageHidden = this.onPageHidden.bind(this);
  }

  componentDidMount() {
    if (this.pdfContainer) {
      this.pdfContainer.addEventListener('textlayerrendered', (e) => {
        this.pageLoaded(e.detail.pageNumber);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.filename !== null && this.props.filename !== nextProps.filename) {
      this.pagesLoaded = {};
      this.setState({ pdf: { numPages: 0 } }, () => {
        PDFJS.getDocument(nextProps.file).then((pdf) => {
          this.setState({ pdf });
        });
      });
    }
  }

  onPageVisible(page, visibility) {
    this.pages[page] = visibility;

    const pageWithMostVisibility = Object.keys(this.pages).reduce((memo, key) => {
      if (!this.pages[key - 1] || this.pages[key] > this.pages[key - 1]) {
        return key;
      }
      return memo;
    }, 1);

    if (this.currentPage !== pageWithMostVisibility) {
      this.currentPage = pageWithMostVisibility;
      this.props.onPageChange(Number(pageWithMostVisibility));
    }
  }

  onPageHidden(page) {
    delete this.pages[page];
  }

  pageUnloaded(numPage) {
    delete this.pagesLoaded[numPage];
    this.loaded();
  }

  pageLoading(numPage) {
    this.pagesLoaded[numPage] = false;
  }

  pageLoaded(numPage) {
    this.pagesLoaded[numPage] = true;
    const allPagesLoaded = Object.keys(this.pagesLoaded).map(p => this.pagesLoaded[p]).filter(p => !p).length === 0;
    if (allPagesLoaded) {
      this.loaded();
    }
  }

  componentDidUpdate() {
    if (this.state.pdf.numPages && !this.pdfReady) {
      this.pdfReady = true;
      this.props.onPDFReady();
    }
  }

  loaded() {
    const pages = Object.keys(this.pagesLoaded).map(n => parseInt(n, 10));

    const allConsecutives = advancedSort(pages, { treatAs: 'number' }).reduce((memo, number) => {
      if (memo === false) {
        return memo;
      }

      if (memo === null) {
        return number;
      }

      return number - memo > 1 ? false : number;
    }, null);

    if (allConsecutives) {
      const start = this.props.pdfInfo[Math.min.apply(null, Object.keys(this.pagesLoaded).map(n => parseInt(n, 10))) - 1] || { chars: 0 };
      const end = this.props.pdfInfo[Math.max.apply(null, Object.keys(this.pagesLoaded).map(n => parseInt(n, 10)))] || { chars: 0 };
      this.props.onLoad({
        start: start.chars,
        end: end.chars,
        pages
      });
    }
  }

  render() {
    return (
      <div ref={(ref) => { this.pdfContainer = ref; }} style={this.props.style}>
        {(() => {
          const pages = [];
          for (let page = 1; page <= this.state.pdf.numPages; page += 1) {
            pages.push(<PDFPage
              onUnload={this.pageUnloaded}
              onLoading={this.pageLoading}
              onVisible={this.onPageVisible}
              onHidden={this.onPageHidden}
              key={page}
              page={page}
              pdf={this.state.pdf}
            />);
          }
          return pages;
        })()}
      </div>
    );
  }
}

PDF.defaultProps = {
  filename: null,
  onPageChange: () => {},
  onPDFReady: () => {},
  style: {},
};

PDF.propTypes = {
  onPageChange: PropTypes.func,
  onPDFReady: PropTypes.func,
  file: PropTypes.string.isRequired,
  filename: PropTypes.string,
  onLoad: PropTypes.func.isRequired,
  pdfInfo: PropTypes.object,
  style: PropTypes.object,
};

export default PDF;
