


var fs = require('fs');
var xlsx = require('node-xlsx');
var _  = require('underscore');
var child = require('child_process');
ls = child.exec('logname');


ls.stdout.on('data',function(data){
  var usr_name = data.replace(/\r|\n/g,'');
  //path languages_zhcn.js 
  var __dirname = '';
  var file_buffer = fs.readFileSync(__dirname + './languages_zhcn.js');
  var sheetObj = [[
         {"value":"value","formatCode":"General"},
         {"value":"comment","formatCode":"General"},
         {"value":"translation","formatCode":"General"}
  ]];
  var json = JSON.parse(file_buffer.toString());
  _.each(json.values, function(obj, index){
        var value = obj.value || '',
            comment = obj.comment || '',
            translation = obj.translation || '';
        var i = index + 1;
        sheetObj[i] = [];
        sheetObj[i].push(value);
        sheetObj[i].push(comment);
        sheetObj[i].push(translation);
  });
      
  var buffer = xlsx.build({worksheets:[
        {
            name:"i18n",
            data: sheetObj
        }
  ]});
  var option = {
      flags:'w',
      encodeing:'utf-8',
      mode:'0666'
  };

  var fw_stream_tw = fs.createWriteStream( __dirname + './lauguage.xlsx',option);
  fw_stream_tw.write(buffer);
});
