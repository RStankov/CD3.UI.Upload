CD3.UI.Upload
=========

ControlDepo 3 UI Upload is multiple file uploader via flash, build on top of Prototype.js

CD3.UI.Upload provides the most basic features handling uploads via flash . It's main purpose it to be used as ground for extensions and plugins. The only requirement is [Prototype.js](http://www.prototypejs.org/download) (witch can be downloaded from [here](http://www.prototypejs.org/download)).

## Options:
<table>
	<tr>
		<td>Name</td>
		<td>Default</td>
		<td>Description</td>
	</tr>
	<tr>
		<td>swf</td>
		<td>null</td>
		<td>[REQUIRED] the path to the uploader.swf used for uploading ( most of the time a working version of uploader.swf could be found <a href="http://github.com/RStankov/CD3.UI.Upload/downloads">here</a> )</td>
	</tr>
	<tr>
		<td>overlay</td>
		<td>null</td>
		<td>element or element id of the element, who's position will be cloned and uploader.swf will be positioned over</td>
	</tr>
	<tr>
		<td>width</td>
		<td>1</td>
		<td>starting width of the swf button</td>
	</tr>
	<tr>
		<td>height</td>
		<td>1</td>
		<td>starting height of the swf button</td>
	</tr>
	<tr>
		<td>insertInto</td>
		<td>null</td>
		<td>element in witch uploader.swf will be inserted, if not specified it will have to be inserted manually</td>
	</tr>
	<tr>
		<td>url</td>
		<td>null</td>
		<td>[REQUIRED] URL to the server-side script</td>
	</tr>
	<tr>
		<td>data</td>
		<td>null</td>
		<td>additional data for the upload request ( example: {product_id: 1} )</td>
	</tr>
	<tr>
		<td>fileName</td>
		<td>'file'</td>
		<td>File name for the upload ( just like name attribute of input type file )</td>
	</tr>
	<tr>
		<td>timeLimit</td>
		<td>0</td>
		<td>Timeout, how many seconds to way for server response.</td>
	</tr>
	<tr>
		<td>minSize</td>
		<td>0</td>
		<td>Min size of a single file</td>
	</tr>
	<tr>
		<td>maxSize</td>
		<td>0</td>
		<td>Max size of a single file</td>
	</tr>
	<tr>
		<td>types</td>
		<td>null</td>
		<td>Filters for the files, all valid types. Can be a string ( '*.jpg; *.jpeg; *.gif; *.png' ) or object ( { 'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png' } )</td>
	</tr>
	<tr>
		<td>allowDuplicates</td>
		<td>false</td>
		<td>Can one file be uploaded twice</td>
	</tr>
	<tr>
		<td>trace</td>
		<td>false</td>
		<td>Debuging option, flash will call console.log</td>
	</tr>
</table>

## Events
<table>
	<tr>
		<td>Event<td>
		<td>Event.memo</td>
		<td>Description</td>
	</tr>
	<tr>
		<td>cd3:upload:initialize<td>
		<td> </td>
		<td>Fired when swf object is added to the document</td>
	</tr>
	<tr>
		<td>cd3:upload:select<td>
		<td>files, queue</td>
		<td>Fired when files are selected</td>
	</tr>
	<tr>
		<td>cd3:upload:start<td>
		<td>id, file, queue</td>
		<td>Fired when upload have started</td>
	</tr>
	<tr>
		<td>cd3:upload:progress<td>
		<td>id, file, queue, percent, percentTotal</td>
		<td>Fired as upload progresses</td>
	</tr>
	<tr>
		<td>cd3:upload:completed<td>
		<td>id, file, queue, responseText</td>
		<td>Fired when file upload have completed succesfully</td>
	</tr>
	<tr>
		<td>cd3:upload:error<td>
		<td>id, file, queue, message, code</td>
		<td>Fired when an error occurs on uploading</td>
	</tr>
	<tr>
		<td>cd3:upload:empty<td>
		<td></td>
		<td>Fired when start method called with no files selected</td>
	</tr>
	<tr>
		<td>cd3:upload:removed<td>
		<td>queue</td>
		<td>Fired after file was removed from the quque</td>
	</tr>
	<tr>
		<td>cd3:upload:mouseover<td>
		<td></td>
		<td>Fired on mouseover</td>
	</tr>
	<tr>
		<td>cd3:upload:mouseout<td>
		<td></td>
		<td>Fired on mouseover</td>
	</tr>
</table>

## Public API:

<table>
	<tr>
		<td>start()</td>
		<td>Start uploading all selected files</td>
	</tr>
		<td>remove(id)</td>
		<td>Remove file from upload queue (by its id)</td>
	</tr>
		<td>stop()</td>
		<td>Stops the current upload queue</td>
	</tr>
		<td>observe(event, callback)</td>
		<td>Observe events on the flash, given events are just initialize, select, progress, ... (with no cd3:upload)</td>
	</tr>
		<td>observe({event: callback, ...})</td>
		<td>Observe can be call with multiple events and callbacks</td>
	</tr>
		<td>clonePosition(element)</td>
		<td>Swf object clones the position of the given element</td>
	</tr>
		<td>toElement</td>
		<td>Returns reference to swf object  (primary to be used by Element#insert)</td>
	</tr>
</table>

## Notes:

CD3.UI.Upload currently is alpha version and is only tested on MacOS X in Firefox 3.5 and Safary 4.

## Example usage

	var up = new CD3.UI.Upload({
		swf:		'/flash/uploader.swf',
		url:		'/upload.php',
		types:		{ 'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png' },
		overlay:	'browse',
		insertInto: 'upload_set'
	}, {
		'select': MyCustomUpload.onSelect,
		'progress': MyCustomUpload.onProgress,
		'completed': MyCustomUpload.onCompleted,
		'error': MyCustomUpload.onError
	});

## Demo:

The demo could be found in showcases/basic in this repo. 
The only requirement is that uploader.fla is compiled to uploader.swf and the path is set in showcases/basic/basic.js

## Contributing to CD3.UI.Upload

The CD3.UI.Upload source code is hosted on [GitHub](http://github.com/).

    $ http://github.com/RStankov/CD3.UI.Upload/tree/master
    
You can fork the CD3.UI.Upload project on GitHub, commit your changes, and [send me a pull request](http://github.com/guides/pull-requests). All patches are welcomed :)
