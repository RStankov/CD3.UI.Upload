(function(){
	var up = new CD3.UI.Upload({
		swf:		'../../src/flash/uploader.swf',
		url:		'../../showcases/basic/upload.php',
		types:		{ 'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png' },
		overlay:	'browse',
		insertInto: 'upload_set'
	});

	var events = {
		'#upload':	function(){ up.start(); },
		'#stop':	function(){ up.stop();  },
		'.remove':	function(){ up.remove(this.getAttribute('data-id')); this.up('li').remove(); }
	};
	
	for(var selector in events){
		document.delegate(selector, 'click', events[selector]);
	}
	
	Number.prototype.sizeFormat = function(){
		if (this <= 0) return '';
		
		var index = Math.floor(Math.log(this)/Math.log(1024));

		return Math.round((this / Math.pow(1024, index)) * 10)/10 + 
			[' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'][index];
	};
	
	up.observe({
		'select': function(e){
			/*
			<li>
				<h3>test.jpg (390KB)</h3>
				<span class="remove">remove</span>
				<div class="bar">
					<div class="percent"></div>
				</div>
			</li>
			*/
			var ul = $('files');
			(e.memo.files || []).each(function(file){
				ul.insert(new Element('li', { id: 'file_' + file.id}).insert([
					new Element('span', { className: 'remove', 'data-id': file.id }).update('remove'),
					new Element('h3').update(file.name + ' (' +  (+file.size).sizeFormat() + ')'),
					new Element('div', {className: 'bar'}).insert(new Element('div', {className: 'percent'}).setStyle({width: '1px'}))
				]));
			});
		},
		'progress': function(e){
			var file = $('file_' + e.memo.id);
			if (file) file.down('.percent').style.width = (e.memo.percent || 1) - 1 + '%';
		},
		'completed': function(e){
			var file = $('file_' + e.memo.id);
			if (file) file.remove();
		},
		'error': function(e){
			alert(e.memo.error);
		}
	});
	
})();