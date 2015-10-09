function toggleSidebar(url) {
  var sidebar = $('#sm-sidebar');
  if (sidebar.length > 0) {
    sidebar.remove();
  } else {
    var body = $('body');
    var sidebar_file = chrome.extension.getURL('html/sidebar.html');
    $.get(sidebar_file, function(data) {
      body.append(data);
      $('#sm-sidebar').show();
    });
    var scraper = {
      "url": "",
      "elements": {
        "journal_name": {
          "selector": "",
          "attribute": "text"
        },
        "journal_issn": {
          "selector": "",
          "attribute": "content"
        },
        "title": {
          "selector": "",
          "attribute": "content"
        },
        "keywords": {
          "selector": "",
          "attribute": "content"
        },
        "author_name": {
          "selector": "",
          "attribute": "content"
        },
        "date_published": {
          "selector": "",
          "attribute": "text",
        },
        "doi": {
          "selector": "",
          "attribute": "content"
        },
        "volume": {
          "selector": "",
          "attribute": "content"
        },
        "issue": {
          "selector": "",
          "attribute": "content"
        },
        "abstract": {
          "selector": "",
          "attribute": "content"
        },
        "fulltext_html": {
          "selector": "",
          "attribute": "href",
          "download": {
            "rename": "fulltext.html"
          }
        },
        "fulltext_pdf": {
          "selector": "",
          "attribute": "href",
          "download": {
            "rename": "fulltext.pdf"
          }
        },
        "fulltext_xml": {
          "selector": "",
          "attribute": "href",
          "download": {
            "rename": "fulltext.xml"
          }
        },
        "supplementary_file": {
          "selector": "",
          "download": true
        },
        "figures_image": {
          "selector": "",
          "attribute": "href"
        },
        "license": {
          "selector": "",
          "attribute": "text"
        },
        "copyright": {
          "selector": "",
          "attribute": "text"
        }
      }
    }
    loadData(url, scraper);
  }
}

/**
 * @param {string} url - URL for the current site.
 * @param {function(string)} callback - Called when URL for current site has
     been determined. The callback gets the URL.
 * @param {function(string)} errorCallback - Called when the url is not valid.
 *   The callback gets a string that describes the failure reason.
 */
function   getSubdomainAndDomain(url, callback, errorCallback) {
  if (!tldjs.isValid(url)) {
    errorCallback('Not a valid host string - cannot determine domain!');
  return;
  }

  var subdomain = tldjs.getSubdomain(url);
  var domain = tldjs.getDomain(url);

  var subdomainAndDomain = subdomain + '.' + domain

  console.assert(
      typeof subdomainAndDomain == 'string',
      'Unexpected behaviour of tld.js getDomain or getSubdomain!');
  callback(subdomainAndDomain);
};

function renderStatus(statusText) {
  console.log(statusText);
}

function loadData(url, scraper) {
  renderStatus('Determining subdomain and domain for ' + url);

    getSubdomainAndDomain(url, function(subdomainAndDomain) {

    scraper.url = subdomainAndDomain;

    renderStatus('URL: ' + url + '\n' +
        'Subdomain and domain: ' + subdomainAndDomain + '\n' +
        'Scraper url: ' + scraper.url);

  }, function(errorMessage) {
    renderStatus('Cannot display subdomain and domain. ' + errorMessage);
  });
}
