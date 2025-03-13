var jobPostingListName = 'Job Posting';
var HTMLJobPostingDivID = 'currentOpenings';

$(document).ready(function(){
    getJobPosting();
});

function getJobPosting(){
    var jobPostingURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('"+jobPostingListName+"')/Items?select=*&$filter=isActive eq 1&$top=5000&$orderBy=Id desc";
    getItems(jobPostingURL,function(data){
        var jobPostingResults = data.d.results;
        if(jobPostingResults.length > 0){
            for(q=0;q<jobPostingResults.length;q++){
                var jobTitleRevised = jobPostingResults[q].Title.replace(/[^a-zA-Z ]/g, "");
                var trimmedJobTitle = jobTitleRevised.replace(/\s/g,'');
                var skillsOption = '';
                if(jobPostingResults[q].Skills != null){
                    var skillsArray = jobPostingResults[q].Skills.split(',');
                    for(r=0;r<skillsArray.length;r++){
                        skillsOption += '<li>'+skillsArray[r]+'</li>'; 
                    }
                }
                
                var HTMLToAppend = '<li>'+
                	'<div class="ds-widget-inner"><a href="javascript:;" data-toggle="modal" data-target="#modalCurrentOpenings" class="openCurrentOpening" data-id="'+jobPostingResults[q].Id+'">'+jobPostingResults[q].Title+'</a></div>'+
					'</li>';
                
                
                var HTMLToAppend1 = '<div class="card">'+
                    '<div class="card-header" id="'+trimmedJobTitle+'Heading">'+
                    '<h2 class="mb-0">'+
                        '<button type="button" class="d-flex align-items-center justify-content-between btn btn-link collapsed" data-toggle="collapse" data-target="#'+trimmedJobTitle+'Collapse" aria-expanded="false" aria-controls="'+trimmedJobTitle+'Collapse">'+jobPostingResults[q].Title+'<span class="fa-stack fa-sm">'+
                            '<i class="fa fa-plus fa-stack-1x"></i>'+
                        '</span>'+
                        '</button>'+
                    '</h2>'+
                    '</div>'+
                    '<div id="'+trimmedJobTitle+'Collapse" class="collapse" aria-labelledby="'+trimmedJobTitle+'Heading" data-parent="#accordion">'+
                    '<div class="card-body">'+
                        '<p>'+(jobPostingResults[q].Description == null ? '' : jobPostingResults[q].Description)+'</p>'+
                        '<h3 class="pt-3">Skills</h3>'+
                        '<ul class="list-unstyled d-flex flex-wrap mr-md-3">'+skillsOption+'</ul>'+
                        '<h3 class="pt-4">Requirments</h3>'+
                        '<div class="ds-req">'+
                        '<p><strong>Experience :  </strong> <span class="ml-2">'+(jobPostingResults[q].Experience == null ? '' : jobPostingResults[q].Experience)+'</span></p>'+
                        '<p><strong>Availability :  </strong> <span class="ml-2">'+(jobPostingResults[q].Availability == null ? '' : jobPostingResults[q].Availability)+'</span></p>'+
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>';
                $('#'+HTMLJobPostingDivID).last().append(HTMLToAppend);
                
            }
            $('.openCurrentOpening').click(function(){
                var currentOpeningId = parseInt($(this).attr("data-id"));
                if(currentOpeningId > 0){
                    $('#CurrentOpeningContentModal').html('');
                    getCurrentOpeningDetails(currentOpeningId);
                }
            });
            //$('#'+HTMLJobPostingDivID).on("hide.bs.collapse show.bs.collapse", e => {
            $('#' + HTMLJobPostingDivID).on("hide.bs.collapse show.bs.collapse", function (e) {
			  $(e.target)
			    .prev()
			    .find("i:last-child")
			    .toggleClass("fa-minus fa-plus");
			});
        }else{
            $('#'+HTMLJobPostingDivID).append('<div><p class="text-center no-records">There are no job postings as of now.</p></div>');
        }
    },function(data){})
}

function getCurrentOpeningDetails(itemIdCO){
    var COURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('"+jobPostingListName+"')/Items?select=*&$filter=Id eq '"+itemIdCO+"'&$top=5000";
    getItems(COURL,function(data){
        var currentOpeningResults = data.d.results;
        if(currentOpeningResults.length > 0){
            $('#CurrentOpeningContentModal').append('<div class="row"><div class="col-md-2"><label><b>Title:- </b></label></div><div class="col-md-10"><div>'+currentOpeningResults[0].Title+'</div></div></div>'+
                                                    '<div class="row"><div class="col-md-2"><label><b>Description:- </b></label></div><div class="col-md-10">'+(currentOpeningResults[0].Description == null ? '' : currentOpeningResults[0].Description)+'</div></div>'+
                                                    '<div class="row"><div class="col-md-2"><label><b>Skills:- </b></label></div><div class="col-md-10">'+(currentOpeningResults[0].Skills == null ? '' : currentOpeningResults[0].Skills)+'</div></div>'+
                                                    '<div class="row"><div class="col-md-2"><label><b>Experience:- </b></label></div><div class="col-md-10">'+(currentOpeningResults[0].Experience == null ? '' : currentOpeningResults[0].Experience)+'</div></div>'+
                                                    '<div class="row"><div class="col-md-2"><label><b>Availability:- </b></label></div><div class="col-md-10">'+(currentOpeningResults[0].Availability == null ? '' : currentOpeningResults[0].Availability)+'</div></div>');
        }else{
            $('#CurrentOpeningContentModal').append('<p>Currently unavailable. Please refresh the page.</p>');
        }
    },function(data){})
}