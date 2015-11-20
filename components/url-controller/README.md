# url-controller
JavaScript URL Controller
```js
// ┌───────────────────────────────────────────────────────────────────────────────────────────────┐ \\
// │ m_urlcapture - JavaScript urlController                                                       │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2011-2018 Sergiu Gordienco Vasile (http://sgapps.io ; http://fist-jump.com )      │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under http://creativecommons.org/licenses/by-nc-nd/3.0/ license.                     │ \\
// │ This work is licensed under the Creative Commons                                              │ \\
// │ Attribution-NonCommercial-NoDerivs 3.0 Unported License.                                      │ \\
// │ To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/3.0/.      │ \\
// └───────────────────────────────────────────────────────────────────────────────────────────────┘ \\
```

## to create an urlController

```js
    var urlController   = new m_urlcapture();
```

## to init it type:

```js
    urlController.start();
```

## to stop it type:

```js
    urlController.stop();
```

## to set an Default action for url Change

```js
    urlController.set("ifNoAction",function(controller,action,param,data){
        // data is an object .. ex: {url:"..string..",parts:[controller,action,param[0]...]}
    })
```

## to enable/disable debug mode use ( default is disabled )

```js
    urlController.set("debug",true);
```

## to set default Controller Name

```js
    urlController.set("defController","public");
```

## to set default action name
```js
    urlController.set("defAction","exec");
```

## to get params from object

```js
    urlController.get("debug");     // to get debug state
    urlController.get("defController"); // get default controller name
    urlController.get("defAction");     // get default action name
    urlController.get("urlHist");       // get History of URLS
    urlController.get("ifNoAction");    // get function if no Action
    
    // geting id
        var id = urlController.get("id");
        
        alert(window[id] == urlController) // it will return TRUE
    
    // geting an controller actions set
        var controller_set = urlController("actions","controller_name");
    
    // geting an action function
        var action_func = urlController("actions","controller_name","action_name");
```

## to clean actions list

```js
    urlController.set("actions",{act:"clean"});
```

## to clean actions from a specific controller

```js
    urlController.set("actions",{
                act     : "del-controller"
                controller  : "controller_name"
            });
```

## to delete an action

```js
    urlController.set("actions",{
                act     : "del-action",
                controller  : "controller_name",
                action      : "action_name"
            });
```

## to add actions

```js
    urlController.set("actions",{
                act : "add",
                data    : {
                    controller_name : {
                        action_name : function(){},
                        action_name_1   : function(){},
                        action_name_2   : function(){}
                    },
                    otherController : {
                        // other actions
                    }
                }
            });
```

## updating function for onUrlChange and afterUrlChange

```js
urlController.set("onUrlChange",{
    funct_1 : function(c,a,p,d){    // adding a function
        ...
    },
    funct_1 : null          // deleting a function
})

urlController.set("afterUrlChange",{
    ... the same as for onUrlChange,
    funct_1 : function(c,a,p,d){    // adding a function
        if(d.obj.onUrlDiff_noSkip) {    // controller is no found
            d.obj.onUrlDiff_noSkip  = false; // disable default action
        }
    }
})
```
