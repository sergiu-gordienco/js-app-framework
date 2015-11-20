// ┌───────────────────────────────────────────────────────────────────────────────────────────────┐ \\
// │ m_framework - JavaScript Framework API                                                        │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2011-2018 Sergiu Gordienco Vasile (http://first-jump.com)                         │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under http://creativecommons.org/licenses/by-nc-nd/3.0/ license.                     │ \\
// │ This work is licensed under the Creative Commons                                              │ \\
// │ Attribution-NonCommercial-NoDerivs 3.0 Unported License.                                      │ \\
// │ To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/3.0/.      │ \\
// │ This code cannot be shared without owner aproove                                              │ \\
// └───────────────────────────────────────────────────────────────────────────────────────────────┘ \\

window.m_framework	= function(){
		this.id	= 'Framework-'+Math.floor(Math.random()*1000000000)+'-'+new Date().valueOf();
		window[this.id]	= this;
		this.templates_dir	= 'js/templates/';
		this.templates_extension= '.tpl';
		
		this.controller_dir	= 'js/controllers/';
		this.controller_extension	= '.js';
		
		this.strFuncts	= {};
		
		var j,i = 'xml2str,dec2hex,hex2dec,hex2str,str2hex,htmlchars,escape,unescape,encodeURIComponent,decodeURIComponent';
		i = i.split(',');
		for(j=0;j<i.length;j++) if(i[j] in window) this.strFuncts[i[j]] = window[i[j]];
		
		
		this.extension_suffix	= '';
		this.framework	= this;
		this.controller	= new m_urlcapture();
		this.controller.framework	= this;
		this.controller.controller	= this.controller;
		
		this.controller.set('ifNoAction',function(controller,action,params,data){
			if(this.controller.get("debug")) {
				console.info("Controller or Action Not Loaded .. Controller: ",controller,'; Action: ',action,'; Params: ',params,'; Data: ',data);
			}
			var actions	= this.controller.get("actions");
			
			if(!controller)	controller	= this.defController;
			if(!action)	action		= this.defAction;
			
			if(!(controller in actions)){
				// load controller
					new m_urlload(
						this.framework.controller_dir + controller + this.framework.controller_extension + this.framework.extension_suffix,
						function(url,text,vars){
							// onload execute again controller
							var r,e,broken = false;
							try {
								if(vars.framework.controller.get("debug")) {
									console.info('Loading Controller',vars.attr.controller)
								};
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
									vars.attr.data.hide,
									vars.attr.data.skipHub
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
					new m_urlload(
						this.framework.controller_dir + controller + '/' + action + this.framework.controller_extension + this.framework.extension_suffix,
						function(url,text,vars){
							// onload execute again controller
							var r,e,broken = false;
							try {
								if(vars.framework.controller.get("debug")) {
									console.info('Loading Controller\'s Action',vars.attr.controller,vars.attr.action)
								};
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
									vars.attr.params,
									vars.attr.data.hide,
									vars.attr.data.skipHub
								);
							}
							return false;
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
		this.skipExec	= false;

		this.exec	= function(controller,action,params,hide,skipHub, skipExec){
			if(!hide)	hide	= false;
			if(!skipHub)	skipHub	= false;
			var ref	= document.location.href;
			var url	= ref.split('#')[0];
			if(!params)	params	= [];
			if(!controller)	controller	= this.controller.defController;
			if(!action)	action	= this.controller.defAction;
			
			if(this.skipExec)	{
				this.skipExec	= false;
				return false;
			}
			
			if(controller != '__hub__' && action != '__hub__' && skipHub == false) {
				var par2 = [];
				params.forEach(function(v){ par2.push(v) });
				par2.unshift( '__controller__', controller, '__action__' , action );
				this.exec('__hub__','__hub__',par2,true);
				if(this.skipExec)	{
					this.skipExec	= false;
					return false;
				}
				this.exec(controller,'__hub__',par2,true);
				if(this.skipExec)	{
					this.skipExec	= false;
					return false;
				}
			}
			
			if(hide && !skipExec) {
				this.controller.onUrlDiff(false,controller,action,params,skipHub);
				if(this.controller.get("debug")){
					console.log('HIDE_F:',hide,'   SKIP_HUB:',skipHub,'   ref: ',ref,'   url:',url);
				}
				return true;
			}
			
			var i;for(i=0;i<params.length;i++)
				params[i]	= this.controller.escape(params[i]);
			
			url	= url+this.controller.urlSpliter
					+this.controller.escape(controller)
					+'/'+this.controller.escape(action)
					+(params.length ? '/'+params.join('/') : '');
			if(this.controller.get("debug")){
				console.log('HIDE_F:',hide,'   SKIP_HUB:',skipHub,'   ref: ',ref,'   url:',url);
			};
			
			this.execUrl(url,skipExec);
		};
		
		this.execUrl	= function(url,skipExec){
			if( !url )	url	= document.location.href;
			var ref	= document.location.href;
			if(url == ref && !skipExec)
			while(this.controller.urlHist.length > 0 && ref == this.controller.urlHist[this.controller.urlHist.length-1]){
				this.controller.urlHist.pop();
			}
			if( skipExec && ( this.controller.urlHist.length == 0 || url != this.controller.urlHist[this.controller.urlHist.length-1] ) ) {
				this.controller.urlHist.push(url);
			}
			
			document.location.replace(url);
		}
		
		this.templates_list	= {};
		this.templates_load	= function(tpl,onload_f,vars){
			if(this.controller.get("debug")){
				console.log("Load Template ",tpl,'\n\tOnload Func: ',onload_f,'\n\tVars: ',vars);
			}
			new m_urlload(
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
		this.view_getUrl	= function() {
			return document.location.href.replace(/[\?\#].*$/,'')+this.controller.urlSpliter;
		};
		this.view_params	= {
			dir	: {
				tpl	: this.templates_dir,
				js	: this.controller_dir,
				data	: ''
			},
			constant	: {
				reg	: /^\s*const\s*->\s*([a-zA-Z0-9\_\-]+)\s*$/,
				funct	: function(framework,match_arr,par,vars,tpl) {
					switch(match_arr[1]) {
						case 'urlSpliter':
							return framework.controller.urlSpliter;
						break;
						case 'url'	:
							return framework.view_getUrl();
						break;
					};
					return '';
				}
			},
			dirs	: {
				reg	: /^\s*params\s*->\s*dir\s*->\s*([a-zA-Z0-9\_\-]+)\s*$/,
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
				reg	: /^\s*use\s*->(css|js|less)->\s*(.*)/,
				funct	: function(framework,match_arr,par,vars,tpl) {
					var id	= match_arr[1]+'__'+match_arr[2].replace(/[^A-Za-z0-9\-\_]/gi,'_-_');
					if(!framework.$('#'+id)) {
						var prefix	= '';
						if(
							!match_arr[2].match(/^\//)
							&&
							!match_arr[2].match(/^\.\//)
							&&
							!match_arr[2].match(/^.{1,4}\:\/\//)
						) prefix	= framework.view_params.dir.data;
						switch(match_arr[1]){
							case 'css'	:
								var e = document.createElement("link");
								e.setAttribute("rel", "stylesheet");
								e.setAttribute("type", "text/css");
								e.setAttribute("href", prefix + match_arr[2] + framework.extension_suffix);
								e.id	= id;
								document.getElementsByTagName('head')[0].appendChild(e);
							break;
							case 'less'	:
								if('newLess' in window)
								newLess(prefix + match_arr[2] + framework.extension_suffix,id);
							break;
							case 'js'	:
								var e = document.createElement('script');
								e.id	= id;
								e.type	= "text/javascript";
								e.src	= prefix + match_arr[2] + framework.extension_suffix;
								document.getElementsByTagName('head')[0].appendChild(e);
							break;
						}
					};
					return '';
				}
			}
		}
		
		this.view_par	= function(par,vars,tpl){
			var m;
			if(m = par.match(/^\s*vars(\-[a-zA-Z0-9]+|)\s*->\s*([a-z0-9\_\-]+)\s*$/)) {
				var f = m[1].subs(1,0);
				return (f && ( f in this.strFuncts ))
					? ((this.strFuncts[f])((m[2] in vars) ? vars[m[2]] : ''))
					: ((m[2] in vars) ? vars[m[2]] : '');
			};
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
			var replacers	= [];
			// {code}
		/*	if(this.controller.get("debug")) {
				console.log('Parse Template Code\n', { text : text });
			}
		*/	text = text.replace(/\{\{([\s\S]*?)\}\}/g,function (match, p1, offset, string) {
				var x	= '[[replacer-'+Math.floor(Math.random()*10000000)+'-'+Math.floor(Math.random()*10000000)+'-'+new Date().valueOf()+']]';
				replacers.push({ id : x, type : 'js-return', code : 'return '+p1 });
				return x;
			});
			text = text.replace(/\{(code|js\-return|eval|js\-script|css\-style)\}([\s\S]*?)\{\/\1\}/g,function (match, p1, p2, offset, string) {
				var x	= '[[replacer-'+Math.floor(Math.random()*10000000)+'-'+Math.floor(Math.random()*10000000)+'-'+new Date().valueOf()+']]';
				replacers.push({ id : x, type : p1, code : p2 });
				return x;
			});
		/*	if(this.controller.get("debug")){
				console.log('Parse Template Code + Replacers\n', { text : text, replacers : replacers });
			}
		*/
			var framework	= this;
			text = text.replace(/\{([^\{]*?)\}/g,function (match, p1, offset, string) {
				var val	= framework.view_par(p1,vars,tpl);
				return ( ( val === null ) ? '{'+p1+'}' : val );
			});
			text = text.replace(/\{([^\{]*?)\}/g,function (match, p1, offset, string) {
				var val	= framework.view_par(p1,vars,tpl);
				return ( ( val === null ) ? '{'+p1+'}' : val );
			});

			// var text	= text.split('{');
			// var par,val;
			// var i,e;for(i=1;i<text.length;i++) {
			// 	text[i]	= text[i].split('}');
			// 	if(text[i].length > 1) {
			// 		par	= text[i].shift();
			// 		// replace param
			// 		val	= this.view_par(par,vars,tpl);
			// 		if(val === null){
			// 			val	= '{'+par+'}';
			// 		}
			// 		text[i]	= ''+val+''+text[i].join('}');
			// 	}
			// };
			// text	= text.join('');

			if(this.controller.get("debug")){
				console.log('Parse Template Code + Replacer + Parsed Params\n', { text : text, replacers : replacers });
			}
			for(i=0;i<replacers.length;i++) try {
				switch(replacers[i].type) {
					case 'code':
						text = text.split(replacers[i].id).join(replacers[i].code);
					break;
					case 'js-return':
						eval("text = text.split(replacers[i].id).join((function(vars,tpl,framework){\n"+replacers[i].code+"\n})(vars,tpl,this))");
					break;
					case 'eval':
						var framework	= this;
						eval(replacers[i].code)
						text = text.split(replacers[i].id).join('');
					break;
					case 'js-script':
						text = text.split(replacers[i].id).join('<input type="hidden" m_framework_replacer_type="script" value="'+escape(replacers[i].code)+'" />');
					break;
					case 'css-style':
						text = text.split(replacers[i].id).join('<style type="text/css">\n'+replacers[i].code+'\n</style>');
					break;
				}
			} catch(e) {
				if(this.controller.get("debug")){
					console.error('ERROR Parse Template', { text : text, current_replacer : replacers[i], current_replacer_id : i, replacers : replacers },e);
				}
			}
		/*	if(this.controller.get("debug")){
				console.log('Parsed Template\n', { text : text });
			}
		*/	return text;
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
			};
			
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
						if(v != null)
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
			var e,i,k = false,time = new Date().valueOf();
			for(i in this.waitList){
				k	= false;
				try {
					if( this.waitList[i].timeout < time - this.waitList[i].created ) k = true;
					if( (this.waitList[i].cond)(this.waitList[i].vars,this) ) {
						k	= true;
						(this.waitList[i].func)(this.waitList[i].vars,this);
					};
				} catch ( e ) {
					if(this.controller.get("debug")){
						console.error("Condition Wait Error",this.waitList[i]," Error:",e);
					}
					k	= true;
				};
				if(k)	try {
					if(this.controller.get("debug")) {
						console.info("Deleting Query Wait",this.waitList[i]);
					}
					delete	this.waitList[i];
				} catch( e ) {
					if(this.controller.get("debug")) {
						console.error("Error deleting",this.waitList[i]," Error:",e);
					}
				}
			}
		};
		this.waitUntil	= function(func,cond,vars,timeout){
			if(!timeout)	timeout = 9000;
			var e,i;
			if(typeof(vars) == "undefined")	vars	= null;
			
			if(typeof(cond) == "number") cond	= ((function(c){ var r; eval("r = function(){ return (new Date().valueOf() > "+(new Date().valueOf() + c)+")}");return r;})(cond));
			
			if(typeof(cond) == "string") cond	= ((function(c){ var r; eval("r = function(vars,app){ return app.$(unescape('"+escape(c)+"'))}");return r;})(cond));
			
			if(typeof(func) == "function" && typeof(cond) == "function"){
				this.waitList_k	+= 1;
				this.waitList[this.waitList_k]	= {
					func	: func,
					cond	: cond,
					vars	: vars,
					timeout	: timeout,
					created	: new Date().valueOf()
				};
				if(this.controller.get("debug")) {
						console.info("Wait Query Exec: ",this.waitList[this.waitList_k]);
				}
			}
		};
		
		this.cronsTimer	= false;
		this.crons_k	= 0;
		this.crons	= {
			replacers_check	: function(){
				var list = document.querySelectorAll('input[m_framework_replacer_type="script"]');
				var i,n;
				for(i=0;i<list.length;i++) {
					n = document.createElement('script');
					n.type	= "text/javascript";
					n.text	= unescape(list[i].value);
					list[i].parentElement.insertBefore(n,list[i]);
					list[i].parentElement.removeChild(list[i]);
				}
			}
		};
		// adding to crons
		eval('this.crons.waitCheck	= function() { window["'+this.id+'"].waitCheck(); }');
		
		this.cronsEval	= function(){
			this.crons_k	+= 1;
			var i;for(i in this.crons) ((this.crons[i])(this.crons_k));
		}
		
		this.start	= function(){
			this.stop();
			eval('this.cronsTimer	= window.setInterval(function(){window["'+this.id+'"].cronsEval()},100);');
		}
		this.stop	= function(){
			var e;try {
				window.clearInterval(this.cronsTimer);
			} catch(e) {}
		}
		return this;
	}


// ┌───────────────────────────────────────────────────────────────────────────────────────────────┐ \\
// │ m_urlload - JavaScript url Content Loader                                                     │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright science © 2011 Sergiu Gordienco Vasile (http://first-jump.com)                      │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under http://creativecommons.org/licenses/by-nc-nd/3.0/ license.                     │ \\
// │ This work is licensed under the Creative Commons                                              │ \\
// │ Attribution-NonCommercial-NoDerivs 3.0 Unported License.                                      │ \\
// │ To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/3.0/.      │ \\
// └───────────────────────────────────────────────────────────────────────────────────────────────┘ \\

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('6.u=B(o,k){p r=[],i;5(!k)k="";5(1g.1h(o)&&k){v(i=0;i<o.C;i++)r.N(u(o[i],""+k+"["+i+"]"))}w 5(y(o)=="O"){v(i q o)r.N(u(o[i],""+k+(k?"[":"")+i+(k?"]":"")))}w 5(k){z""+k+"="+R(o)}z r.S(\'&\')};6.T=B(c,d,f,g,h,j,k,l,m){5(2===6)z G T(c,d,f,g,h,j,k,l,m);2.8=\'1i\'+G 1j().1k()+\'1l\'+Z.1m(Z.1n()*1o);6[2.8]=2;5(!f)f={};5(!k)k=(!h?\'H\':\'I\');5(!l)l=\'9\';p n={"U":"U","10":"10","11":"11","12":"12","9":"9","V":"U"};2.A=(l q n)?l:"9";2.W=f;2.X=k;2.J=c;2.13=d;2.D=(y(f)=="O"&&"D"q f&&y(f["D"])=="B"?f["D"]:Y);2.9=1p;2.14=!!m;2.E=(y(g)=="O"?g:{});2.F=(y(h)=="O"?h:{});2.P=B(){p e;K{1q(2.1r)}L(e){};K{p b=2.J,9=2.9,f=2.W,H=2.E,I=2.F,s=2.s,k=2.X;5(2.A=="V"){p i,a=G 15(2.7.Q),t="";v(i=0;i<a.C;i++)t+=16.17(a[i]%18);9=t};(2.13)(b,9,f,H,I,s,j,k,2.A,2.7)}L(e){};K{1s 6[2.8]}L(e){}};2.19=B(){5(!2.D)z Y;K{p b=2.J,9=2.9,f=2.W,H=2.E,I=2.F,s=2.s,k=2.X;5(2.A=="V"){p i,a=G 15(2.7.Q),t="";v(i=0;i<a.C;i++)t+=16.17(a[i]%18);9=t};(2.D)(b,9,f,H,I,s,j,k,2.A,2.7)}L(e){1t.1u(\'T » P\',e)}};2.7=G 1v();p r=[];p i;5(\'u\'q 6){r=u(2.E)}w{v(i q 2.E)r.N(i+\'=\'+R(\'\'+2.E[i]));r=r.S(\'&\')};2.s=2.J+(r.C?(2.J.1w(\'?\')==-1?\'?\':(r.C?\'&\':\'\')):\'\')+r;5(2.14){2.7.1a=M;2.7.1b(k,2.s,M)}w{5(y(m)=="1c"){2.7.1a=M}2.7.1b(k,2.s)}2.7.A=n[2.A];5(\'u\'q 6){r=u(2.F)}w{r=[];v(i q 2.F)r.N(i+\'=\'+R(\'\'+2.F[i]));r=r.S(\'&\')};5(y(j)==="1c"){K{2.7.1d("1x-1y","1z/x-1A-1B-1C; 1D=1E-1F-1")}L(i){}}5(j){v(i=0;i<j.C;i++)2.7.1d(j[i].1G,j[i].1H)};1I("2.7.1J = B() {p 8 = \\""+2.8+"\\";5(!(8 q 6)) z Y;\\n		5(6[8].7.1e == 4){6[8].9	= 6[8].7.Q;6[8].P();}\\n		w 5(6[8].7.1e == 3){6[8].9	= 6[8].7.Q;6[8].19();}\\n		w 5( (\'1f\' q 6[8] ) && ( 6[8].1f == 1K ) ) {6[8].P();}	z M; }");2.7.1L(r);z M}',62,110,'||this|||if|window|link|id|text||||||||||||||||var|in||fullUrl||objEncodeURL|for|else||typeof|return|responseType|function|length|onloading_f|get_data|post_data|new|get|post|url|try|catch|true|push|object|endEval|response|encodeURIComponent|join|m_urlload|arraybuffer|binary|vars|method_r|false|Math|blob|document|json|onload_f|sessionConnected|Uint8Array|String|fromCharCode|256|tmpEval|withCredentials|open|undefined|setRequestHeader|readyState|status|Array|isArray|load_urldata_|Date|valueOf|_|floor|random|1000000|null|clearInterval|timer|delete|console|error|XMLHttpRequest|indexOf|Content|Type|application|www|form|urlencoded|charset|ISO|8859|name|value|eval|onreadystatechange|404|send'.split('|'),0,{}));