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
    loadData(url);
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

function loadData(url) {
  renderStatus('Determining subdomain and domain for ' + url);

    getSubdomainAndDomain(url, function(subdomainAndDomain) {

    renderStatus('URL: ' + url + '\n' +
        'Subdomain and domain: ' + subdomainAndDomain);

  }, function(errorMessage) {
    renderStatus('Cannot display subdomain and domain. ' + errorMessage);
  });
}
