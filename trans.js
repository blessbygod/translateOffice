


var fs = require('fs');
var xlsx = require('node-xlsx');
var _  = require('underscore');
var child = require('child_process');
ls = child.exec('logname');


ls.stdout.on('data',function(data){
  var usr_name = data.replace(/\r|\n/g,'');
  //path cn-big5.xlsx
  var __dirname = '/Users/' + usr_name +'/Downloads';
  var file_buffer = fs.readFileSync(__dirname + '/cn-en-big5.xlsx');
  var xlsx_file_obj = xlsx.parse( file_buffer ); 

  var zh_cn = {},
  en_us = {},
  zh_tw = {};
  _.each( xlsx_file_obj.worksheets ,function(sheet,index){
    var sheet_data = sheet.data;
   // if(index!==5)return;
    try{
      var sheet_key = sheet_data[0][0].value;
      zh_cn[sheet_key] = {};
      en_us[sheet_key] = {};
      zh_tw[sheet_key] = {};
      _.each( sheet_data,function( row,row_index ){
        var keyObj = row[0];
        var value = _.isObject( keyObj ) && keyObj.value;
        //如果第一列的值不为空
        if( row_index > 1 && _.isString(value)){
          var key = value.replace(/^\s+|\s+$/g,'');
          if(key){
            var cnstr = _.isObject(row[1]) ? ( row[1].value || '' ) : '';
            var enstr = _.isObject(row[2]) ? ( row[2].value || '' ): '';
            var twstr = _.isObject(row[3]) ? ( row[3].value || '' ): '';
            zh_cn[sheet_key][key] = cnstr;
            en_us[sheet_key][key] = enstr;
            zh_tw[sheet_key][key] = twstr;
            if( cnstr.length !== twstr.length){
                console.log( row_index + '、' +  sheet_key + '== ' + key  + '===');
                console.log(cnstr);
                console.log(twstr);
                console.log('\r\n');
            }
          }else{
            console.dir(row);
          }
        }
      });
    }catch(e){
      console.log( e.message );
      //console.log( 'sheet_key:' + sheet_key );
      //console.log( 'error row object: ' + JSON.stringify(sheet_data[0]) );
    } 
  });
  var option = {
    flags:'w',
    encodeing:'utf-8',
    mode:'0666'
  };
  
  var fw_stream_cn = fs.createWriteStream( __dirname + '/zh-cn.js',option);
  fw_stream_cn.write( 'App.I18n = ' + JSON.stringify( zh_cn ));

  var fw_stream_en = fs.createWriteStream( __dirname + '/en-us.js',option);
  fw_stream_en.write( 'App.I18n = ' + JSON.stringify( en_us ));

  var fw_stream_tw = fs.createWriteStream( __dirname + '/zh-tw.js',option);
  fw_stream_tw.write( 'App.I18n = ' + JSON.stringify( zh_tw ));
});
