function myGetElementsByClassName(selector) {
    if ( document.getElementsByClassName ) {
        return document.getElementsByClassName(selector);
    }

    var returnList = new Array();
    var nodes = document.getElementsByTagName('div');
    var max = nodes.length;
    for ( var i = 0; i < max; i++ ) {
        if ( nodes[i].className == selector ) {
            returnList[returnList.length] = nodes[i];
        }
    }
    return returnList;
}

var rssReader = {
    containers : null,
    
    // initialization function
    init : function(selector) {
        containers = myGetElementsByClassName(selector);
        for(i=0;i<containers.length;i++){
            // getting necessary variables
            var rssUrl = containers[i].getAttribute('rss_url');
            var num = containers[i].getAttribute('rss_num');
            var id = containers[i].getAttribute('id');

            // creating temp scripts which will help us to transform XML (RSS) to JSON
            var url = encodeURIComponent(rssUrl);
            var googUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+num+'&q='+url+'&callback=rssReader.parse&context='+id;

            var script = document.createElement('script');
            script.setAttribute('type','text/javascript');
            script.setAttribute('charset','utf-8');
            script.setAttribute('src',googUrl);
            containers[i].appendChild(script);
        }
    },

    // parsing of results by google
    parse : function(context, data) {
        console.log("Printing context" + context);
        console.log("Printing context" + context[12]);
        var container = document.getElementById(context);
        container.innerHTML = '';


        // creating list of elements
        var mainList = document.createElement('ul');

        // also creating its childs (subitems)
        var entries = data.feed.entries;
        for (var i=0; i<entries.length; i++) {
            var listItem = document.createElement('li');
            var title = entries[i].title;
            var contentSnippet = entries[i].contentSnippet;
            var contentSnippetText = document.createTextNode(contentSnippet);

            var link = document.createElement('a');
            link.setAttribute('href', entries[i].link);
            link.setAttribute('target','_blank');
            var text = document.createTextNode(title);
            link.appendChild(text);

            // add link to list item
            listItem.appendChild(link);

            var desc = document.createElement('p');
            console.log("content = " + i*context[12]);
            desc.setAttribute('id', 'content' + i*context[12]);
        
            desc.appendChild(contentSnippetText);

            // add description to list item
            listItem.appendChild(desc);

            // adding list item to main list
            mainList.appendChild(listItem);
        }

        container.appendChild(mainList);
    }
};



isContain = function (first_text, second_text){
	return first_text.toLowerCase().indexOf(second_text.toLowerCase)? true: false;
}


filter = function(){

	button = document.getElementById("filter");
	text = document.getElementById("txt_for_filter");
	console.log(button);
	button.onclick = function(){
		alert("please work please");
		console.log(text.value);
	}
}



window.onload = function() {
    rssReader.init('post_results');
	filter();
	var paragraphs = document.getElementsByTagName("div");
    var pp = document.getElementById("content1");
    console.log(pp);
	console.log(paragraphs);
	console.log(paragraphs.length);
    console.log(paragraphs[1].childNodes[1].childNodes[0].textContent)
	//for(var i = 0; i < 15; i++)
	{
		//alert(paragraphs.contentSnippetText);
	}
}