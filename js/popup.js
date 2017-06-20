(function($) {
	if (typeof($.fn.lc_switch) != 'undefined') {
		return false;
	} // prevent dmultiple scripts inits

	$.fn.lc_switch = function(on_text, off_text) {

		// destruct
		$.fn.lcs_destroy = function() {

			$(this).each(function() {
				var $wrap = $(this).parents('.lcs_wrap');

				$wrap.children().not('input').remove();
				$(this).unwrap();
			});

			return true;
		};


		// set to ON
		$.fn.lcs_on = function() {

			$(this).each(function() {
				var $wrap = $(this).parents('.lcs_wrap');
				var $input = $wrap.find('input');

				if (typeof($.fn.prop) == 'function') {
					$wrap.find('input').prop('checked', true);
				} else {
					$wrap.find('input').attr('checked', true);
				}

				$wrap.find('input').trigger('lcs-on');
				$wrap.find('input').trigger('lcs-statuschange');
				$wrap.find('.lcs_switch').removeClass('lcs_off').addClass('lcs_on');

				// if radio - disable other ones 
				if ($wrap.find('.lcs_switch').hasClass('lcs_radio_switch')) {
					var f_name = $input.attr('name');
					$wrap.parents('form').find('input[name=' + f_name + ']').not($input).lcs_off();
				}
			});

			return true;
		};

		// set to OFF
		$.fn.lcs_off = function() {

			$(this).each(function() {
				var $wrap = $(this).parents('.lcs_wrap');

				if (typeof($.fn.prop) == 'function') {
					$wrap.find('input').prop('checked', false);
				} else {
					$wrap.find('input').attr('checked', false);
				}

				$wrap.find('input').trigger('lcs-off');
				$wrap.find('input').trigger('lcs-statuschange');
				$wrap.find('.lcs_switch').removeClass('lcs_on').addClass('lcs_off');
			});

			return true;
		};


		// construct
		return this.each(function() {

			// check against double init
			if (!$(this).parent().hasClass('lcs_wrap')) {

				// default texts
				var ckd_on_txt = (typeof(on_text) == 'undefined') ? 'ON' : on_text;
				var ckd_off_txt = (typeof(off_text) == 'undefined') ? 'OFF' : off_text;

				// labels structure
				var on_label = (ckd_on_txt) ? '<div class="lcs_label lcs_label_on">' + ckd_on_txt + '</div>' : '';
				var off_label = (ckd_off_txt) ? '<div class="lcs_label lcs_label_off">' + ckd_off_txt + '</div>' : '';


				// default states
				var disabled = ($(this).is(':disabled')) ? true : false;
				var active = ($(this).is(':checked')) ? true : false;

				var status_classes = '';
				status_classes += (active) ? ' lcs_on' : ' lcs_off';
				if (disabled) {
					status_classes += ' lcs_disabled';
				}


				// wrap and append
				var structure =
					'<div class="lcs_switch ' + status_classes + '">' +
					'<div class="lcs_cursor"></div>' +
					on_label + off_label +
					'</div>';

				if ($(this).is(':input') && ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio')) {

					$(this).wrap('<div class="lcs_wrap"></div>');
					$(this).parent().append(structure);

					$(this).parent().find('.lcs_switch').addClass('lcs_' + $(this).attr('type') + '_switch');
				}
			}
		});
	};
	// handlers
	$(document).ready(function() {
		// on click
		$(document).delegate('.lcs_switch:not(.lcs_disabled)', 'click tap', function(e) {

			if ($(this).hasClass('lcs_on')) {
				if (!$(this).hasClass('lcs_radio_switch')) { // not for radio
					$(this).lcs_off();
				}
			} else {
				$(this).lcs_on();
			}
		});
		// on checkbox status change
		$(document).delegate('.lcs_wrap input', 'change', function() {

			if ($(this).is(':checked')) {
				$(this).lcs_on();
			} else {
				$(this).lcs_off();
			}
		});

	});

})(jQuery);
if (window.localStorage.hiddenPlugin) {
	$("#hiddenPlugin").attr("checked", window.localStorage.hiddenPlugin == "true" ? true : false);
}
else{
	window.localStorage.hiddenPlugin = false;
}
//点击
$("#hiddenPlugin").change(function() {
	if ($(this).is(':checked')) {
		window.localStorage.hiddenPlugin = true;
	} else {
		window.localStorage.hiddenPlugin = false;
	}
});

$("#applyReason").val(window.localStorage.applyReason);
$("#applyReason").on('keyup paste', function() {
	if ($(this).val()){
		window.localStorage.applyReason = $(this).val();
	}
});

$("#keyPlugin").val(String.fromCharCode(window.localStorage.keyPlugin));
$("#keyTrend").val(String.fromCharCode(window.localStorage.keyTrend));
$("#keyTaoke").val(String.fromCharCode(window.localStorage.keyTaoke));
$("#keyQueqiao").val(String.fromCharCode(window.localStorage.keyQueqiao));
$("#keyLogin").val(String.fromCharCode(window.localStorage.keyLogin));
$("input").on('keyup paste', function(event) {
	var id = $(this).attr('data-id');
	var keyCode = event.keyCode;
	var patrn=/^[a-zA-Z]+$/; 
	if (!patrn.test($(this).val())){
		$(this).val('');
		return false;
	}else{
		if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)){
			if (id=='1'){
				window.localStorage.keyPlugin = keyCode;
			}else if (id=='2'){
				window.localStorage.keyLogin = keyCode;
			}else if (id=='3'){
				window.localStorage.keyTrend = keyCode;
			}else if (id=='4'){
				window.localStorage.keyTaoke = keyCode;
			}else if (id=='5'){
				window.localStorage.keyQueqiao = keyCode;
			}
		}
	}
});
$("textarea,input").focus(function() {
	$(this).css('background','#FFF');
});
$("textarea,input").blur(function() {
	$(this).css('background','#F4F4F4');
});