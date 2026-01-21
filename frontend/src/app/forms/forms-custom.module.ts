import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import{MatlibModule} from '../matlib.module';

import {FormMatComponent} from '../form-mat/form-mat.component'
import {FormMatFieldComponent} from '../form-mat-field/form-mat-field.component'
import {FormMatCollectionComponent} from '../form-mat-collection/form-mat-collection.component'
import{ApiService} from '../api.service'
import {MenuLeftComponent} from '../menu-left/menu-left.component'

import {ProgressBoxComponent} from './progressbox/progressbox.component';
import {RankingComponent} from './ranking/ranking.component';
import {StatusBoxComponent} from './statusbox/statusbox.component';
import {StatusImgComponent} from './statusimg/statusimg.component';
import {TableMyIdeasComponent} from './home/table-my-ideas/table-my-ideas.component';
import {IdeasComponent  } from "./ideas/ideas.component";
import {TableListIdeasComponent  } from "./ideas/table-list-ideas/table-list-ideas.component";
import{DashboardComponent} from "./dashboard/dashboard.component"
import{ReportsComponent} from "./reports/reports.component"
import{ProfileComponent} from "./profile/profile.component"
import{ConfigComponent} from "./config/config.component"
import{ManualComponent} from "./manual/manual.component"
import{HallOfFameComponent} from "./hall-of-fame/hall-of-fame.component"
import{HomeComponent} from "./home/home.component"
import {FormCustomComponent} from "./forms-custom.component"
import { VariablesService } from '../variables.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import {FormIdeasDetail} from '../forms/ideas/ideas-detail/ideas-detail.component'
import {IdeasCommand} from '../forms/ideas/ideas-command/ideas-command.component'
import {IdeasProcessStep} from '../forms/ideas/ideas-process/ideas-process-step.component'
import {IdeasProcessBar} from '../forms/ideas/ideas-process/ideas-process-bar.component'
import { DatePipe } from "@angular/common";
import { SendemailDialogComponent } from "./dialogs/sendemail-dialog.component";
import { ConfirmStatusDialogComponent } from "./dialogs/confirm-status-dialog.component";
import { ObjectTargetComponent } from "../forms/dashboard/object_target/object-target.component";
import { ObjectTargetCustomComponent } from "../forms/dashboard/object_target/object-target-custom.component";
import { ProgressTargetComponent } from "../forms/dashboard/object_target/progress-target/progress-target.component";
import { DashboardMyIdeaComponent } from "../forms/dashboard/my-idea/my-idea.component";
import { FileuploadComponent } from "../forms/fileupload/fileupload.component";
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MemberVisiblePipe} from './ideas/ideas-detail/member-visible.pipe'

import{TableListUserComponent} from "./config/table-list-user/table-list-users.component"
import{TableListLevelsComponent} from "./config/table-list-level/table-list-levels.component"
import{TableListDivisionComponent} from "./config/table-list-division/table-list-divisions.component"
import { LevelDetailDialogComponent } from "./config/table-list-level/level-dialog.component";
import { DivisionDetailDialogComponent } from "./config/table-list-division/division-dialog.component";
import { TableListCategoryComponent } from "./config/table-list-category/table-list-category.component";
import { TableListIdeaStatusComponent } from "./config/table-list-idea-status/table-list-idea-status.component";
import { TableListRewardsComponent } from "./config/table-list-rewards/table-list-rewards.component";
import { RewardsDetailDialogComponent } from "./config/table-list-rewards/rewards-dialog.component";
import { TableListSubCategoryComponent } from "./config/table-list-sub-category/table-list-sub-category.component";
import { SubCategoryDetailDialogComponent } from "./config/table-list-sub-category/sub-category-dialog.component";
import { TargetSettingComponent } from "./config/target-setting/target-setting.component";
import { TargetSettingDetailDialogComponent } from "./config/target-setting/target-setting-dialog.component";
import { UploadHallOfFameComponent } from "./config/upload-hall-of-fame/upload-hall-of-fame.component";
import { UploadHallOfFameDetailDialogComponent } from "./config/upload-hall-of-fame/upload-hall-of-fame-dialog.component";
import { HofEntryComponent } from "./config/upload-hall-of-fame/hof-entry.component";
import { ComJsonTree } from "./config/upload-hall-of-fame/com-json-tree.component";
import { TableListAppConfigComponent } from "./config/table-list-app-config/table-list-app-config.component";
import { AppConfigDialogComponent } from "./config/table-list-app-config/app-config-dialog.component";
import { IdeaStatusDetailDialogComponent  } from "./config/table-list-idea-status/idea-status-dialog.component";
import { UserDetailDialogComponent  } from "./config/table-list-user/user-dialog.component";
import { ProgressHalfCircleComponent } from "./dashboard/process-half-circle/process-half-circle.component";

import { ChartComponent } from "./dashboard/chart/chart.component";
import { ApprovalChartComponent } from "./dashboard/approval/approval-chart.component";
import { AppliedChartComponent } from "./dashboard/applied/applied-chart.component";

import { MonthPickerComponent } from "./dashboard/approval/month-picker.component";
import { YearPickerComponent } from "./dashboard/approval/year-picker.component";

