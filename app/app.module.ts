import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }   from './components/app/app.component';
import { ObjectiveComponent }   from './components/objective/objective.component';
import { FeedbackComponent }   from './components/feedback/feedback.component';
import { routing } from './routing/app.routing';

@NgModule({
  imports: [
  	BrowserModule,
  	FormsModule,
  	routing
  ], 
  declarations: [ 
  	AppComponent,
  	ObjectiveComponent,
  	FeedbackComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
