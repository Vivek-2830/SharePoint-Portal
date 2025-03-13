
var PhotoGalleryListName = 'Gallery';
var PhotoGalleryHTMLId = 'carousel';

$(document).ready(function(){
    getPhotoGallery();
});

function getPhotoGallery(){
    //var galleryurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetFolderByServerRelativeUrl('"+PhotoGalleryListName+"')/Files?$top=20";
    var galleryurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('"+PhotoGalleryListName+"')/Items?$select=File&$expand=File&$top=50&$orderBy=Modified desc";
    getItems(galleryurl,function(data){
        var galleryResults = data.d.results;
        if(galleryResults.length > 0){
            for(k=0;k<galleryResults.length;k++){
                var HTMLToAppend = '<a class="item" href="'+galleryResults[k].File.ServerRelativeUrl+'" data-effect="mfp-zoom-in" title="'+galleryResults[k].File.Name+'">'+
                                    '<img class="owl-lazy" src="'+galleryResults[k].File.ServerRelativeUrl+'" alt="">'+
                                    '</a>';
                $('#'+PhotoGalleryHTMLId).last().append(HTMLToAppend);
            }
            $("#carousel").owlCarousel({
                autoplay: true,
                lazyLoad: true,
                loop: true,
                margin: 20,                 
                responsiveClass: true,
                autoHeight: true,
                autoplayTimeout: 7000,
                smartSpeed: 800,
                mouseDrag: false,
                nav: false,
                //dots: true,
                responsive: {
                  0: {
                    items: 1
                  },
              
                  600: {
                    items: 8
                  },
              
                  1024: {
                    items: 8
                  },
              
                  1366: {
                    items: 8
                  }
                }
              });
        }else{
            $('#'+PhotoGalleryHTMLId).append('There are no Photos to show');
        }
    },function(data){});
}


$('.popup-gallery').magnificPopup({
	delegate: '.owl-item:not(.cloned) a',
	type: 'image',
	removalDelay: 500, //delay removal by X to allow out-animation
	callbacks: {
		beforeOpen: function() {
			// just a hack that adds mfp-anim class to markup 
			 this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
			 this.st.mainClass = this.st.el.attr('data-effect');
		}
	},
	tLoading: 'Loading image #%curr%...',
	mainClass: 'mfp-img-mobile',
	gallery: {
		enabled: true,
		navigateByImgClick: true,
		preload: [0,1] // Will preload 0 - before current, and 1 after the current image
	},
	image: {
		tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
		titleSrc: function(item) {
			return item.el.attr('title') + '<small></small>';
		}
	}
});
