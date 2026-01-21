

import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Input, OnInit} from '@angular/core';
import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
 
  level: number;    
  children?: FoodNode[];
}
var isObject = function (params:any):boolean {
  return typeof(params)=='object'
} ;

export class JSONTreeNode {
     
  constructor( public name: string ,
                public key:string)
                {  }
  value:any;
  typeOfvalue?: string;
  children?: JSONTreeNode[];
  lastchild? : boolean;
  showvalue? : boolean;
  showedit? : boolean;
  showAddChild? : boolean;
  showdelete? : boolean;
  showcopy? : boolean;
  showTag? : boolean;
  Tag?:any;
  button? :any;
  hide? :any;
  childloaded? : boolean;
}
const TREE_DATA: JSONTreeNode[] = [
{
"name": "Manufacturing Excellence Award",
"value": 0,
"key": "Manufacturing Excellence Award",
"children": [
{ "name": "1st Winner",  "value": 1,"key":"1st Winner" },
{ "name": "2nd Winner",  "value": 1 , "key": "1" },
{ "name": "3rd Winner",  "value": 1 , "key": "1" },
{ "name": "Admire Winner",  "value": 1 , "key": "1" },
{ "name": "Admire Winner",  "value": 1 , "key": "1" },
{ "name": "Admire Winner",  "value": 1 , "key": "1" }
]
},
{
"name": "Service and Office Excellence Award",
"value": 0,
"key": "Manufacturing Excellence Award",
"children": [
{ "name": "1st Winner",  "value": 1 , "key": "1" },
{ "name": "2nd Winner",  "value": 1 , "key": "1" },
{ "name": "3rd Winner",  "value": 1 , "key": "1" },
{ "name": "Admire Winner",  "value": 1 , "key": "1" },
{ "name": "Admire Winner",  "value": 1 , "key": "1" },
{ "name": "Admire Winner",  "value": 1 , "key": "1" }
]
},
{
"name": "AGC Chemicals President Award",
"value": 0,
"key": "Manufacturing Excellence Award",
"children": [
{ "name": "CEO Award",  "value": 1 , "key": "1" },
{ "name": "Gold Award",  "value": 1 , "key": "1" },
{ "name": "Silver Award",  "value": 1 , "key": "1" },
{ "name": "Bronze Award",  "value": 1 , "key": "1" },
{ "name": "Special Award",  "value": 1 , "key": "1" }
]
}
];


 const  FORM_DATASOURCES: any =  {
        "Manufacturing Excellence Award ":[
          {"name":"1st Winner","max":1,"idea_number":"","idea_title":""},
          {"name":"2nd Winner","max":1,"idea_number":"","idea_title":""},
          {"name":"3rd Winner","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Admire Winner","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Admire Winner","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Admire Winner","max":1,"idea_number":"","idea_title":""}
        ],
                "Service and Office Excellence Award":[
          {"name":"1st Winner","max":1,"idea_number":"","idea_title":""},
          {"name":"2nd Winner","max":1,"idea_number":"","idea_title":""},
          {"name":"3rd Winner","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Admire Winner","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Admire Winner","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Admire Winner","max":1,"idea_number":"","idea_title":""}
        ],                
        "AGC Chemicals President Award":[
          {"name":"CEO Award","max":1,"idea_number":"","idea_title":""},
          {"name":"Gold Award","max":1,"idea_number":"","idea_title":""},
          {"name":"Silver Award","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Bronze Award","max":1,"idea_number":"","idea_title":""}
          ,
          {"name":"Special Award","max":1,"idea_number":"","idea_title":""}
         
        ]

    }
/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'hof-entry',
  templateUrl: 'hof-entry.component.html',
  providers: [],
  standalone: false,
 
})
export class HofEntryComponent implements OnInit {
 
  treeControl = new NestedTreeControl<JSONTreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<JSONTreeNode>();
  SelectedNode : JSONTreeNode[] = [];

  loadnode = true;
  checklistSelection :any

  fristLoad =true;
   
  TreeSource = FORM_DATASOURCES ? FORM_DATASOURCES : {data: '' };
   showedit = 'true';
  showvalue = 'true';
 // Buttons = this.ComponentProperty.Buttons
 // hideWhen = this.ComponentProperty.hideWhen  
  PanelStyle = { 'width.%' : 100 ,'Height.px' : 600 , 'maxHeight.px' : 600 , 'overflow' :'auto'  };  
 

