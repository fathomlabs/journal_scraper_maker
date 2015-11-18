function toggleSidebar(url) {
  var sidebar = $('#sm-sidebar');
  if (sidebar.length > 0) {
    sidebar.remove();
  } else {
    var body = $('body');
    var sidebar_file = chrome.extension.getURL('html/sidebar.html');
    $.get(sidebar_file, buildSidebar);
    var scraper = {
      url: "",
      elements: {
        "journal_name": {
          selector: "",
          attribute: "text"
        },
        journal_issn: {
          selector: "",
          attribute: "content"
        },
        title: {
          selector: "",
          attribute: "content"
        },
        keywords: {
          selector: "",
          attribute: "content"
        },
        author_name: {
          selector: "",
          attribute: "content"
        },
        date_published: {
          selector: "",
          attribute: "text",
        },
        doi: {
          selector: "",
          attribute: "content"
        },
        volume: {
          selector: "",
          attribute: "content"
        },
        issue: {
          selector: "",
          attribute: "content"
        },
        abstract: {
          selector: "",
          attribute: "content"
        },
        fulltext_html: {
          selector: "",
          attribute: "href",
          download: {
            rename: "fulltext.html"
          }
        },
        fulltext_pdf: {
          selector: "",
          attribute: "href",
          download: {
            rename: "fulltext.pdf"
          }
        },
        fulltext_xml: {
          selector: "",
          attribute: "href",
          download: {
            rename: "fulltext.xml"
          }
        },
        supplementary_file: {
          selector: "",
          download: true
        },
        figures_image: {
          selector: "",
          attribute: "href"
        },
        license: {
          selector: "",
          attribute: "text"
        },
        copyright: {
          selector: "",
          attribute: "text"
        }
      }
    }
    loadData(url, scraper);
  }
}

function buildSidebar(data) {
  body.append(data);
  var startingtext = "Welcome to ScraperMaker! Click on an element below to add to the scraper for this page."
  $('#activeboxtext').text(startingtext);

  // Loop through all scraper elements, give message to user, wait for click, then update scraper and move to the next element
  for (elt in scraper.elements) {
    $('#elementschecklist').append('<button name="' + elt + '" id="' + elt + '">' + elt + '</button>');
    console.log(elt);

    var buttonname = '#' + elt;
    $(buttonname).click(function() {



      // update active box text
      $('#activeboxtext').text("click on the " + elt + " to add it to the scraper")

      // get xpath from user click
      $("#test").click(function() {
        var thisxpath = getXPath(this);

        // check that xpath looks right (with ok button)
        $('#activeboxtext').text("using XPath: " + thisxpath + ", is this ok?");
        $('#activeboxtext').append('<button name="checkok" "ok?" </button>');

        // update scraper with user input
        $(checkok).click(function() {
          scraper.elt.selector = thisxpath;
        });
      });

    });
  }

  $('#sm-sidebar').show();
}

function getXPath(element) {
  var val = element.value;
  var xpath = '';
  for ( ; element && element.nodeType == 1; element.parentNode) {
    var id = $(element.parentNode).children(element.tagName).index(element)+1;
    id > 1 ? (id = '[' + id + ']') : (id = '');
    xpath = '/' + element.tagName.toLowerCase() + id + xpath;
  }
  return xpath
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
