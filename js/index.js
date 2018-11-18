 function lunytha(){

	var app = document.getElementById("app");
	app.style.height = screen.height + "px";

	var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);

      var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems);

}
document.addEventListener('DOMContentLoaded',lunytha)