  constructor() {
   // this.dataSource.data = TREE_DATA;
  }



  ngOnInit() {
    // this.dataSource.data = TREE_DATA;
    // this.treeControl.collapseAll();
  }

  
 ngAfterViewInit(): void {
  var _thisCom = this
 // _thisCom.TreeSource =TREE_DATA ;
  _thisCom.showedit = 'true';
  _thisCom.showvalue = 'true';
 // _thisCom.Buttons = this.ComponentProperty.Buttons
 // _thisCom.hideWhen = this.ComponentProperty.hideWhen  
  _thisCom.reload()

  if(this.TreeSource){
    try {
      this.treeControl.expandAll()  
    } catch (error) {
      //console.log(error)
    }
    
  }

 //console.log('FiedTreeJson ngOnInit')
  
   
}

  reload(): void {
    var _thisCom = this
    _thisCom.loadnode=true
    
    setTimeout(() => {
      
  
        //alert(this.Name)
          this.Mapping(this.TreeSource).then(function(gamenode:any){
           _thisCom.dataSource.data =gamenode;
          ////console.log(gamenode)
          // const trackByIdentity = (index: number, item: any) => item;
          // _thisCom.treeControl.trackBy=(index: number, item: any) => item;
         //console.log('TreeSource :' +  JSON.stringify(gamenode)  )
           
         _thisCom.loadnode=false
          })  
          //_thisCom.dataSource.data=this.TreeSource
          
       
      
    }, 500);
    
  }
 


  CopyToNewNode(source:JSONTreeNode ){
  
    /*    var _sendEV = {name : "CopyToNewNode" , ComponentName: this.Name ,value : { datasource: this.DataSource, fieldname: this.DataField, newvalue: source}  }
       this.fieldCommonEvents.emit(_sendEV) */
         
   }

   getParent (node: JSONTreeNode) {
    var thisCom = this
    return   new Promise((resolve, _reject) => {
    const currentLevel = thisCom.treeControl.getLevel(node);

    if (currentLevel < 1) {
      resolve(null)
    }
  
    const startIndex = thisCom.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = thisCom.treeControl.dataNodes[i];

      if (thisCom.treeControl.getLevel(currentNode) < currentLevel) {
        resolve(currentNode)
      }
    }
  })
}

