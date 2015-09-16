function toggleSidebar() {
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
  }
}
