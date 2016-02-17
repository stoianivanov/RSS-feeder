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
			listItem.setAttribute('id', 'item' + i + "_" + context[12]);
            var title = entries[i].title;
            var contentSnippet = entries[i].contentSnippet;
            var contentSnippetText = document.createTextNode(contentSnippet);

            var link = document.createElement('a');
            link.setAttribute('href', entries[i].link);
            link.setAttribute('target','_blank');
			link.setAttribute('id', 'link' + i + "_" + context[12]);
            var text = document.createTextNode(title);
            link.appendChild(text);

            // add link to list item
            listItem.appendChild(link);

            var desc = document.createElement('p');
            desc.setAttribute('id', 'content' + i + "_" + context[12]);
        
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
	return first_text.toLowerCase().indexOf(second_text.toLowerCase()) != -1? true: false;
}


filter = function(){

	button = document.getElementById("filter");
	text = document.getElementById("txt_for_filter");
	console.log(button);
	button.onclick = function(){
		console.log(text.value);
	    filterBy(1,8,'content',text.value);
        filterBy(2,8,'content',text.value);
	}
    buttonForTitle = document.getElementById("filter_title");
    textForTitle = document.getElementById("title_filter_txt");
    buttonForTitle.onclick = function(){
        filterBy(1,8,'content',textForTitle.value);
        filterBy(2,8,'content',textForTitle.value);
    }  


}

search = function(){
    searchButtonText = document.getElementById("search_txt");
    searchText = document.getElementById("txt_for_search");
    searchButtonText.onclick = function(){
        searchBy(1,8,'content',searchText.value);
        searchBy(2,8,'content',searchText.value);
    }  
    searchButtonTitle = document.getElementById("search_title");
    searchTitle = document.getElementById("title_search_txt");
    searchButtonTitle.onclick = function(){
        searchBy(1,8,'link',searchTitle.value);
        searchBy(2,8,'link',searchTitle.value);
    }  


}




filterBy = function(coulmn, size, by, txt){
        var content;
        for( var i = 0 ; i < size; ++i){
            content = document.getElementById(by + i + "_" + coulmn)
            console.log(isContain(txt,content.textContent));
            console.log(txt);
            console.log(content.textContent);
            if (!isContain(content.textContent,txt)){
                var item = document.getElementById("item" + i + "_" + coulmn);
                item.style.visibility = "hidden";
                content.style.visibility = "hidden";
            }
        }
    }


searchBy = function(coulmn, size, by, txt){
    var content;
    for( var i = 0 ; i < size; ++i){
        content = document.getElementById(by + i + "_" + coulmn)
        console.log(isContain(content.textContent,txt));
        console.log(txt);
        console.log(content.textContent);
        if (isContain(content.textContent,txt)){
            var item = document.getElementById(by + i + "_" + coulmn);
            console.log("pak li");
            item.style.color = '#ff0000';
                
        }
    }
}


keydown = function(obj, by, size, column){
    console.log("we have a event");
    inputText = document.getElementById(obj);
    inputText.onkeydown = function(){
        console.log("fuck shit");
        var content;
        for( var i = 0 ; i < size; ++i){
            console.log("don't entered");
            content = document.getElementById(by + i + "_" + coulmn);
            console.log(isContain(content.textContent,obj.value));
            console.log(txt);
            console.log(content);
            if (isContain(content.textContent,obj.value)){
                var item = document.getElementById(by + i + "_" + coulmn);
                item.style.visibility = "hidden";  
            }
        }
    }

}


getNotFilterFeed = function(size, coulmn){
    var history_list = document.getElementById("history_list");
    for( var i = 0 ; i < size; ++i){
        var item = document.getElementById('item' + i + "_" + coulmn);
        console.log(item.style.visibility); 
        if(item.style.visibility !== "hidden"){
            console.log(item);
            history_list.appendChild(item.cloneNode(true));
        }
        
    }
}
window.onload = function() {
    rssReader.init('post_results');
	search();
	filter();
    keydown("txt_for_filter", "content",8,1);
    var reloadButton = document.getElementById("reload");
    reloadButton.onclick = function(){
        rssReader.init('post_results');
    }

    var saveButton = document.getElementById("save");
    saveButton.onclick= function(){
        getNotFilterFeed(8,1);
        getNotFilterFeed(8,2);
    }
}