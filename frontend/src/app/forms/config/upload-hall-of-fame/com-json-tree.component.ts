import {NestedTreeControl} from '@angular/cdk/tree';
import {AfterViewInit, Component, Directive, EventEmitter, Injectable, Input, Output, ViewChild} from '@angular/core';
import {MatTree, MatTreeNestedDataSource} from '@angular/material/tree';
import { BehaviorSubject, Subject } from 'rxjs';
import{datalist, SearchIdeaDialog} from './search-idea-dialog.component';
import { ApiService } from '../../../api.service';
import { MatDialog } from '@angular/material/dialog';
/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
/* @Directive({selector: 'child-directive'})
class ChildDirective {
  @Input() id! :number;
  ngAfterViewInit() {
   //console.log("ngAfterViewInit child")
  }
} */

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
    name: 'Fruit',
    key: 'Fruit',
    value: 'Fruit',
    children: [
      {name: 'Apple', key: 'Apple', value: 'Apple'},
      {name: 'Banana' , key: 'Banana',value: 'Banana'},
      {name: 'Fruit loops',  key: 'Fruit loops', value: 'Fruit loops',lastchild:true},
    ]
  }, {
    name: 'Vegetables',
    value: 'Vegetables',
    key: 'Vegetables',
    children: [
      {
        name: 'Green',
        key: 'Green',
        value: 'Green',
        children: [
          {name: 'Broccoli' , key: 'Broccoli', value: 'Broccoli'},
          {name: 'Broccoli'  , key: 'Broccoli',  value: 'Broccoli', lastchild:true},
        ]
      }, {
        name: 'Orange',
        key: 'Orange',
        value: 'Orange',
        children: [
          {name: 'Pumpkins'  , key: 'Pumpkins', value: 'Pumpkins'},
          {name: 'Carrots' , key: 'Carrots', value: 'Carrots' ,lastchild:true},
        ]
        ,lastchild:true
      },
    ],
    lastchild:true
  },
];



/**
 * @title Tree with nested nodes
 */

@Component({
  selector: 'com-json-tree',
  templateUrl: 'com-json-tree.component.html',
  styleUrls: ['com-json-tree.component.scss'],
  standalone  : false,  
})
export class ComJsonTree implements   AfterViewInit {
  treeControl = new NestedTreeControl<JSONTreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<JSONTreeNode>();
  SelectedNode : JSONTreeNode[] = [];

  loadnode = true;
  checklistSelection :any

  fristLoad =true;
  list_years :datalist[] =[]
  select_year :datalist=this.list_years[0];

  @Input()  APPLICATION_INFORMATION: any;
  @Input()  USER_INFORMATION: any;
  @Input()  FORM_INFORMATION: any;
  @Input()  FORM_DATASOURCES: any;
  @Input()  PrimaryDataSource: any;

  @Input() ApplicationInfo: any;
  @Input() UserInfo: any;
  @Input() MenuInfo: any;
  @Input() DataSource: any;
  @Input() TreeSource: any;
  @Input() Caption: any;
  @Input() Name: any;
  @Input() PanelStyle: any;
  @Input() Map: any;
  @Input()  ExpandAllOnstart : boolean = true;

  @Input()  showvalue : any;
  @Input()  showedit : any;
  @Input()  showTag : any;
  @Input()  showHeaderReload : any;
  @Input()  showHeaderedit : any;
  @Input()  showHeaderAddNew : any;

  @Input()  hideWhen : any;
  @Input()  Buttons : any;
  @Input()  setButtonScript : any;

  @Input()  Parents: Subject<any> = new Subject<any> () ;
  
  @Output() ComMatTreeEvents : EventEmitter<any> = new EventEmitter();
  //@ViewChild(MatTree) sub!: MatTree<JSONTreeNode>;

  @ViewChild('MyMatTree') sub!: MatTree<any>;
 
  approverlist:datalist[] = []
  constructor( private searchIdeaDialog : MatDialog,private api : ApiService) {
   // this.dataSource.data = TREE_DATA;
  }

  // @ViewChild('MatTree') MatTree:  MatTree<JSONTreeNode>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sorter: MatSort;
  ngAfterViewInit() {
 
    var _thisCom = this
      this.PanelStyle= { backgroundColor: 'transparent', width: '95%', fontSize: '20px', color: 'white',  'min-height': '800px',  overflow: 'auto', border: '5px solid blue', padding: '5px'};
        let _currentYear = new Date().getFullYear()
        this.select_year = this.list_years.filter(  (year:datalist) => year.value == _currentYear )[0]
        _thisCom.getStructureOfYear(_thisCom.select_year.value.toString()).then(function(_rewards:any){
          console.log('_rewards:',_rewards)
          _thisCom.reload() 
        })



 
 
  }

