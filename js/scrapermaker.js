var smHTML = '<sm id="sm-sidebar"></sm>';

var $html = $('html');

$html.append(smHTML);

var $sidebar = $('#sm-sidebar');

function toggleSidebar() {
  $sidebar.toggle();
}
