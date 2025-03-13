var jobPostingListName = 'Job Posting';
var HTMLJobPostingDivID = 'accordion';

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
                    for(r=0;r<jobPostingResults[q].Skills.results.length;r++){
                        skillsOption += '<li>'+jobPostingResults[q].Skills.results[r]+'</li>'; 
                    }
                }
                
                var HTMLToAppend = '<div class="card">'+
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
            $('#'+HTMLJobPostingDivID).on("hide.bs.collapse show.bs.collapse", e => {
			  $(e.target)
			    .prev()
			    .find("i:last-child")
			    .toggleClass("fa-minus fa-plus");
			});
        }else{
            $('#'+HTMLJobPostingDivID).append('<div>There are no job postings as of now.</div>');
        }
    },function(data){})
}