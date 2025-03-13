var EmployeeArrayForBirthDay = new Array();
var AnnmonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
$(document).ready(function(){
	getBDAndAnniversary();
});

function getBDAndAnniversary(){
    date = new Date();
    var BDAndAnniversaryurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee Information')/items?$top=5000&$select=*,AttachmentFiles,Title&$expand=AttachmentFiles&$filter=(LWD eq null) and (Status eq 1)&$orderBy=Id desc";
    getItems(BDAndAnniversaryurl,function(data){
        var BDAndAnniversaryResults = data.d.results;
        if(BDAndAnniversaryResults.length > 0){
        	
        	var month = new Date().getMonth() + 1;
			var fetchedDate = new Date().getDate();
			/*var anniveraryResults = BDAndAnniversaryResults.filter(d => {var tempMonth = new Date(d.DOJ).getMonth() + 1; var tempDate = new Date(d.DOJ).getDate();
				return (month == tempMonth && fetchedDate <= tempDate);
			});*/
			var anniveraryResults = BDAndAnniversaryResults.filter(function (d) {
			  var tempMonth = new Date(d.DOJ).getMonth() + 1;
			  var tempDate = new Date(d.DOJ).getDate();
			  return month == tempMonth && fetchedDate <= tempDate;
			});
			
			/*var birthDayResults = BDAndAnniversaryResults.filter(d => {var tempMonth = new Date(d.DOB).getMonth() + 1; var tempDate = new Date(d.DOB).getDate();
				return (month == tempMonth && fetchedDate <= tempDate);
			});*/
			var birthDayResults = BDAndAnniversaryResults.filter(function (d) {
			  var tempMonth = new Date(d.DOB).getMonth() + 1;
			  var tempDate = new Date(d.DOB).getDate();
			  return month == tempMonth && fetchedDate <= tempDate;
			});
        
        	// if(anniveraryResults.length > 0){
        	
        	// 	var tempArray = new Array();
				
			// 	for(u=0;u<anniveraryResults.length;u++){
			// 		tempArray.push({joiningDate :anniveraryResults[u].DOJ,displayName:anniveraryResults[u].Title,Day:new Date(anniveraryResults[u].DOJ).getDate(),ImageURL:anniveraryResults[u].AttachmentFiles.results[0].ServerRelativeUrl});		
			// 	}
				
			// 	tempArray.sort(function(a, b){ 
      
            //         return new Date(a.Day) - new Date(b.Day); 
            //     }); 
								
			// 	for(u=0;u<tempArray.length;u++){
			// 		var joiningDate = new Date(convertDateSharePointFormat(tempArray[u].joiningDate));
	        //         var Annmonth = AnnmonthNames[joiningDate.getMonth()].substr(0, 3);
	        //         var joiningday = joiningDate.getDate();
	        //         var EmpAnnImageurl = tempArray[u].ImageURL;
	        //         $('#anniversaryDiv').last().append('<div class="user-info">'+
			// 								                '<div class="avatar">'+
			// 								                    '<img src="'+EmpAnnImageurl+'" class="img-fluid rounded-circle">'+
			// 								                '</div>'+
			// 								                '<div class="info">'+
			// 								                    '<p class="username">'+tempArray[u].displayName+'</p>'+
			// 								                    '<span class="userdeatil">'+joiningday.toString()+' '+Annmonth.toString()+'</span>'+
			// 								                '</div>'+
			// 								            '</div>');
			// 	}
			// }else{
			// 	$('#anniversaryDiv').last().append('<div class="user-info"><p>There are no work anniversary in this month.</p></div>')
			// }
			
			if(birthDayResults.length > 0){
				
				var tempBDArray = new Array();
				
				for(u=0;u<birthDayResults.length;u++){
					tempBDArray.push({dateOfBirth:birthDayResults[u].DOB,displayName:birthDayResults[u].Title,Day:new Date(birthDayResults[u].DOB).getDate(),ImageURL:birthDayResults[u].AttachmentFiles.results.length == 0 ? "/sites/Intranet/Style Library/Intranet/Images/Default-User.png" : birthDayResults[u].AttachmentFiles.results[0].ServerRelativeUrl});		
				}
				
				tempBDArray.sort(function(a, b){ 
      
                    return new Date(a.Day) - new Date(b.Day); 
                }); 
				
				for(v=0;v<tempBDArray.length;v++){
					var birthDate = new Date(convertDateSharePointFormat(tempBDArray[v].dateOfBirth));
	                var BDmonth = AnnmonthNames[birthDate.getMonth()].substr(0, 3);
	                var birthday = birthDate.getDate();
	                var EmpBDImageurl = tempBDArray[v].ImageURL;
					$('#carousel2').last().append('<div class="item">'+
			                        '<img class="owl-lazy img-fluid rounded-circle" data-src="'+EmpBDImageurl+'" alt="">'+
			                        '<h4>'+tempBDArray[v].displayName+'</h4>'+
			                        '<p>'+birthday.toString()+' '+BDmonth.toString()+'</p>'+
			                    '</div>');
				}
				$("#carousel2").owlCarousel({
				    autoplay: true,
				    lazyLoad: true,
				    loop: true,
				    margin: 20,
				     /*
				    animateOut: 'fadeOut',
				    animateIn: 'fadeIn',
				    */
				    responsiveClass: true,
				    autoHeight: true,
				    autoplayTimeout: 7000,
				    smartSpeed: 800,
				    nav: true,
				    responsive: {
				      0: {
				        items: 1
				      },
				  
				      600: {
				        items: 1
				      },
				  
				      1024: {
				        items: 1
				      },
				  
				      1366: {
				        items: 1
				      }
				    }
				 });
			}else{
				//$('#carousel2').last().append('<div><p class="text-center no-records">There are no birthdays in this month</p></div>');
				$('<div><p class="text-center no-records">There are no birthdays in this month.</p></div>').insertAfter($('#carousel2'))
			}        
        }else{
	        //$('#anniversaryDiv').last().append('<div class="user-info"><p>There are no work anniversary in this month.</p></div>')
            //$('#carousel2').last().append('<div><p class="text-center no-records">There are no birthdays in this month</p></div>');
            $('<div><p class="text-center no-records">There are no birthdays in this month.</p></div>').insertAfter($('#carousel2'))
        }
    },function(data){})
}