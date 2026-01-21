var Configs = require('../public/config.js');
var myconfig = new Configs();
var crypto = require('crypto'); 
var DBs =require('./dbs/DBS');
const { forEach } = require('lodash');
var ObjectID = require("mongodb").ObjectID;
var excel = require('excel4node');

// Create a new instance of a Workbook class


function ExcelWorkbook(openfor,params) {

    this.workbook = new excel.Workbook();
    this.styles = {}
    // Add Worksheets to the workbook
    var worksheet = workbook.addWorksheet('Sheet 1');
    var worksheet2 = workbook.addWorksheet('Sheet 2');

    switch (openfor) {
        case 'Read Local file':
            
            break;

        case 'Create Report':
            
        
        if(params['styles']){

            params['styles'].forEach( function(s) { 
                this.styles[s.name] = workbook.createStyle(s.value)
            })
        } else {
            this.styles['default'] = workbook.createStyle({
                font: {
                  color: '#0000FF',
                  size: 12
                },
                numberFormat: '#,##0.00; (#,##0.00); -'
              })
        }

        if(params['designs']){

            this.designs = params['designs']
             
        } else {
            this.designs = {"header":[{"Detail":[]}]
                            ,"footer": [] }
        }

        if(params['code']){

            this.render = eval(params['code']) 
             
        } else {
            this.render = function (){
                return 
            }
        }


// Create a reusable style


            break;
       
        default:
            break;
    }

    var _tokenpath = UserToken.split('/')[1]
  
    this.UserToken=_tokenpath
    this.UserId = getUserID(_tokenpath)
    this.Token = getToken(_tokenpath)
    this.sessionid = getSession(_tokenpath)
    this.DBName =getCurrentDB(this.Token);
    
  }
  





module.exports = ExcelWorkbook;