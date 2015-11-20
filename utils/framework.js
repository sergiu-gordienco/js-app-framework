	var framework	= function(){
		this.id	= 'Framework-'+Math.floor(Math.random()*1000000000)+'-'+new Date().valueOf();
		window[this.id]	= this;
		
		this.vars	= {};
		
		this.templates_dir	= 'js/templates/';
		this.templates_extension= '.tpl';
		
		this.controller_dir	= 'js/controllers/';
		this.controller_extension	= '.js';
		
		this.extension_suffix	= '';
		
		this.controller	= new url_obj();
		this.framework	= this;
		this.controller.framework	= this;
		this.controller.controller	= this.controller;
		
		this.controller.set('ifNoAction',function(controller,action,params,data,app){
			if(this.controller.get("debug")) {
				console.info("Controller or Action Not Loaded .. Controller: ",controller,'; Action: ',action,'; Params: ',params,'; Data: ',data);
			}
			var actions	= this.controller.get("actions");
			
			if(!controller)	controller	= this.defController;
			if(!action)	action		= this.defAction;
			
			if(!(controller in actions)){
				// load controller
					new url_load(
						this.framework.controller_dir + controller + this.framework.controller_extension + this.framework.extension_suffix,
						function(url,text,vars){
							// onload execute again controller
							var r,e,broken = false;
							try {
								eval('vars.framework.controller.set("actions",{	act	: "add",	data	: {	"'+vars.attr.controller+'"	: \n'+text+'\n	}});');
							} catch(e) {
								broken	= true;
								if(vars.framework.controller.get("debug")) {
									console.error("Broken Controller .. Javascript Error \nFile: ",
										vars.framework.controller_dir + vars.attr.controller + vars.framework.controller_extension,
										"\nError: ",e,'\n',text
										);
								}
							}
							if(broken === false) {
								vars.framework.exec(
									vars.attr.controller,
									vars.attr.action,
									vars.attr.params,
									vars.attr.data.hide
								);
							}
						},
						{
							framework	: this.framework,
							attr	: {
								controller	: controller,
								action		: action,
								params		: params,
								data		: data
							}
						}
					);
			} else {
				// load action
					// onload execute data
					new url_load(
						this.framework.controller_dir + controller + '/' + action + this.framework.controller_extension + this.framework.extension_suffix,
						function(url,text,vars){
							// onload execute again controller
							var r,e,broken = false;
							try {
								eval('vars.framework.controller.set("actions",{	act	: "add",	data	: {	"'+vars.attr.controller+'"	: { "'+vars.attr.action+'" : \n'+text+'\n }	}});');
							} catch(e) {
								broken	= true;
								if(vars.framework.controller.get("debug")) {
									console.error("Broken Controller Action .. Javascript Error \nFile: ",
										vars.framework.controller_dir + vars.attr.controller + '/' + vars.attr.action + vars.framework.controller_extension,
										"\nError: ",e,'\n',text
										);
								}
							}
							if(broken === false) {
								vars.framework.exec(
									vars.attr.controller,
									vars.attr.action,
									vars.attr.params
								);
							}
						},
						{
							framework	: this.framework,
							attr	: {
								controller	: controller,
								action		: action,
								params		: params,
								data		: data
							}
						}
					);
			}
		});
		
		this.exec	= function(controller,action,params,hide){
			if(!hide)	hide	= false;
			var ref	= document.location.href;
			var url	= ref.split('#')[0];
			if(!params)	params	= [];
			if(!controller)	controller	= this.controller.defController;
			if(!action)	action	= this.controller.defAction;
			
			if(hide){
				this.controller.onUrlDiff(false,controller,action,params);
				return true;
			}
			
			var i;for(i=0;i<params.length;i++)
				params[i]	= escape(params[i]);
			
			url	= url+this.controller.urlSpliter
					+escape(controller)
					+'/'+escape(action)
					+(params.length ? '/'+params.join('/') : '');
			if(ref == url){
				if(this.controller.urlHist.length == 0)
					this.controller.urlHist.push('');
				this.controller.urlHist.pop();
			}
				document.location.replace(url);
		};
		
		this.templates_list	= {};
		this.templates_load	= function(tpl,onload_f,vars){
			if(this.controller.get("debug")){
				console.log("Load Template ",tpl);
			}
			new url_load(
				this.templates_dir + tpl + this.templates_extension + this.extension_suffix,
				function(url,text,vars){
					vars.framework.templates_list[vars.template_id]	= {
						text	: text,
						id	: vars.template_id,
						loaded	: new Date().valueOf()
					};
					(vars.onload_f)({
						tpl	: vars.framework.templates_list[vars.template_id],
						vars		: vars.vars,
						framework	: vars.framework,
						template_id	: vars.template_id
						});
				},
				{
				framework	: this,
				template_id	: tpl,
				vars		: vars ? vars : null,
				onload_f	: ( typeof(onload_f) == "function" ? onload_f : function(){} )
				}
			);
		};
		
		this.view_params	= {
			dir	: {
				tpl	: this.templates_dir,
				js	: this.controller_dir,
				data	: ''
			},
			dirs	: {
				reg	: /^\s*params\s*->\s*dir\s*->\s*([a-z0-9\_\-]+)\s*$/,
				funct	: function(framework,match_arr,par,vars,tpl) {
					if(match_arr[1] in framework.view_params.dir)
						return framework.view_params.dir[match_arr[1]];
					return '';
				}
			},
			include_tpl	: {
				reg	: /^\s*include\-tpl(\-\d+|)->\s*(.*)$/,
				funct	: function(framework,match_arr,par,vars,tpl){
					var id	= 'replace-node-'+new Date().valueOf()+'-'+Math.floor(Math.random()*1000000000)+'-'+Math.floor(Math.random()*1000000000);
					
					var	e = 10;
					if(match_arr[1])
					if(parseInt(match_arr[1])){
						e	= Math.abs(parseInt(match_arr[1]));
					};
					
					framework.view(function(code,framework,sett,tpl,vars){
						framework.waitUntil(function(v,app){
							if(!app.framework.$('#'+v.id))	return true;
							var f	= document.createElement('div');
							f.innerHTML	= v.code;
							var r	= app.framework.$('#'+v.id);
							var p	= r.parentElement;
							var c	= f.childNodes;
							var n	= null;
							var i,err;
							for(i=0;i<c.length;i++){
								n = c[i].cloneNode(true);
								if(n.nodeType == 3)try{
									n.nodeValue	= framework.viewStr(n.nodeValue);
								}catch(err){};
								p.insertBefore(n, r)
							}
							p.removeChild(r);
						},function(v,app){
							if(app.framework.$('#'+v.id)
								||
								new Date().valueOf() > v.expire
							){
								return true;
							}
							return false;
						},{
							id	: sett.id,
							code	: code,
							expire	: sett.expire
						})
					},match_arr[2],vars,{
						id	: id,
						expire	: new Date().valueOf()+(e*1000)
					});
					return '<input type="hidden" id="'+id+'" value="'+match_arr[2]+'">';
				}
			},
			
			use_local	: {
				reg	: /^\s*use\s*->(css|js)->\s*(.*)/,
				funct	: function(framework,match_arr,par,vars,tpl) {
					var id	= match_arr[1]+'__'+match_arr[2].replace(/[^A-Za-z0-9\-\_]/gi,'_-_');
					if(!framework.$('#'+id))
						switch(match_arr[1]){
							case 'css'	:
								var e = document.createElement("link")
								e.setAttribute("rel", "stylesheet")
								e.setAttribute("type", "text/css")
								e.setAttribute("href", framework.view_params.dir.data + match_arr[2])
								e.id	= id;
								document.getElementsByTagName('head')[0].appendChild(e);
							break;
							case 'js'	:
								var e = document.createElement('script');
								e.id	= id;
								e.type	= "text/javascript";
								e.src	= framework.view_params.dir.data + match_arr[2];
								document.getElementsByTagName('head')[0].appendChild(e);
							break;
						}
					return '';
				}
			}
		}
		
		this.view_par	= function(par,vars,tpl){
			var m;
			if(m = par.match(/^\s*vars\s*->\s*([a-z0-9\_\-]+)\s*$/))
				return ((m[1] in vars) ? vars[m[1]] : '');
			
			var i;
			for(i in this.view_params){
				if('funct' in this.view_params[i])
				if(typeof(this.view_params[i].funct) == "function") {
					if('reg' in this.view_params[i])
					if(m = par.match(this.view_params[i].reg)) {
						return (this.view_params[i].funct)(this,m,par,vars,tpl);
					}
				}
			}
			
			return null;
		}
		
		this.viewStr	= function(text,vars,tpl){
			if(!vars)	var vars	= {};
			if(!tpl)	var tpl		= {text:text};
			var text	= text.split('{');
			var par,val;
			
			var i;for(i=1;i<text.length;i++) {
				text[i]	= text[i].split('}');
				
				if(text[i].length > 1) {
					par	= text[i].shift();
					
					// replace param
					val	= this.view_par(par,vars,tpl);
					
					if(val === null){
						val	= '{'+par+'}';
					}
					
					text[i]	= ''+val+''+text[i].join('}');
				}
				
				
			};
			text	= text.join('');
			return text;
		}
		
		this.view	= function(destination,tpl,vars,sett){
			if(typeof(vars) == "undefined")	vars	= {};
			if(typeof(sett) == "undefined")	sett	= {};
			if(typeof(tpl) != "object")
			if(tpl in this.templates_list) {
				tpl	= this.templates_list[tpl];
			} else {
				return this.templates_load(tpl,function(vars){
					vars.framework.view(
						vars.vars.destination,
						vars.tpl,
						vars.vars.vars,
						vars.vars.sett
					);
				},{
					destination	: destination,
					vars		: vars,
					sett		: sett
				});
			};
			if(this.controller.get("debug")){
				console.log("Render Template ",tpl);
			}
			text	= this.viewStr(tpl.text,vars,tpl);
			if(this.controller.get("debug")){
				console.log("Load Template into",destination,'\n\tText: ',{text:text},'\n\tTemplate: ',tpl);
			}
			if(typeof(destination) == "function")	return (destination)(text,this,sett,tpl,vars);
			
			if(typeof(destination) == "string") {
				destination	= this.$(destination);
			} else {
				/* no change */
			}
			if(destination){
				if('innerHTML' in destination)	destination.innerHTML	= text;
				if('value' in destination)	destination.value	= text;
			}
		}
		
		this.reset	= function(){
			this.controller.actions	= {};
			this.templates_list	= {};
			
			if(this.controller.get("debug")){
				this.extension_suffix	= '?t='+new Date().valueOf();
			}
		}
		
		this.$		= function(s,action,root){
			var m,e	= false,i,j,k;
			if(!action)	action	= '';
			if(!root)	root	= document;
			
			s	= s.split(/\s+/g);
			e	= root;
			for(i=0;i<s.length;i++)if(s[i]){
				if(m = s[i].match(/^\s*\#([a-zA-Z0-9\-\_]+)\s*/)){
					e = e.getElementById(m[1]);
				}
				
				if(m = s[i].match(/^\s*([a-zA-Z0-9\-\_]+)(\[\d+\]|)\s*/)){
					e = e.getElementsByTagName(m[1]);
					if(m[2] !== ''){
						e = e[parseInt(m[2].replace(/\D/g,''))];
					}
				}
			};
			
			if(typeof(action) == "function"){
				return ((action)(e,this));
			}
			
			switch(action){
				case 'form-data':
					var fields	= [];
					fields.push({val:'input',list:this.$('input',	0,e)});
					fields.push({val:'value',list:this.$('textarea',	0,e)});
					fields.push({val:'select',list:this.$('select',	0,e)});
					var data	= {};
					var v;
					for(i=0;i<fields.length;i++)
					for(j=0;j<fields[i].list.length;j++)
						if(fields[i].list[j].name){
						v = null;
							switch(fields[i].val) {
								case 'select':
									v = fields[i].list[j].options[fields[i].list[j].selectedIndex].value;
								break;
								case 'input':
									switch(fields[i].list[j].type){
										case 'button':
										case 'image':
										case 'file':
										break;
										case 'radio':
											if(fields[i].list[j].selected)
												v = fields[i].list[j].value;
										break;
										case 'checkbox':
											if(fields[i].list[j].checked)
												v = fields[i].list[j].value;
										break;
										default:
											if('value' in fields[i].list[j])
												v = fields[i].list[j].value;
										break;
									}
								break;
								default	:
									v = fields[i].list[j][fields[i].val];
								break;
							};
						if(v !== null)
							data[fields[i].list[j].name] = v;
						}
					return	data;
				break;
			}
			return e;
		}
		this.waitList_k	= 0;
		this.waitList	= {};
		this.waitCheck	= function(){
			var e,i,k = false;
			for(i in this.waitList){
				k	= false;
				try {
					if( (this.waitList[i].cond)(this.waitList[i].vars,this) ) {
						k	= true;
						(this.waitList[i].func)(this.waitList[i].vars,this);
					};
				} catch ( e ) {
					if(this.controller.get("debug")){
						console.error("Condition Wait Error",this.waitList[i]," Error:",e);
						k	= true;
					}
				};
				if(k)	try {
					delete	this.waitList[i];
				} catch( e ) {
					if(this.controller.get("debug")){
						console.error("Error deleting",this.waitList[i]," Error:",e);
					}
				}
			}
		};
		this.waitUntil	= function(func,cond,vars){
			var e,i;
			if(typeof(vars) == "undefined")	vars	= null;
			if(typeof(func) == "function" && typeof(cond) == "function"){
				this.waitList_k	+= 1;
				this.waitList[this.waitList_k]	= {
					func	: func,
					cond	: cond,
					vars	: vars
				};
			}
		};
		
		eval("setInterval(function(){var id	= unescape(\""+escape(this.id)+"\");window[id].waitCheck();},100)");
		
		return this;
	}
