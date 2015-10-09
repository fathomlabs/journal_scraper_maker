# Journal scraper maker log

### Background

When developing scraping software, a major challenge is ensuring its compatibility across a wide range of resources. Building a general tool to scrape a variety of sources - each with a different layout and range of information - is labour intensive, and adding an additional source to scrape can require a complete rework of the entire code. Furthermore, as pages are modified, over time scraping software can quickly become outdated unless considerable effort is invested in maintenance. In practice this means that scraping tools can be restricted to only a small selection of sources, and can have a complex code base which hinders collaborative work. [quickscrape](https://github.com/ContentMine/quickscrape) has been designed to more efficiently enable large scale content mining. It is a simple command-line tool which runs using source-specific scrapers, which can be created and maintained collaboratively.

### Approach

```scrapermaker``` is a tool that enables non-coders to define scrapers, with the goal of creating a community-led scraper [collection](https://github.com/ContentMine/journal-scrapers). Scrapers are defined by JSON files in a standard format ([scraperJSON](https://github.com/ContentMine/scraperJSON)) described below. ```scrapermaker``` will automatically generate a scraperJSON for a chosen website (eg. newspaper or academic journal) by taking the user through a series of questions based on what they see on their screen when they visit the site.

The scraperJSON format can have two root keys, they are:

1. url - a **string**-form [regular expression](http://rubular.com/) specifying which URL(s) this scraper targets (eg. "plos.*\\.org")
2. elements - a **dictionary** (key, value pairs) of elements to scrape
  - 2.1 Element keys should be a **string** description of the element, this can be anything the user wishes to scrape, eg. "fulltext_pdf"
  - 2.2 The element value is a **dictionary** of specifiers defining the element and its processing. Allowed keys in the specifier dictionary are:
    - 2.2.1 *selector* - an XPath selector targeting the element to be selected.
    - 2.2.2 *attribute* - a string specifying the attribute to extract from the selected element. Optional (omitting this key is equivalent to giving it a value of text).

  In addition to html attributes there are two special attributes allowed:
    -
      - 2.2.3 *text* - extracts any plaintext inside the selected element
      - 2.2.4 *html* - extracts the inner HTML of the selected element
      - 2.2.5 *download* - if present and has a truthy value (true or an Object) the element is treated as a URL to a resource and is downloaded. Optional (omitting this key is equivalent to giving it a value of false). If the value is an object, the following keys are allowed:
        - 2.2.5.1 *rename* - a string specifying the filename to which the downloaded file will be renamed.
        - 2.2.5.2 *regex* - an Object specifying a regular expression whose groups should be captured as the results. The results will be an array of the captured groups. If the global flag (g) is specified, the result will be an array of arrays of captured groups. There are two keys allowed:
          - 2.2.5.2.1 *source* - a string specifying the regular expression to be executed. Required
          - 2.2.5.2.2 *flags* - an array specifying the regex flags to be used (g, m, i, etc.). Optional (omitting this key will cause the regex to be executed with no flags).

```scrapermaker``` will be a Chrome Extension

## Notes on Chrome Extensions

- browser action - button in toolbar that can be used on any website (or maybe in prototype, could be page action that only appears for publishers' websites (or websites that contain some particular xpath, say title or author))


- will probably need a side bar javascript file and html file

- will also need cm branding file(s): logo, template scraperJSON?

- If you upload your extension using the Chrome Developer Dashboard, the .crx file is created for you from the single directory

- If an extension needs to interact with web pages that the user loads (as opposed to pages that are included in the extension), then the extension must use a content script.

- There are two types of background pages: persistent background pages, and event pages. Persistent background pages, as the name suggests, are always open. Event pages are opened and closed as needed. Unless you absolutely need your background page to run all the time, prefer to use an event page.

- To find pages in the extension, use chrome.extension methods such as getViews() and getBackgroundPage()

- You need to consider what a user expects from your extension when the browser is incognito.
  - Rule of thumb: If a piece of data might show where a user has been on the web or what the user has done, don't store it if it's from an incognito window.
  - To detect whether a window is in incognito mode, check the incognito property of the relevant tabs.Tab or windows.Window object.

  ## Some resources

  - [Chrome Extensions FAQ](https://developer.chrome.com/extensions/faq)
  - [Chromium Extensions Google Group](https://groups.google.com/a/chromium.org/forum/#!forum/chromium-extensions)
  - [Chromium blog](http://blog.chromium.org/)
  - [Extensions youtube videos](https://www.youtube.com/view_play_list?p=CA101D6A85FE9D4B)
  - [Sample Extensions](https://developer.chrome.com/extensions/samples#search:)
  - [Extensions devguide](https://developer.chrome.com/extensions/devguide)
  - [Chrome.*APIs](https://developer.chrome.com/extensions/api_index)
  - [Extension debugging tutorial](https://developer.chrome.com/extensions/tut_debugging)
  - [Extensions quality guidelines](https://developer.chrome.com/extensions/single_purpose)


  ## General code plan

  - model manifest file on examples from issue #2 on github
  - [background page](https://developer.chrome.com/extensions/background_pages) for underlying code
  - [event page](https://developer.chrome.com/extensions/event_pages) for tips straight after installation or updates
  - first task is to get the url for first field of scraperJSON
    - getCurrentTabUrl function from chrome-extension example tutorial
    - next need to get domain (and possibly also subdomain) for scraperJSON
      - relevant stack overflow answers [here](http://stackoverflow.com/questions/569137/how-to-get-domain-name-from-url)
      - list of tld names from mozilla [here](https://publicsuffix.org/list/effective_tld_names.dat)
      - guidelines on list (called publicsuffix list) [here](https://publicsuffix.org/learn/)
      - javascript utility for publicsuffix list [here](https://github.com/gorhill/publicsuffixlist.js)
      - tld.js for getting domain and subdomain [here](https://github.com/oncletom/tld.js) - I will use this one
  - next task is to create a JSON (scraperJSON) and save it to the users machine (or give the option of saving it)
