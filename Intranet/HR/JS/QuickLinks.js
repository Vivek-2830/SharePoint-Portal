var quickLinkListName = 'Quick Links';
var HTMLQuickLinkDivID = 'QuickLinksDiv';

$(document).ready(function(){
    getQuickLinks();
});

function getQuickLinks(){
    var quickLinksURL = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+quickLinkListName+"')/items?$select=*&$filter=isGlobal eq 0&$top=5000";
    getItems(quickLinksURL,function(data){
        var quickLinksResults = data.d.results;
        if(quickLinksResults.length > 0){
            for(l=0;l<quickLinksResults.length;l++){
                var classType = '';
                if(quickLinksResults[l].Icon == 'SiteMap'){
                    classType = 'fa fa-sitemap bg-green';
                }
                else if(quickLinksResults[l].Icon == 'Setting'){
                    classType = 'fa fa-cog bg-blue';
                }
                else if(quickLinksResults[l].Icon == 'Image'){
                    classType = 'fa fa-image bg-dark-blue';
                }
                else if(quickLinksResults[l].Icon == 'Archive'){
                    classType = 'fa fa-archive bg-yellow';
                }
                else if(quickLinksResults[l].Icon == 'Calendar'){
                    classType = 'fa fa-calendar-check-o bg-red';
                }
                else if(quickLinksResults[l].Icon == 'Bar'){
                    classType = 'fa fa-bar-chart bg-sky-blue';
                }
                else if(quickLinksResults[l].Icon == 'Birthday'){
                    classType = 'fa fa-birthday-cake bg-dark-pink';
                }
                else if(quickLinksResults[l].Icon == 'Module'){
                    classType = 'fa fa-puzzle-piece bg-purple';
                }
                else if(quickLinksResults[l].Icon == 'Other'){
                    classType = 'fa fa-link bg-blue';
                }
                var HTMLToAppend = '<div class="ds-blocks"><a href="'+(quickLinksResults[l].URL == null ? 'javascript:;' : quickLinksResults[l].URL.Url)+'" target="_blank">'+
                                        '<i class="'+classType+' icon-rounded icon-md"></i>'+
                                        '<br>'+
                                        '<p>'+quickLinksResults[l].Title+'</p>'+
                                    '</a></div>';
                $('#'+HTMLQuickLinkDivID).last().append(HTMLToAppend);
            }
        }else{
            $('#'+HTMLQuickLinkDivID).append('<div>There are no quick links to show.</div>');
        }
    },function(data){})
}