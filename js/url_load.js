	var url_load = function(url,onload_f,vars){
		/* check if it is a new instance */
		if(this === window.url_load)	return false;
		this.id	= 'l'+new Date().valueOf()+'_'+Math.floor(Math.random()*1000000);
		/* load obj to window obj */
			window[this.id]	= this;
		
		if(!vars)	vars	= {};
		this.vars	= vars;
		this.url	= url;
		this.onload_f	= onload_f;
		this.text	= null;
		
		this.endEval	= function(){
			/* clean timer */
				var e;try { clearInterval(this.timer); } catch(e) {};
			/* try to eval function */
				try {var url = this.url,text=this.text;vars=this.vars;	 (this.onload_f)(url,text,vars); } catch (e) {};
			/* try to delete instance from window object */
				try { delete window[this.id]; } catch (e) {};
		};
		
		this.link = new XMLHttpRequest();
		this.link.open('GET', this.url);
		eval("this.link.onreadystatechange = function() {var id = \""+this.id+"\";if(!(id in window)) return false;if(window[id].link.readyState == 4){window[id].text	= window[id].link.responseText;window[id].endEval();} else if(window[id].status == 404) {window[id].endEval();}	}");
		this.link.send();
		
		return true;
	}