getNodeFromKey (key:string , parent:JSONTreeNode[]) {
  var thisCom = this
  return   new Promise((resolve, _reject) => {
  
    if(parent.length < 1){
      var _mapkey : JSONTreeNode[]
      _mapkey =  parent.filter(function(e){ return key.substring(0, e.key.trim().length) == e.key.trim() })

      if(_mapkey[0].key.trim() == key.trim()){
        resolve(_mapkey[0])
      } else {
       // thisCom.getNodeFromKey(key,_mapkey[0].children ).then(function())
      }
      for (let index = 0; index < parent.length; index++) {
        const element = parent[index];
        
      }
    } else {

    }

})

}
  CheckChild(parent: any){
   // alert( JSON.stringify(parent))
   var _thisNode = this

   if(!parent.childloaded){
     if(parent.children[0].name=='{}' ){
        var NewChild : JSONTreeNode[]
         var _childValue = parent.children[0].value

        _thisNode.MappingJSON(parent.key ,_childValue ).then(function(_newNode:any){
          parent['children'] = [].concat(_newNode) 
          parent['value'] = 'OK'

          
          //console.log(  parent.key.replace("_." , "")  )
          
        //console.log(   parent['children'] )

          //console.log( _thisNode.dataSource.data[parent.key.replace("_." , "")] )
        })

     } else {
      if(parent.children[0].name=='[]' ){

      } else {
        
      }  
     }
     parent.childloaded = true
   }

  }


  MappingJSON( parentkey:string ,  Source: any  ){

    var thisCom = this
    if(!parentkey){
      parentkey='_'
    }
    return   new Promise((resolve, _reject) => {
  
      if(Source){
        var _keyname = Object.keys( Source)
        var _info :JSONTreeNode[]  = []
        for (let index = 0; index < _keyname.length; index++) {
          const element = _keyname[index];
  
          /* if(element == 'ChildComponents'){
           alert(  parentkey +  ' | ' +    element + '>>  isArray >>' + Array.isArray(Source[element]).toString() + '>>  isObject >>' + isObject(Source[element]).toString() )
          } */
          // alert(element + '>>  isArray >>' + isArray(Source[element]).toString() + '>>  isObject >>' + isObject(Source[element]).toString() )
        //console.log( parentkey + ' (' + index.toString() +   ') element:' +  element )
             var _rowinfo2 = new JSONTreeNode( element ,parentkey + '.' + element )
            
             if (Array.isArray(Source[element])){
                thisCom.MappingARRAY( parentkey + '.'  + element , Source[element]).then(function(child:any){
 
                  if(child){
                   var _rowinfo = new JSONTreeNode( element ,parentkey + '.' + element )
                   //_rowinfo.name=   element

                      for (let chi = 0; chi < child.length; chi++) {
                        const ce = child[chi];

                        
                      
                       /*    ce.button = [].concat(thisCom.AddButtons( ce.parentkey,ce.key ,ce.value)) 
                          if(chi == child.length-1){
                            _rowinfo['children'] = [].concat(child) 
                            _rowinfo['value'] =   Source[element]
                            _rowinfo.Tag=     child.length
                            
                            
                              _rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '.' + element ,Source[element])) 
                             
                           } */
                         
                         
                      }

                   

                                   
                   
                   
                   if (index ==  _keyname.length - 1 ) {_rowinfo.lastchild=true}
                   _info.push(_rowinfo)  
                  }
           
              //    alert(element + '>>  isArray >>' + JSON.stringify(_rowinfo) )
                })
              } else {
                if (   isObject(Source[element])){
                  thisCom.MappingJSON( parentkey + '.'  + element, Source[element]).then(function(child:any){
 
                    if(child){
                      var _rowinfo = new JSONTreeNode( element ,parentkey + '.' + element )
                      
                      for (let chi = 0; chi < child.length; chi++) {
                        const ce = child[chi];
                        
                        
                     //     ce.button = [].concat(thisCom.AddButtons( ce.parentkey,ce.key ,ce.value)) 
                          if(chi == child.length-1){
                            _rowinfo['children'] = [].concat(child) 
                           }
                        
                         
                      }

                                  
                     _rowinfo.value=     Source[element]
                     _rowinfo.Tag=     child.length
                 
                    //  _rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '.' + element ,Source[element])) 
                 
                     if (index ==  _keyname.length - 1 ) {_rowinfo.lastchild=true}
                     _info.push(_rowinfo)  
                    } 
               
                   
                  })
                } else {

                  if(thisCom.HidenNodes(parentkey,element,Source[element])){

                  } else {
                    var _rowinfo = new JSONTreeNode( element ,parentkey + '.' + element )
                    _rowinfo.value=  Source[element]
                  
                    //  _rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '.' + element ,Source[element])) 
                      
                    _info.push(_rowinfo)  
                  }
               
                
                 // alert(element + '>>  isString >>' + JSON.stringify(_rowinfo) )
                }
              }
 
              if (index ==  _keyname.length - 1 ) {        
               resolve(_info)              
           }
        }
  
      } else {
        resolve([])
      }

        
      
    })
  
   }


     HideWhenCheck(_parentkey:string ,  key:string ,_value : any ,hideWhen:any  )    {
     
      return   new Promise((resolve, reject) => {  
        var _match :boolean = false
         
         for (let index = 0; index < hideWhen.length; index++) { 
            const element =hideWhen[index];
            var _keyname = Object.keys(element)[0]
    
            if(_keyname=='key'){
              if (element[_keyname].indexOf(key) > -1 ){
                _match = true
                  resolve(_match)
              }
            }
     
           
          if(index == hideWhen.length -1){
            resolve(_match)
          }  
          
        }   
      })
    ////console.log(thisCom.Buttons)
    

   }

   HidenNodes  (parentkey:string ,  key:string ,value : any  )  { 
   
    return false
 /*    this.HideWhenCheck(parentkey,key,value,this.hideWhen).then(function(macth){
        return macth
      }) */
      
  }
   
   matchLevel = function (parentkey:string ,  _key:string ,button : any  ) { 
   ////console.log(button)
    if(button.level){
    // //console.log(button.level)
      if(button.level=='all'){
        return true
     } else {
       var _level = parentkey.split('.').length
       return  button.level.indexOf(_level) > -1
     }
    } else {
      return false
    }

     
  }

  matchKey = function ( key:string ,button : any  ) { 
     
    if(button.keyname=='all'){
       return true
    } else {  
      var _lastkey = key.split('.')[key.split('.').length -1]
   // //console.log(_lastkey)
      if(button.keyname.indexOf(',') > -1){
        var _allkey = button.keyname.split(',')
        var _hide = _allkey.filter(function(k:string) { return k.trim() =='!'+_lastkey.trim() }).length          
        var _show =  _allkey.filter(function(ks:string) { return ks.trim() ==_lastkey.trim() }).length       
      // //console.log('_hide :' + _hide.toString() + ',_show : ' +  _show.toString())
        if(button.keyname.indexOf('!') > -1){
          if (_hide > 0){
            return false == (_show <1)
          } else {           
              return true
            
          }
      }else {
        return (_show > 0)
      }
         

      } else {
        if(button.keyname.indexOf('!') > -1){
 
          if(button.keyname.indexOf('!' + _lastkey) > -1){
            return  false
          } else {
            return  true
          }
        } else {
          return  button.keyname.indexOf(_lastkey) > -1
        }
  
      }
    
    }
     
  }

  matchValue = function ( value:any ,button : any  ) { 
     
    if(button.value=='all'){
       return true
    } else {      
      return  button.value.indexOf(value) > -1
    }
     
  }

  matchValueType = function ( value:any ,button : any  ) { 
     
    if(button.valueType=='all'){
       return true
    } else {      
      return  button.valueType.indexOf( typeof(value) ) > -1
    }
     
  }

   AsycAddButtons(parentkey:string ,  key:string   ,value:any  ){     

    var thisCom = this
    return   new Promise((resolve, _reject) => {

    ////console.log(thisCom.Buttons)
/*      if(thisCom.Buttons){
      var _forShows : any = []
      for (let index = 0; index < thisCom.Buttons.length; index++) {
        const element = thisCom.Buttons[index];
        
      if( thisCom.matchLevel(parentkey,key,element.showWhen[0])){
        if( thisCom.matchKey(key,element.showWhen[0])){
          if( thisCom.matchValue(value,element.showWhen[0])){
            if( thisCom.matchValueType(value,element.showWhen[0])){
              _forShows.push(element)
            } 
          } 
        }  
       }   
        if(index == thisCom.Buttons.length - 1){
          resolve(_forShows)
        }
      }
     } else {
      resolve([])
     }
      */

    })
  }  

  AddButtons(parentkey:string ,  key:string   ,value:any  ){     

    var thisCom = this
 
    ////console.log(thisCom.Buttons)
 /*     if(thisCom.Buttons){
      var _forShows : any = []
      for (let index = 0; index < thisCom.Buttons.length; index++) {
        const element = thisCom.Buttons[index];
        
   /*     if( thisCom.matchLevel(parentkey,key,element.showWhen[0])){
        if( thisCom.matchKey(key,element.showWhen[0])){
          if( thisCom.matchValue(value,element.showWhen[0])){
            if( thisCom.matchValueType(value,element.showWhen[0])){
              _forShows.push(element)
            } 
          } 
        }  
       }  
        if(index == thisCom.Buttons.length - 1){
           return _forShows
        }
      }
     } else {
      return []
     } */
      
  }
  
   MappingARRAY(parentkey:string ,  Source: any  ){
    if(!parentkey){
      parentkey='_'
    }

    /* if(parentkey.indexOf('rows') > -1 ){
      alert(parentkey + ':' +  Source.length.toString() )
    } */

    var thisCom = this
    return   new Promise((resolve, _reject) => {
      if(Source){
         var _keyname = Object.keys( Source)
         var _info:JSONTreeNode[]  = []
         var _maxarrayExample = 10

         if(parentkey.indexOf('.rows') > -1 ){
          if(Source.length < _maxarrayExample){
            _maxarrayExample=Source.length
           } else {
            _maxarrayExample = 10
           }
         }
          else {
            _maxarrayExample=Source.length
          }



         for (let index = 0; index < _maxarrayExample; index++) {
           const element = Source[index];
  
  
      //  alert(element + '>>  isArray >>' + isArray(Source[element]).toString() + '>>  isObject >>' + isObject(Source[element]).toString() )
           //console.log( parentkey + ' (' + index.toString() +   ') element:' +  element )
             var _rowinfo2 = new JSONTreeNode( '[' + index.toString() + ']' ,parentkey + '[' + index.toString() + ']' )
                       
           
            
             if (Array.isArray(element)){
              var _rowinfo = new JSONTreeNode( '[' + index.toString() + ']' ,parentkey + '[' + index.toString() + ']' ) 
              _rowinfo.typeOfvalue=  typeof(element)
              _info.push(_rowinfo)   
              /*   thisCom.MappingARRAY( parentkey + '[' + index.toString() + ']' , element).then(function(child:any){
                  _rowinfo.name=   index.toString()
                  _rowinfo['children'] = [].concat(child)           
                  _rowinfo['value'] =   Source.length
                  if (index ==  Source.length - 1 ) {_rowinfo.lastchild=true}
                //console.log(parentkey + '[' + index.toString() + '] ' + JSON.stringify(child) )
        
                    _info.push(_rowinfo)  
              
                    if (index ==  Source.length - 1 ) {        
                        resolve(_info)              
                    }
          
                  
                }) */
              } else {
                if (isObject(element)){
                  thisCom.MappingJSON(parentkey + '[' + index.toString() + ']' , element).then(function(child:any){
                  
                    var _rowinfo = new JSONTreeNode( '[' + index.toString() + ']' ,parentkey + '[' + index.toString() + ']' ) 
                    _rowinfo['children'] = [].concat(child) 
              
                    _rowinfo.value=   element 
                    _rowinfo.typeOfvalue=  typeof(element)

                  /*   switch (_rowinfo.name) {
                      case "_id"||"app_id" :
                        _rowinfo.showcopy=false
                        _rowinfo.showdelete=false
                        _rowinfo.showedit=false
                        _rowinfo.showAddChild=false                         

                        break;
                    
                      default:
                        _rowinfo.showcopy=true
                        _rowinfo.showdelete=true
                        _rowinfo.showedit=true
                        _rowinfo.showAddChild=true    
                        break;
                    } */

                    _rowinfo.Tag=   child.length
                     
//_rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '[' + index.toString() + ']' ,element)) 
                    // 
                    if (index ==  Source.length - 1 || index == _maxarrayExample ) {_rowinfo.lastchild=true}
                 
                      _info.push(_rowinfo)                
                      if (index ==  Source.length - 1  || index == _maxarrayExample ) {        
                          resolve(_info)              
                      }  
                  })
                } else { 
                  var _rowinfo = new JSONTreeNode( '[' + index.toString() + ']' ,parentkey + '[' + index.toString() + ']' ) 
                  _rowinfo.value=   element
                 // _rowinfo.value=   element 
                    _rowinfo.typeOfvalue=  typeof(element)
         
                   //   _rowinfo.button = [].concat( thisCom.AddButtons(parentkey,parentkey + '[' + index.toString() + ']' ,element)) 
                   

                   /*  switch (_rowinfo.name) {
                      case "_id"||"app_id" :
                        _rowinfo.showcopy=false
                        _rowinfo.showdelete=false
                        _rowinfo.showedit=false
                        _rowinfo.showAddChild=false                         

                        break;
                    
                      default:
                        _rowinfo.showcopy=true
                        _rowinfo.showdelete=true
                        _rowinfo.showedit=true
                        _rowinfo.showAddChild=true    
                        break;
                    } */
                    _info.push(_rowinfo)              
                    if (index ==  Source.length - 1  || index == _maxarrayExample) {        
                        resolve(_info)              
                    }
                }
              }
            
              if (index ==  Source.length - 1 || index == _maxarrayExample ) {       
                 
                resolve(_info)              
            }
        }  
      } else {
        resolve([]) 
      }
    })  
   }  
  
    Mapping(Source: any  ){
  
     var thisCom = this
     return   new Promise((resolve, _reject) => {
  
      if(Source.length == 1 ){
        Source = Source[0]
      }

   /*    if (Array.isArray(Source)){
        thisCom.MappingARRAY( thisCom.Name , Source).then(function(child:any){
  
          setTimeout(() => {
          resolve(child)
          },500);
        })
      } else {
        if (isObject(Source)){
     
          thisCom.MappingJSON(thisCom.Name , Source).then(function(child:any){
            setTimeout(() => {
            if(child){//  alert(child.length.toString())
              resolve(child)
            } else {
               alert('Not data')
              resolve([])
            }
          }, 500);
          })
        } else {
          alert('Not data')
          resolve([])
        }
      }  */            
     })  
    }
  
  
  hasChild = (_: number, node: JSONTreeNode) => !!node.children && node.children.length > 0;

  descendantsPartiallySelected(node: JSONTreeNode): boolean {
    var _thisCom = this
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => _thisCom.checklistSelection.isSelected(child));
    return result ;
  }

  NodeClick = (command : string , key:string,  value:JSONTreeNode )=>{
    var _thisCom = this
    
   // key = key.replace(this.Name.trim() + '.','')
    switch (command) {
      case 'select':
       // var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:key ,  value:value , command:command }
      
       ////console.log( _thisCom.treeControl.getDescendants(value))
     //console.log( value)
        _thisCom.SelectedNode = [value]

   /*      const partial=_thisCom.treeControl.dataNodes
        .filter(x=>_thisCom.descendantsPartiallySelected(x))
    
      //console.log(_thisCom.checklistSelection.selected,partial) */

        //this.fieldCommonEvents.emit(JSON.stringify(ev))
      //  _thisCom.fieldCommonEvents.emit(ev)
        break;
    
      case 'edit':
      //  var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:key ,  value:value.value , command:command }
        _thisCom.SelectedNode = [value]
        //this.fieldCommonEvents.emit(JSON.stringify(ev))
     //   _thisCom.fieldCommonEvents.emit(ev)  
        break;

      case 'copy-to-new':

       
        var _newNode = new  JSONTreeNode(value.key + '_Copy' ,  value.name + '_Copy')
    
        var _DescendantNode :JSONTreeNode[] = []
        
       
        _newNode.value = value.value

       //  var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:_newNode.key ,  value:_newNode.value , command:command }
         _thisCom.SelectedNode = [value]
         //this.fieldCommonEvents.emit(JSON.stringify(ev))
      //   _thisCom.fieldCommonEvents.emit(ev)  


       // _thisCom.CopyToNewNode(value)

        break;

        case 'new-child':

       
          var _newNode = new  JSONTreeNode(value.key + '_Copy' ,  value.name + '_Copy')
      
          var _DescendantNode :JSONTreeNode[] = []
          
         
          _newNode.value = value.value
  
        //   var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:_newNode.key ,  value:_newNode.value , command:command }
           _thisCom.SelectedNode = [value]
           //this.fieldCommonEvents.emit(JSON.stringify(ev))
       //    _thisCom.fieldCommonEvents.emit(ev)  
  
  
         // _thisCom.CopyToNewNode(value)
  
          break;

      default:
      
    //  var ev:any = {ComponentName : this.Name , name:'TreeNodeClick',  value:  {command:command , key:key , node : value }  }
     ////console.log(ev) 
      //   _thisCom.fieldCommonEvents.emit(ev)
        break;
    }

   }

   EditJSON = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'edit' }
  
    //this.fieldCommonEvents.emit(JSON.stringify(ev))
  //  this.fieldCommonEvents.emit(ev)
  
   }
   ReNewForm = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'re-new' }
  
    //this.fieldCommonEvents.emit(JSON.stringify(ev))
   // this.fieldCommonEvents.emit(ev)
  
   }
   CopyFormTo = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'copy-to-new' }
  
    //this.fieldCommonEvents.emit(JSON.stringify(ev))
  //  this.fieldCommonEvents.emit(ev)
  
   }
   AddNewForm = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'add-new' }
  
    //this.fieldCommonEvents.emit(JSON.stringify(ev))
  //  this.fieldCommonEvents.emit(ev)
  
   }


   AutoFocus =()=>{

    //value == 'dsDataBaseInfo'
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.treeControl.dataNodes[i].value == 'dsDataBaseInfo') {
       // this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
      if (this.treeControl.dataNodes[i].value == 'dsDataBaseInfo') {
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    }
 
   }

}


