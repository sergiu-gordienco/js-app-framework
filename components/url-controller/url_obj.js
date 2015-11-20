	var url_obj = function(){
		this.actions	= {};
		this.id		= 'u'+new Date().valueOf()+'_'+Math.floor(Math.random()*1000000);
		this.debug	= false;
		this.urlHist		= [];
		this.defController	= 'index';
		this.defAction		= '_';
		
		this.get	= function(){
			var n,i=[];
			for(n=0;n<arguments.length;n++)	i.push(arguments[n]); // fixing IE errors
			if(i[0] in {actions:1,id:1,debug:1,urlHist:1,defController:1,defAction:1,ifNoAction:1,urlSpliter:1}){
				var	v = this,k;
				while(i.length){
					k = i.shift();
					if(typeof(v) != "object" && k != ""){
						if(this.debug)
							console.log("Error: Method [get] can\'t find option [",k,"] in value: [",v,"];    keys ramains: ",i," ;");
						return v;
					};
					if(k in v) v = v[k];
				}
				return v;
			} else {
				if(this.debug)
					console.log("Error: Method [get].. trying to extract no-default param .. keys: ",i,"");
				return null;
			}
		}
		this.set	= function(param,v){
			if( param in {debug:1,defAction:1,defController:1,ifNoAction:1,urlSpliter:1}){
				this[param]	= v;
			} else if(param == 'actions'){
				if(typeof(v) == "object"){
					switch(v.act){
						case "clean"	:
							this.actions	= {};
						break;
						case "del-controller":
							if(v.controller in this.actions)
								delete this.actions[v.controller];
						break;
						case "del-action":
							if(v.controller in this.actions)
							if(v.action in this.actions[v.controller])
								delete this.actions[v.controller][v.action];
						break;
						case "add":
							var i,j;if(typeof(v.data) == "object")
							for(i in v.data) {
								if(!(i in this.actions))
									this.actions[i]	= {};
								for(j in v.data[i])
								if(typeof(v.data[i][j]) == "function"){
									if(this.debug){
										if(this.actions[i][j]){
											console.log("Overwrite Controller.action : [",i,".",j,"]; old-value: ",this.actions[i][j],"    new-value: ",v.data[i][j]);
										}
									}
									this.actions[i][j]	= v.data[i][j];
								}
							}
						
						break;
					}
				}
			} else {
				if(this.debug)
					console.log("Error: Method[set].. param: [",param,"]    value: [",value,"];");
				return false;
			}
		}
		
		this.ifNoAction	= function(controller,action,param,data,app){
			
			if(this.debug)
				console.log("\tController: ",controller,"    Action: ",action);
		}
		this.urlSpliter	= "#!";
		this.urlDec	= function(s){
			var e;try{
				return decodeURIComponent(s);
			} catch(e) {};
			try {
				return unescape(s);
			} catch(e) {};
			return s;
		}
		this.onUrlDiff	= function(url,last,t_action,t_params){
			var hide	= false;
			if(url === false){
				hide	= true;
				var controller	= last;
				var action	= t_action;
				if(!t_params)	t_params	= [];
				var params	= t_params;
				var n,i		= [];
				i.push(controller);
				i.push(action);
				for(n=0;n<params.length;n++) i.push(params[n]);
			} else {
				if(this.debug)
					console.log('Document.location Change to: "',url,'"    from: "',last,'"');
			
				// document.getElementById('testSpace').innerHTML = "URL History: "+this.urlHist.length+" urls\n\n"+this.urlHist.join("\n");
			
				var i = url.split(this.urlSpliter);
				i.shift();i = i.join(this.urlSpliter).split('/');
			
				var n;for(n=0;n<i.length;n++)	i[n]	= this.urlDec(i[n]);
			
				if(i.length < 2) i.push(this.defAction);
				var controller	= i[0];
				var action	= i[1];
			}
			if(action == '')	action	= this.defAction;
			if(controller == '')	controller	= this.defController;
			if(this.debug){
				console.info('Execution: Controller: ',controller,' Action: ',action);
			}
			var no_act	= true;
			if(controller in this.actions){
				if(action in this.actions[controller]){
					(this.actions[controller][action])(
						controller,
						action,
						i.slice(2),
						{	url	: url,
							parts	: i,
							hide	: hide
						},
						this
					);
					no_act = false;
				}
			};
			if(this.debug) console.info('Execution Status: ',!(no_act));
			if(no_act){
				(this.ifNoAction)(
					controller,
					action,
					i.slice(2),
					{	url	: url,
						parts	: i,
						hide	: hide
					},
					this
				);
			};
		}
		this.urlCheck	= function(){
			var last;
			if(this.urlHist.length < 1){
				last	= '';
			} else {
				last	= this.urlHist[this.urlHist.length-1];
			}
			var url	= document.location.href;
			if(last != url){
				this.urlHist.push(url);
				while(this.urlHist.length > 10)	this.urlHist.shift();
				this.onUrlDiff(url,last);
			}
		}
		// creating timer sinaps
		this.timer	= false;
		this.start	= function(){
			this.stop();	// prevent double init
			eval("this.timer	= setInterval(function(){window['"+this.id+"'].urlCheck()},50);")
		}
		this.stop	= function(){
			var e;try{
				clearInterval(this.timer);
			} catch(e){}
		}
		// assigning object to global vars
			window[this.id]	= this;
		return this;
	}
