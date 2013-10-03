var fs = require('fs');
var Buffer = require('buffer').Buffer;

var bundlesDir = '//alex/agfs/arcgisserver/directories/arcgiscache';
function Pad(num, zoom, type){
	var padding = ((zoom>17 && type=="R") || (zoom>18 && type=="C")) ? 5 : 4;
	while(num.length<padding)
	{
		num = "0" + num;
	}
	return type + num;
}

function calcOffset(buffer){
	 return (buffer[0] & 0xFF) + (buffer[1] & 0xFF) 
		* 256
		+ (buffer[2] & 0xFF)
		* 65536
		+ (buffer[3] & 0xFF)
		* 16777216
		+ (buffer[4] & 0xFF)
		* 4294967296;
}

function calcLength(buffer){
	return (buffer[0] & 0xFF) + (buffer[1] & 0xFF) 
		* 256
		+ (buffer[2] & 0xFF)
		* 65536
		+ (buffer[3] & 0xFF)
		* 16777216;
}

exports.getBundleTile = function (s,z,x,y,callback){

	var zoom = "L" + ((z < 10) ? "0" + z : ""+z);

	var _qe = 1 << z;
	var _ne = (_qe > 128) ? 128 : _qe;

	var bundle_filename_col = parseInt(Math.floor(x/_ne)*_ne);
	var bundle_filename_row = parseInt(Math.floor(y/_ne)*_ne);

	var filename=Pad(bundle_filename_row.toString(16),z, "R")+Pad(bundle_filename_col.toString(16),z,"C");

	var bundlxFileName = bundlesDir +"/" + s + "/Layers/_alllayers/" + zoom + "/" + filename + ".Bundlx";
	var bundleFileName = bundlesDir +"/" + s + "/Layers/_alllayers/" + zoom + "/" + filename + ".Bundle";

	var col = x - bundle_filename_col;
	var row = y - bundle_filename_row;

	var index = 128 * col + row;

	fs.open(bundlxFileName, 'r', function(err, fd) {
		if(err){return callback(err, null);}
		
		var buffer = new Buffer(5);
		fs.read(fd, buffer, 0, 5, (16 + 5 * index), function(err, num) {
		
			if(err){return callback(err, null);}
			
			var offset = calcOffset(buffer);
			fs.open(bundleFileName, 'r', function(err, fd) {
			
				if(err){return callback(err, null);}
				
				var tile_length = new Buffer(4);
				
				fs.read(fd, tile_length, 0, 4, offset, function(err, num) {
				
				if(err){return callback(err, null);}
				
				var t_length = calcLength(tile_length);
				var result = new Buffer(t_length);
				if(t_length==0){ return callback('barf',null);}
				fs.read(fd, result, 0, t_length, null, function(err, num){
					if(err){return callback(err, null);}
				
					return callback(null, result);
					});
				})
			});
		});
	});
};