  reload(): void {
    var _thisCom = this
    _thisCom.loadnode=true
    
    setTimeout(() => {
      if(this.TreeSource ){
  
        //alert(this.Name)
          this.Mapping(_thisCom.TreeSource).then(function(gamenode:any){
           _thisCom.dataSource.data =gamenode;
          ////console.log(gamenode)
          // const trackByIdentity = (index: number, item: any) => item;
          // _thisCom.treeControl.trackBy=(index: number, item: any) => item;
         //console.log('TreeSource :' +  JSON.stringify(gamenode)  )
           
         _thisCom.loadnode=false
         _thisCom.treeControl.expandAll()
          })  
          //_thisCom.dataSource.data=this.TreeSource
         
       }
      
    }, 1000);
     
    
  }

  ngOnInit()  {
    var _thisCom = this
        this.getListYear()
//console.log('this.list_years :' +  this.list_years )
        let _currentYear = new Date().getFullYear()
       
        setTimeout(() => {
           this.select_year = this.list_years.filter(  (year:datalist) => year.value == _currentYear )[0]
          console.log('getStructureOfYear :' +  _thisCom.select_year.value.toString()  )
            _thisCom.getStructureOfYear(_thisCom.select_year.value.toString()).then(function(_rewards:any){
              console.log('_rewards:',_rewards)
              _thisCom.reload() 
            })
        }, 500);


   /*  this.TreeSource =  {
        "Manufacturing Excellence Award ":
          {"1st Winner":{"idea_number":"","idea_title":""},
          "2nd Winner":{"idea_number":"","idea_title":""},
          "3rd Winner":{"idea_number":"","idea_title":""}
          ,
          "Admire Winner 1":{"idea_number":"","idea_title":""}
          ,
          "Admire Winner 2":{"idea_number":"","idea_title":""}
          ,
          "Admire Winner 3":{"idea_number":"","idea_title":""}
    },
                "Service and Office Excellence Award":{
          "1st Winner":{"idea_number":"","idea_title":""},
          "2nd Winner":{"idea_number":"","idea_title":""},
          "3rd Winner":{"idea_number":"","idea_title":""}
          ,
          "Admire Winner":{"idea_number":"","idea_title":""}
        ,
          "Admire Winner 2":{"idea_number":"","idea_title":""}
          ,
          "Admire Winner 3":{"idea_number":"","idea_title":""}
                    },                
        "AGC Chemicals President Award":{
          "CEO Award":{"idea_number":"","idea_title":""},
          "Gold Award":{"idea_number":"","idea_title":""},
          "Silver Award":{"idea_number":"","idea_title":""}
          ,
          "Bronze Award":{"idea_number":"","idea_title":""}
          ,
          "Special Award":{"idea_number":"","idea_title":""}
         
        }

    }   */
    // setTimeout(() => {
    //   if(this.TreeSource ){
  
       
    //       this.Mapping(_thisCom.TreeSource).then(function(gamenode:any){
    //        _thisCom.dataSource.data =gamenode;
    //        _thisCom.treeControl.dataNodes=gamenode;

          
    //         _thisCom.treeControl.expandAll()
          
    //       // const trackByIdentity = (index: number, item: any) => item;
    //       // _thisCom.treeControl.trackBy=(index: number, item: any) => item;
    //      //console.log('TreeSource :' +  JSON.stringify(gamenode)  )
    //        _thisCom.loadnode=false
           
    //       })  
    //       //_thisCom.dataSource.data=this.TreeSource
          
    //     }
      
    // }, 1000);
    
  
    this.Parents.subscribe(event => {
   //  alert( ' JSONTREE'  + JSON.stringify(_thisCom.TreeSource) )
  //console.log(_thisCom.TreeSource)
      switch (event.name) {

        case 'ComponentInitiateComplete':
         //console.log(event.name,',FORM_DATASOURCES:',_thisCom.FORM_DATASOURCES[_thisCom.TreeSource])
        
        break;

        case 'EditFormInforComplete':
        //console.log(event.value)
          _thisCom.SelectedNode[0].value =event.value
        //  _thisCom.treeControl.expandDescendants(_thisCom.SelectedNode[0])
         
          break;
        case 'CopyToNewComplete':
        //console.log(event.value)
          _thisCom.SelectedNode[0].value =event.value
        //  _thisCom.treeControl.expandDescendants(_thisCom.SelectedNode[0])
          
          break;
          
          case 'FormDataSoureRefrash':
           // alert( 'FormDataSoureRefrash : JSONTREE' +  _thisCom.DataSource   )


           setTimeout(() => {
            if(this.TreeSource ){
        
              //alert(this.Name)
              if(_thisCom.TreeSource.length == 1) {
               // _thisCom.TreeSource =_thisCom.TreeSource[0]
              } 
                this.Mapping(_thisCom.TreeSource).then(function(gamenode:any){
                 _thisCom.dataSource.data =gamenode;
                 _thisCom.treeControl.dataNodes=gamenode;
     
               
                  _thisCom.treeControl.expandAll()
              
                // const trackByIdentity = (index: number, item: any) => item;
                // _thisCom.treeControl.trackBy=(index: number, item: any) => item;
               //console.log('TreeSource :' +  JSON.stringify(gamenode)  )
                 _thisCom.loadnode=false
                 
                })  
                //_thisCom.dataSource.data=this.TreeSource
                
             }
            
          }, 1000);

/* 
           //console.log ( 'FormDataSoureRefrash : JSONTREE - ' +  _thisCom.DataSource + ' = ' + JSON.stringify(event.value)  )
            if(event.value[_thisCom.DataSource]){
              if(event.value[_thisCom.DataSource]['rows']){
                if(event.value[_thisCom.DataSource]['rows'].length == 1) {
                  _thisCom.TreeSource = event.value[_thisCom.DataSource]['rows'][0]
                } else {
                  _thisCom.TreeSource = event.value[_thisCom.DataSource]['rows']
                }
              } else {
                _thisCom.TreeSource =[]
              }
            } else {
              _thisCom.TreeSource =[]
            }
            
            setTimeout(() => {
              if(_thisCom.TreeSource ){
          
                //alert(this.Name)
                _thisCom.Mapping(_thisCom.TreeSource).then(function(gamenode:any){
                   _thisCom.dataSource.data =gamenode;
                   _thisCom.treeControl.dataNodes=gamenode;
                   if (_thisCom.ExpandAllOnstart) {
                    _thisCom.treeControl.expandAll()
                   }
                  // const trackByIdentity = (index: number, item: any) => item;
                  // _thisCom.treeControl.trackBy=(index: number, item: any) => item;
                 //console.log('TreeSource :' +  JSON.stringify(gamenode)  )
                   _thisCom.loadnode=false
                   
                  })  
                  //_thisCom.dataSource.data=this.TreeSource
                  
               }
              
            }, 1000);

 */

              break;

      


        default:
          break;
      }
   // alert(JSON.stringify(event))

   /*  setTimeout(() => {
      if(this.TreeSource ){
  
        //alert(this.Name)
          this.Mapping(_thisCom.TreeSource).then(function(gamenode:any){
           _thisCom.dataSource.data =gamenode;
         //console.log('TreeSource :' +  JSON.stringify(gamenode)  )
       
         
           
          })  
          //_thisCom.dataSource.data=this.TreeSource
          
       }
      
    }, 1000); */

    })

  
      
/*      setInterval(() => {
 
      if(this.dataSource.data.length < 2){
        this.reload()
        //this.fristLoad=false
      }
     }, 1000); */
   
  }


