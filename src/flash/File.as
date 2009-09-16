﻿package {
	import flash.events.*;
	import flash.utils.Timer;
	
	import flash.net.FileReference;
	import flash.net.URLRequest;
	
	class File {
		static var idCounter = 1;
		
		static const STATUS_QUEUED:uint		= 0;
		static const STATUS_RUNNING:uint	= 1;
		static const STATUS_ERROR:uint		= 2;
		static const STATUS_COMPLETE:uint	= 3;
		static const STATUS_STOPPED:uint	= 4;
		
		public var reference:FileReference;
		
		private var timeout:Timer;
		
		private var status:uint;
		
		private var parent:FilesQueue;
		
		public var id:uint;
		
		public function File(queue:FilesQueue, file:FileReference):void {
			parent		= queue;
			reference	= file;
			id			= idCounter++;
			status		= STATUS_QUEUED
			
			reference.addEventListener(ProgressEvent.PROGRESS,				parent.progress);
			reference.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA,		handleComplete);
			reference.addEventListener(IOErrorEvent.IO_ERROR,				handleError);
			reference.addEventListener(SecurityErrorEvent.SECURITY_ERROR,	handleError);

			if (parent.options.timeLimit){
				timeout = new Timer(parent.options.timeLimit * 1000, 1);
				timeout.addEventListener('timer', handleTimeout);
				
				reference.addEventListener(Event.OPEN, 				resetTimer);
				reference.addEventListener(ProgressEvent.PROGRESS,	resetTimer);
			}
		}
		
		public function destroy():void {
			reference.removeEventListener(ProgressEvent.PROGRESS,				parent.progress);
			reference.removeEventListener(DataEvent.UPLOAD_COMPLETE_DATA,		handleComplete);
			reference.removeEventListener(IOErrorEvent.IO_ERROR,				handleError);
			reference.removeEventListener(SecurityErrorEvent.SECURITY_ERROR,	handleError);
			
			if (timeout){
				timeout.removeEventListener('timer', handleTimeout);
				timeout = null;
				
				reference.removeEventListener(Event.OPEN, 				resetTimer);
				reference.removeEventListener(ProgressEvent.PROGRESS,	resetTimer);
			}
			
			reference = null;
		}
		
		private function resetTimer(e:Event = null):void {
			timeout.reset();
			timeout.start();
		}
	
		private function handleComplete(e:DataEvent):void {
			complete(e.data);
		}
		
		private function handleError(e:ErrorEvent):void {
			complete(e.text, e.type);
		}
		
		private function handleTimeout(e:TimerEvent):void {
			if (stop()) complete('Timeout reached', 'timeout');
		}
		
		private function complete(text:String = null, error:String = null){
			if (!isRunning) return;
			
			if (timeout) timeout.stop();
			
			if (error){
				parent.error(error, text);
				status = File.STATUS_ERROR;
			} else {
				parent.uploaded(text);
				status = File.STATUS_COMPLETE;
			}
		}
		
		public function start():Boolean {
			if (isRunning) return false;
						
			try {
				status = File.STATUS_RUNNING;
				
				reference.upload(Utils.request(parent.options), parent.options.fileName || 'file');
			} catch (e:Error) {
				status = File.STATUS_ERROR;
				stop();
				return false;
			}
			
			return true;
		}
		
		public function stop():Boolean {
			if (isRunning) return false;
			if (timeout) timeout.stop();
			
			reference.cancel();
			status = File.STATUS_STOPPED;
						
			return true;
		}
		
		public function get isRunning(){
			return status == File.STATUS_RUNNING;
		}
		
		public function get isValid():Boolean {
			if (!parent.options.allowDuplicates && parent.hasFile(this)) {
				return false;
			}

			if (parent.options.minSize > 0 && reference.size < parent.options.minSize) {
				return false;
			}
			
			if (parent.options.maxSize > 0 && reference.size > parent.options.maxSize) {
				return false;
			}
			
			return true;
		}
		
		public function get size():uint {
			return reference.size;
		}
		
		public function export():Object {
			return {
				id: 				id,
				name:				reference.name,
				size: 				reference.size,
				modificationDate:	reference.modificationDate,
				creationDate:		reference.creationDate,
				extension:			reference.name.replace(/.+\.([^.]+)$/, '$1').toLowerCase(),
				status: 			status
			};
		}
	}
}