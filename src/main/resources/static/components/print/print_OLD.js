var competenciesList = [];

function openObjPDF() {
	getCompetenciesData();
	pdfMake.createPdf(objPDF).open();
}

function getCompetenciesData(){
	competenciesList = [];
	$.ajax({
    url: 'http://'+getEnvironment()+':8080/getCompetencies/'+"675590",
    cache: false,
    method: 'GET',
    xhrFields: {'withCredentials': true},
    success: function(data){
        $.each(data, function(key, val){
        	
        	competenciesList.push(val.title);
        	});
     },
     error: function(XMLHttpRequest, textStatus, errorThrown){
         console.log('error', errorThrown);
         toastr.error("Sorry, there was a problem getting Objectives data, please try again later.")
     }
 })};
 
 var compTest = ["First Line 1" , "First Line 2" , "First Line 3" , "First Line 4", "Second Line 1" , "Second Line 2" , "Second Line 3" , "Second Line 4"];

function addCompetency(i) {
	var comp = '• ' + compTest[i];
return	comp;
}

function buildTableBody(a,b) {
    var body = [];
    var dataRow = [];
    for (var i = a ; i <= b ; i ++){
	   dataRow.push(addCompetency(i));
    }
    body.push(dataRow);
    return body;
}

function singleLineTable() {
    return {
        table: {     	
        	widths: [130, 130, 130, 130],
            body: buildTableBody(0,compTest.length-1)
        },
	    layout: {
			defaultBorder: false,
		},
		style: 'competencies'
		}
}

function twoLinesTable() {
    return([
	    {
	        table: {     	
	        	widths: [130, 130, 130, 130],
	            body: buildTableBody(0,3)
	        },
		    layout: {
				defaultBorder: false},
			style: 'competencies'
	    },
	    {
		    table: {     	
		    	widths: [130, 130, 130, 130],
		        body: buildTableBody(4,compTest.length-1)
		    },
		    layout: {
				defaultBorder: false},
			style: 'competencies'
		}
    ]);
}

function competenciesTable(){
	if (compTest.length<=4){
		return singleLineTable();
	}
	else {
		return twoLinesTable();
		}
}

var objPDF = {
    content: [
    	{
            table: {
            		widths: ['*'],
                    headerRows: 1,
                    // keepWithHeaderRows: 1,
                    dontBreakRows: true,
                    body: [
                            [{ 
                            	text: 'MyCareer', 
                                style: 'header'  },
                                ],
                    ]
            },
            layout: {
            	defaultBorder: false,
				fillColor: '#da202c'
			},
    	},
    	
        {	text: '\n\n'},
        {
			text: 'Competencies',
			style: 'subheader'
		},
		{	text: '\n'},
    	
		competenciesTable(),

		{	text: '\n\n'},
        {
			text: 'My Objectives',
			style: 'subheader'
		},
		{	text: '\n'},
		
    ],
    styles: {
        header: {
            fontSize: 14,
            color : "white",
        },
		subheader: {
		    fontSize: 20,
		},
        competencies: {
		    fontSize: 9.5,
		}
    }
}