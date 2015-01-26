$(document).ready(function() {

var $content   = $('#content'),
    $doc       = $content.find('>.doc'),
    $toc       = $doc.find('>.toc'),
    isDocument = $doc.length > 0,
    hasToc     = $toc.length > 0,

    fadeDuration = 250;

if(isDocument) {
    $doc.show(fadeDuration);

    if(hasToc) {
        formatToc();
    }
}

function formatToc(){
    $doc.addClass('large-9 columns');
    $toc.addClass('large-3 columns');

    $toc.find('.toctitle').each(function(){
        var $this = $(this);
        $this.replaceWith($('<h4 class="subheader">' + $this.html() + '</h4>'));
    });

    $content.prepend($toc);
    $toc.show(fadeDuration);
}

});

