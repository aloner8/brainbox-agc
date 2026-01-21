import {Component, Inject} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatAutocomplete,MatOption} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';

import { map, Observable, startWith } from 'rxjs';
import {A, COMMA, ENTER} from '@angular/cdk/keycodes';
import {AsyncPipe} from '@angular/common';
import { ApiService } from '../../../api.service';

export interface DialogData {
  key: string;
  value: string;
  command: string;  
  newvalue:string;
  title:string;
  
}
  export interface datalist {
    value:number;
    display: string;
    object: any;
  }
  
@Component({
  selector: 'search-idea-dialog',
  templateUrl: 'search-idea-dialog.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatAutocomplete,
    AsyncPipe,
    MatOption,  
    
  ],
})
export class SearchIdeaDialog {


       blankList:datalist = {value:0,display:'-',object:{}}
       approverlist:datalist[] = []
       approverfilter:datalist=this.blankList;
           order_by='running'
    page_size=20
    page_select=1
    filterinput = ""
    filter_text='%%'
    desc=true
    idea_title = ""
    ideaDetail:any={}
    CheckApply = false;
    CheckDuplicate = false;
    ExsitsIdeaText = ""
    key_array = this.data.key.split('.')

  constructor(
    public dialogRef: MatDialogRef<SearchIdeaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private api:ApiService,
  ) {}



    ngAfterViewInit() {   
      //this.approverlist = this.data.idealist
      //this._filterApprove('')
      this.key_array = this.data.key.split('.')
      if(this.data.value.length == 8){
        this.filterinput = this.data.value
        this.GetIdeaListByYear(this.filterinput)
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.data.newvalue = this.filterinput;    
    this.data.title = this.idea_title;
    this.dialogRef.close(this.data);
  }

        private _filterApprove(name: string): datalist[] {
          const filterValue = name.toLowerCase();      
        // console.log(this.approverlist)
          return this.approverlist.filter(option => option.display.toLowerCase().includes(filterValue));
        }

         GetIdeaListByYear = (idea_number:any)=>{
          const _this = this
        console.log(this.filterinput)


        if(this.filterinput.length ==8){
           let _input_parameter =  {filter_text:this.filterinput ,status_filter:10    }
    //console.log(_input_parameter)
          let _id_ideas:number;
    
    this.api.QueryBG('select get_project_id_by_ideanumber($1)',[this.filterinput]).subscribe(function(rows:any){
   console.log('get_project_id_by_ideanumber:',rows)  
          if(rows){
              _id_ideas = rows[0]['get_project_id_by_ideanumber'] 

              
                  _this.api.QueryBG('select get_ideas_title($1)',[_id_ideas]).subscribe(function(rows:any){
   console.log('get_project_id_by_ideanumber:',rows)  
          if(rows){
             let  _ideas = rows[0]['get_ideas_title'] 

              _this.idea_title = _ideas[0]['title']
              _this.ideaDetail = _ideas[0]
              _this.data.newvalue = _this.filterinput;
              if(_this.ideaDetail.current_status != 10){
                _this.CheckApply = false;
              } else {
                _this.CheckApply = true;
              }
              _this.CheckIdeaExists(_this.filterinput).then(function(res:any){
                console.log('CheckIdeaExists:',res)
                if(res['hof_year'] && _this.filterinput != _this.data.value){
                  _this.ExsitsIdeaText = "This idea number has already on Year " + res['hof_year'].toString() + ':' + res['root'] + ' ->> ' + res['sub'] // + _this.ideaDetail.suggest_date.substring(0,4) + " Hall of Fame reward list."
                  _this.CheckDuplicate = true;
                } else {
                   _this.ExsitsIdeaText = ""
                  _this.CheckDuplicate = false;
                }
              } )
          }
        })
          }
        })
      } else {
         _this.idea_title = ''
              _this.ideaDetail = {}
              //_this.data.newvalue = _this.filterinput;
              
                _this.CheckApply = false;
                        _this.ExsitsIdeaText = ""
                  _this.CheckDuplicate = false;
              
      }
  
       


}

    CheckIdeaExists(ideanumber:string){
    const _this = this
    return   new Promise((resolve, reject) => {
    this.api.QueryBG('SELECT public.get_hof_rewards_exist($1) limit 1', [ideanumber] ).subscribe(function(rows:any){
      console.log('get_hof_rewards_exist:',rows)
          if(rows){
              let _Exists = rows[0]['get_hof_rewards_exist']   

               
                resolve(_Exists)
               
          } else{
             resolve([])
          }
    })
  })
  }
}