import {  CategoryDivisionChartComponent} from "./reports/category-division/category-division-chart.component";
import {  SummaryDivisionChartComponent} from "./reports/division-summary/summary-division-chart.component";
import {  AccumulativeChartComponent} from "./reports/accumulative-ideas/accumulative-chart.component";
import {  CostSavingChartComponent} from "./reports/cost-saving-division/cost-saving-chart.component";
import {  TotalPersonChartComponent} from "./reports/total-ideas-person/total-person-chart.component";
import {  IndividualRecordsComponent} from "./reports/individual-records/individual-records.component";
 import { NgxEditorModule } from 'ngx-editor';
import { CurrencyMaskDirective } from "./directives/currency-mask.directive";
import { CurrencyI18nDirective } from "./directives/currency-i18n.directive";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as CanvasJSAngularChart from '../../assets/lib/canvasjs.angular.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;


@NgModule({
  declarations: [        
   ProgressBoxComponent,
   RankingComponent,
   StatusBoxComponent,
   StatusImgComponent,
   TableMyIdeasComponent,
   TableListIdeasComponent,
   DashboardComponent,
   ReportsComponent,
   ProfileComponent,
   ConfigComponent,
   ManualComponent,
   HallOfFameComponent,
   HomeComponent,
   FormCustomComponent,
   IdeasComponent,
   FormIdeasDetail ,
   IdeasCommand,
   IdeasProcessStep,
   IdeasProcessBar,
   SendemailDialogComponent,
   ConfirmStatusDialogComponent,
   ObjectTargetComponent,
   DashboardMyIdeaComponent,
   ProgressTargetComponent,
   FileuploadComponent,
   MemberVisiblePipe,
   CurrencyMaskDirective,
   CurrencyI18nDirective,
   TableListUserComponent,
   TableListLevelsComponent,
   TableListDivisionComponent,
   LevelDetailDialogComponent,
   DivisionDetailDialogComponent,
   TableListCategoryComponent,
   TableListIdeaStatusComponent,
   TableListRewardsComponent,
   TableListSubCategoryComponent,
   TargetSettingComponent,
   UploadHallOfFameComponent,
   UploadHallOfFameDetailDialogComponent,
   RewardsDetailDialogComponent,
   TargetSettingDetailDialogComponent,
   SubCategoryDetailDialogComponent,
   TableListAppConfigComponent,
   IdeaStatusDetailDialogComponent,
   ProgressHalfCircleComponent,
   ChartComponent,
   CanvasJSChart,
   ApprovalChartComponent,
   MonthPickerComponent,
   YearPickerComponent,
   AppliedChartComponent,
   UserDetailDialogComponent,
   CategoryDivisionChartComponent,
   SummaryDivisionChartComponent,
   AccumulativeChartComponent,
   CostSavingChartComponent,
   TotalPersonChartComponent,
   IndividualRecordsComponent,
   AppConfigDialogComponent, 
   ObjectTargetCustomComponent,HofEntryComponent,ComJsonTree

  ],
  
  imports: [
    BrowserModule,
    FormsModule,  
    MatlibModule,
    ReactiveFormsModule  ,
    NgxDropzoneModule,
    NgxEditorModule,BrowserAnimationsModule
      
  ],
  exports:[  ProgressBoxComponent,
    RankingComponent,
    StatusBoxComponent,
    StatusImgComponent,
    TableMyIdeasComponent,
    TableListIdeasComponent,
    DashboardComponent,
    ReportsComponent,
    ProfileComponent,
    ConfigComponent,
    ManualComponent,
    HallOfFameComponent,
    HomeComponent,
    FormCustomComponent,
    IdeasComponent,
    FormIdeasDetail,
    IdeasCommand,
    IdeasProcessStep,
    IdeasProcessBar,
    ObjectTargetComponent,
    DashboardMyIdeaComponent,
    ProgressTargetComponent,
    FileuploadComponent,
    ConfirmStatusDialogComponent,
    CurrencyMaskDirective,
    TableListUserComponent,
    TableListLevelsComponent,
    TableListDivisionComponent,
    LevelDetailDialogComponent,
    DivisionDetailDialogComponent,
    TableListCategoryComponent,
    TableListIdeaStatusComponent,
    TableListRewardsComponent,
    TableListSubCategoryComponent,
    TargetSettingComponent,
    UploadHallOfFameComponent,
    UploadHallOfFameDetailDialogComponent,
    RewardsDetailDialogComponent,
    TargetSettingDetailDialogComponent,
    SubCategoryDetailDialogComponent,
    TableListAppConfigComponent,
    IdeaStatusDetailDialogComponent,
    ProgressHalfCircleComponent,
    ChartComponent,
    CanvasJSChart,
    ApprovalChartComponent,
    MonthPickerComponent,
    YearPickerComponent,
    AppliedChartComponent,
    UserDetailDialogComponent,
    CategoryDivisionChartComponent,
    SummaryDivisionChartComponent,
    AccumulativeChartComponent,
    CostSavingChartComponent,
    TotalPersonChartComponent,
    IndividualRecordsComponent,
    AppConfigDialogComponent ,
    ObjectTargetCustomComponent,HofEntryComponent,ComJsonTree
   ],
    
  providers: [ ApiService,VariablesService,SnackBarComponent,DatePipe],
  bootstrap: []
})
export class FormCustomModule { }