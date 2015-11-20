/*
*	default controler
*/
{
	_	: function(controller,action,param,data,app){
		
	},
	tpl	: function(c,a,p,data,app){
		var i,k,vars	= {};
		for(i=1;i<p.length;i++){
			p[i]	= p[i].split('=');
			k = p[i].shift();
			if(k)
				vars[k]	= p[i].join('=');
		};
		app.framework.view(function(text,app,sett,tpl){
var d	= app.$('#container-devTpl-table')
window.onDevEditorText	= text;
window.onDevEditorTPL	= tpl;
window.onDevEditorTPLv	= vars;
window.onDevEditorTPLs	= sett ? sett : null;
if(!d){
	window.onDevEditorLoaded	= function(b){
		setTimeout(function(){
			app.$('#container-devTpl-code').setText(window.onDevEditorText);
			app.$('#container-devTpl-code-tpl').setText(window.onDevEditorTPL.text);
			var e,b = true;
			if(b)try {
				app.$('#container-devTpl-html').document.body.innerHTML	= window.onDevEditorText;
				b = false;
			} catch(e){
				b = true;
			}
			
			
			if(b)try {
				app.$('#container-devTpl-html').contentWindow.document.body.innerHTML	= window.onDevEditorText;
				b = false;
			} catch(e){
				b = true;
			}
			
			
			var j,i = [];
			for(j in window.onDevEditorTPLv)	i.push(''+j+'\t= '+window.onDevEditorTPLv[j]);
			
			app.$('#container-devTpl-params').value	= '; Params: \n; param\t= value\n\n'+i.join('\n')
			
			app.$('#container-devTpl-params').onblur	= function(){
				var s = this.value.split('\n');
				
				var m,i,v = {};
				for(i=0;i<s.length;i++)
					if(m = s[i].match(/^\s*([a-zA-Z0-9\-\_]+)\s*\=\s(.*)/))
						v[m[1]]	= m[2];
				
				window.onDevEditorTPLv	= v;
				
				
				
				app.view(function(text,app,sett,tpl){
					window.onDevEditorText	= text;
					onDevEditorLoaded(true);
				},{text:app.$('#container-devTpl-code-tpl').getText()},window.onDevEditorTPLv,window.onDevEditorTPLs);
			}
			
			if(!b)	{
				(app.$('#container-devTpl-params').onblur)()
			}
			
			
			try{
				app.$('#container-devTpl-params').spellcheck = false;
			} catch(j) {}
			
			app.$('#container-devTpl-update').onclick	= function(){
				var code	= app.$('#container-devTpl-code-tpl').getText();
				window.onDevEditorTPL.text	= code;
				app.view(function(text,app,sett,tpl){
					window.onDevEditorText	= text;
					onDevEditorLoaded(true);
				},{text:code},window.onDevEditorTPLv,window.onDevEditorTPLs);
			}
		},1000);
	}
	var path_objects	= app.controller_dir+'dev/tpl/objects/';
	app.$('#container').innerHTML	= '\
<table width="100%" height="100%" id="container-devTpl-table" cellspacing="10" cellpadding="10" style="background: #c0c0c0;">\
<tr valign="top">\
<td width="400px" align="left">\
<span style="color:#fff;text-shadow: 0 0 6px #000;font-weight: bold;line-height: 50px;font-size: 20px;">DEV Controller - Template Testing</span>\
<textarea style="text-align:left;background: #fff;border: 1px solid #efefef;padding: 10px;width:100%;height:300px;" id="container-devTpl-params">\
; Params\
\
\
\
\
</textarea>\
</td>\
<td align="center" style="background: #efefef;">\
	<table width="100%" height="100%" id="container-devTpl-table" cellpadding="10">\
		<tr valign="top">\
		<td colspan="2">\
			<iframe src="about:blank" style="text-align:left;background: #fff;border: 1px solid #c0c0c0;padding: 0px;margin-bottom:0px;width:100%;height:100%;" id="container-devTpl-html"></iframe>\
		</td>\
		</tr>\
		</tr>\
		<tr height="270">\
		<td width="50%" align="left" style="background: #fff;border: 1px solid #c0c0c0;"><div style="position:relative;"><div style="padding:9px;font-weight:bold;">Template Code: <span style="font-weight:normal;text-decoration:underline;cursor:pointer;" id="container-devTpl-id">'+tpl.id+''+app.templates_extension+'</span></div>\
			<button style="position: absolute;top:3px;right:3px;" id="container-devTpl-update">Update View</button>\
		<object width="100%" height="270" type="application/x-shockwave-flash" id="container-devTpl-code-tpl" name="container-devTpl-code-tpl" data="'+path_objects+'editor/CodeHighlightEditor.swf?now='+(1 ? 1 : new Date().valueOf())+'"><param name="menu" value="true"><param name="allowscriptaccess" value="always"><param name="flashvars" value="parser=html&amp;readOnly=false&amp;preferredFonts=|Consolas|Courier New|Courier|Arial|Tahoma|&amp;onload=onDevEditorLoaded2"></object>\
		</div>\
		</td>\
		<td width="50%" align="left" style="background: #fff;border: 1px solid #c0c0c0;"><div style="padding:9px;font-weight:bold;">Compiled Code</div>\
		<object width="100%" height="270" type="application/x-shockwave-flash" id="container-devTpl-code" name="container-devTpl-code" data="'+path_objects+'editor/CodeHighlightEditor.swf?now='+(1 ? 1 : new Date().valueOf())+'"><param name="menu" value="true"><param name="allowscriptaccess" value="always"><param name="flashvars" value="parser=html&amp;readOnly=false&amp;preferredFonts=|Consolas|Courier New|Courier|Arial|Tahoma|&amp;onload=onDevEditorLoaded"></object>\
		</td>\
		</tr>\
	</table>\
</td>\
</tr>\
</table>\
';

} else {
	window.onDevEditorLoaded();
}

		
		}, p[0], vars);
	}
}