  CopyToNewNode(source:JSONTreeNode ){
    // alert( JSON.stringify(parent))
    var _thisNode = this
    var _newNode = new  JSONTreeNode(source.key + '_Copy' ,  source.name + '_Copy')

    var _DescendantNode :JSONTreeNode[] = []
    
    _DescendantNode = _thisNode.treeControl.getDescendants(source)
   
    _newNode.value = source.value

    _thisNode.ComMatTreeEvents.emit()
    //_DescendantNode.push(_newNode)
    // const startIndex = _thisNode.treeControl.dataNodes.indexOf(source) - 1;
    // _thisNode.treeControl.dataNodes.splice(startIndex,0, _newNode)

    //_DescendantNode.concat(_newNode)
     
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

                        
                      
                          ce.button = [].concat(thisCom.AddButtons( ce.parentkey,ce.key ,ce.value)) 
                          if(chi == child.length-1){
                            _rowinfo['children'] = [].concat(child) 
                            _rowinfo['value'] =   Source[element]
                            _rowinfo.Tag=     child.length
                            
                            
                              _rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '.' + element ,Source[element])) 
                             
                           }
                         
                         
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
                        
                        
                          ce.button = [].concat(thisCom.AddButtons( ce.parentkey,ce.key ,ce.value)) 
                          if(chi == child.length-1){
                            _rowinfo['children'] = [].concat(child) 
                           }
                        
                         
                      }

                                  
                     _rowinfo.value=     Source[element]
                     _rowinfo.Tag=     child.length
                 
                      _rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '.' + element ,Source[element])) 
                 
                     if (index ==  _keyname.length - 1 ) {_rowinfo.lastchild=true}
                     _info.push(_rowinfo)  
                    } 
               
                   
                  })
                } else {

                  if(thisCom.HidenNodes(parentkey,element,Source[element])){

                  } else {
                    var _rowinfo = new JSONTreeNode( element ,parentkey + '.' + element )
                    _rowinfo.value=  Source[element]
                  
                      _rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '.' + element ,Source[element])) 
                      
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
     if(thisCom.Buttons){
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
     

    })
  }  

  AddButtons(parentkey:string ,  key:string   ,value:any  ){     

    var thisCom = this
 
    ////console.log(thisCom.Buttons)
     if(thisCom.Buttons){
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
           return _forShows
        }
      }
     } else {
      return []
     }
      
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
                     
                      _rowinfo.button = [].concat(thisCom.AddButtons(parentkey,parentkey + '[' + index.toString() + ']' ,element)) 
                     
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
         
                      _rowinfo.button = [].concat( thisCom.AddButtons(parentkey,parentkey + '[' + index.toString() + ']' ,element)) 
                   

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

      if (Array.isArray(Source)){
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
      }             
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
        var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:key ,  value:value , command:command }
       console.log('select node :' ,ev )
       ////console.log( _thisCom.treeControl.getDescendants(value))
     //console.log( value)
        _thisCom.SelectedNode = [value]

   /*      const partial=_thisCom.treeControl.dataNodes
        .filter(x=>_thisCom.descendantsPartiallySelected(x))
    
      //console.log(_thisCom.checklistSelection.selected,partial) */

        //this.ComMatTreeEvents.emit(JSON.stringify(ev))
        _thisCom.ComMatTreeEvents.emit(ev)
        break;
    
      case 'edit':
        var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:key ,  value:value.value , command:command , newvalue:'' }
        _thisCom.SelectedNode = [value]
        //this.ComMatTreeEvents.emit(JSON.stringify(ev))
        _thisCom.ComMatTreeEvents.emit(ev)  
        break;
          case 'Edit Idea':
                    var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:key ,  value:value.value , command:command , newvalue:'', title : ''  }
        _thisCom.SelectedNode = [value]
            console.log('Edit Idea :' ,ev )
               const dialogRef = _thisCom.searchIdeaDialog.open(SearchIdeaDialog, {
                             data: ev,
                           });
                       
                           dialogRef.afterClosed().subscribe(result => {
                            if(result){ 
                              console.log('The dialog was closed', result);
                              if(result.newvalue!= result.value ){
                                _thisCom.UpdateRewardsStructure(result.key,result.newvalue,result.title)

                              }
                            }
                           })  
        break;

      case 'copy-to-new':

       
        var _newNode = new  JSONTreeNode(value.key + '_Copy' ,  value.name + '_Copy')
    
        var _DescendantNode :JSONTreeNode[] = []
        
       
        _newNode.value = value.value

         var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:_newNode.key ,  value:_newNode.value , command:command }
         _thisCom.SelectedNode = [value]
         //this.ComMatTreeEvents.emit(JSON.stringify(ev))
         _thisCom.ComMatTreeEvents.emit(ev)  


       // _thisCom.CopyToNewNode(value)

        break;

        case 'new-child':

       
          var _newNode = new  JSONTreeNode(value.key + '_Copy' ,  value.name + '_Copy')
      
          var _DescendantNode :JSONTreeNode[] = []
          
         
          _newNode.value = value.value
  
           var ev:any = {ComponentName : this.Name , name:'TreeNodeClick', key:_newNode.key ,  value:_newNode.value , command:command }
           _thisCom.SelectedNode = [value]
           //this.ComMatTreeEvents.emit(JSON.stringify(ev))
           _thisCom.ComMatTreeEvents.emit(ev)  
  
  
         // _thisCom.CopyToNewNode(value)
  
          break;

      default:
      
      var ev:any = {ComponentName : this.Name , name:'TreeNodeClick',  value:  {command:command , key:key , node : value }  }
     ////console.log(ev) 
         _thisCom.ComMatTreeEvents.emit(ev)
        break;
    }

   }

   EditJSON = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'edit' }
  
    //this.ComMatTreeEvents.emit(JSON.stringify(ev))
    this.ComMatTreeEvents.emit(ev)
  
   }
   ReNewForm = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'re-new' }
  
    //this.ComMatTreeEvents.emit(JSON.stringify(ev))
    this.ComMatTreeEvents.emit(ev)
  
   }
   CopyFormTo = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'copy-to-new' }
  
    //this.ComMatTreeEvents.emit(JSON.stringify(ev))
    this.ComMatTreeEvents.emit(ev)
  
   }
   AddNewForm = ( )=>{

    var ev:any = {name:'TreeObjectEditJSON',   value:'' , command:'add-new' }
  
    //this.ComMatTreeEvents.emit(JSON.stringify(ev))
    this.ComMatTreeEvents.emit(ev)
  
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

   GetIdeaListByYear = (year:string )=>{
   
const _this = this  
// if(_this.idea_number.length == 8) {
//   let _input_parameter =  {order_by: 'idea_number ',page_size:200,page_select:1, order_by_desc:'' , filter_text:year ,status_filter:10 , approver_filter:[] ,coordinator_filter:[],division_filter:0,date_filter:null , category_filter:null    }
//     //console.log(_input_parameter)
//     this.api.CallProcedure('fliter_ideas',_input_parameter).subscribe(function(rows:any){
//    //console.log('fliter_ideas:',rows)
//           if(rows){
//               let _my_ideas = rows['rowvisible']
//                _this.approverlist = []
//               _my_ideas.array.forEach((_ideas:any) => {
//                 let _idea_data:datalist = {value:_ideas.idea_number , display: _ideas.idea_number + ' : ' + _ideas.idea_title,object:{}  }
//                 _this.approverlist.push( _idea_data)
//               });
          
//           } else{
//             /* _table.snackBar.openSnackBar( 'not found user data!!',
//               'OK', 'center', 'top', 'snack-style'); */
//           }
          
//         })
// }
      



}
  getListYear(){
    const _this = this
    this.api.Query('select hof_year from hof_entry order by hof_year',[]  ).subscribe(function(rows:any){
      console.log('getListYear:',rows)
          if(rows){
              let _years = rows
               _this.list_years = []
              _years.forEach((_year:any) => {
                let _year_data:datalist = {value:_year.hof_year , display: _year.hof_year ,object:_year  }
                _this.list_years.push( _year_data)
              });
              console.log('list_years:',_this.list_years)
          } else{
            /* _table.snackBar.openSnackBar( 'not found user data!!',
              'OK', 'center', 'top', 'snack-style'); */
          }
    })
  }

    getStructureOfYear(year:string){
    const _this = this
    return   new Promise((resolve, reject) => {
    this.api.Query('select rewards from hof_entry  where hof_year = $1 limit 1', [year] ).subscribe(function(rows:any){
      console.log('rewards:',rows)
          if(rows){
              let _rewards = rows[0].rewards     

               _this.TreeSource = _rewards
                resolve(_rewards)
               
          } else{
             resolve([])
          }
    })
  })
  }

YearChange(event:any){
  console.log('YearChange:',event)
  const _this = this
 this.getStructureOfYear(event.value.value).then(function(_rewards:any){
  console.log('_rewards:',_rewards)
  _this.reload()
 })
}

UpdateRewardsStructure(key:string,value:string,title:string){
  const _this = this
  let key_array = key.split('.')
  console.log('UpdateRewardsStructure key_array :',key_array)
  this.TreeSource[key_array[1]][key_array[2]] = {"idea_number":value,"idea_title":title}
  this.api.CallProcedure('update_hof_rewards', {rewards: this.TreeSource,year:this.select_year.value} ).subscribe(function(rows:any){
    console.log('UpdateRewardsStructure:',rows)
    _this.getStructureOfYear(_this.select_year.value.toString()).then(function(_rewards:any){
      console.log('_rewards:',_rewards)
      _this.reload()
    })

  })  
}


}