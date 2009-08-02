if (typeof CD3 == 'undefined'){ CD3 = { UI: {} }; } else if (!CD3.UI){ CD3.UI = {};}

CD3.UI.Upload = Class.create({
	initialize: function(options, events){
		options = new Hash(Object.extend({
			// swf file options
			swf:				null,
			overlay:			null,
			width:				1,
			height:				1,
			insertInto:			null,
			
			// uploader options
			url:				null,
			data:				null,
			fileName:			'file',
			timeLimit:			0,
			minSize:			0,
			maxSize:			0,
			types:				null,
			allowDuplicates:	false,
			trace:				false
		}, options));
		
		this.id			= 'id_' + (++this.constructor.UID);
		this.object		= this.constructor.createObject(this.id, options);

		this.object.observe('cd3:upload:initialized', function(){
			this.remote('initialize', options.toObject());
		}.bind(this));
		
		if (options.get('overlay')){
			this.clonePosition(options.unset('overlay'));
		}
		
		if (options.get('insertInto')){
			$(options.unset('insertInto')).appendChild(this.object);
		}
		
		this.constructor.instances[this.id] = this;
		
		if (events) this.observe(events);
	},
	remote: function(func){
		this.object.CallFunction('<invoke name="' + func + '" returntype="javascript">' + 
			(arguments.length > 1 ? __flash__argumentsToXML(arguments, 1) : '') + 
		'</invoke>');
	},
	start: function(){
		this.remote('start');
	},
	remove: function(id){
		this.remote('remove', parseInt(id));
	},
	stop: function(){
		this.remote('stop');
	},
	fire: function(name, options){
		this.object.fire('cd3:upload:' + name, options);
	},
	observe: function(event, callback){
		if (arguments.length == 2){
			this.object.observe('cd3:upload:' + event, callback.bind(this));
		} else {
			for(var name in event){
				this.object.observe('cd3:upload:' + name, event[name].bind(this));
			}
		}
		return this;
	},
	clonePosition: function(element){
		this.object.clonePosition(element);
		this.object.style.position = 'absolute';
		this.object.width  = parseInt(this.object.style.width);
		this.object.height = parseInt(this.object.style.height);
	},
	toElement: function(){
		return this.object;
	}
});
CD3.UI.Upload.UID = 0;
CD3.UI.Upload.instances = {};
CD3.UI.Upload.createObject = function(id, options){
	var src = options.unset('swf');
	
	if (!src){
		throw "Please provide path to the swf file";
	}
	
	var attributes = {
			width:	options.unset('width')  || 1,
			height: options.unset('height') || 1
		},
		params = {
			wMode:				'transparent',
			menu:				'false',
			allowScriptAccess:	'always',
			swLiveConnect:		'true',
			quality:			'high',
			flashVars:			Object.toQueryString({
				callback: 'CD3.UI.Upload.instances.' + id + '.fire'
			})
		};
		
	// data/type
	if (window.ActiveXObject){
		attributes.classid	= 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
		params.movie		= src;
	} else {
		attributes.type = 'application/x-shockwave-flash';
		attributes.data = src;
	}

	// object
	var object = new Element('object', attributes);
	for (var param in params){
		object.appendChild( new Element('param', {name: param, value: params[param]}) );
	}
	
	return object;
};