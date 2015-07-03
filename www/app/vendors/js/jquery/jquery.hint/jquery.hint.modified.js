/**
* New version - feb, 11th 2013 
* @Autor: Felipe Lopes Lage - lipelopeslage.com.br
*
* Forked from: Remy Sharp - http://remysharp.com/2007/01/25/jquery-tutorial-text-box-hints/
*
*/

(function ($) {

$.fn.hint = function (blurClass) {
  if (!blurClass) { 
    blurClass = 'blur';
  }
    
  return this.each(function () {
    // get jQuery version of 'this'
    var $input = $(this),
    
    // capture the rest of the variable to allow for reuse
      title = $input.attr('title'),
      $form = $(this.form),
      $win = $(window),
      placeholder = Boolean('placeholder' in $input.get(0));/* ======> F O R K <=======*/

    function remove() {
      if ($input.val() === title && $input.hasClass(blurClass)) {
        $input.val('').removeClass(blurClass);
      }
    }
    
      // only apply logic if the element has the attribute
      if (title && !placeholder) {  /* ======> F O R K <=======*/
        // on blur, set value to title attr if text is blank
        $input.blur(function () {
          if (this.value === '') {
            $input.val(title).addClass(blurClass);
          }
        }).focus(remove).blur(); // now change all inputs to title
        
        // clear the pre-defined text when form is submitted
        //$form.submit(remove);
        $win.unload(remove); // handles Firefox's autocomplete
      }else{ /* ======> F O R K <=======*/
        $input.attr("placeholder",title).removeAttr("title");
      } /* ======> F O R K  <======*/
  });
};

})(jQuery);