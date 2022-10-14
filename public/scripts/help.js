$( function () {
	$( ".icon_div" ).click( function () {
		$( "#project_display" ).attr( "src", $( this ).attr( "value" ) );
	} );
} );
