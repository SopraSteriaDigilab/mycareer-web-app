import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjectiveComponent } from '../components/objective/objective.component';
import { FeedbackComponent } from '../components/feedback/feedback.component';


const appRoutes: Routes = [
  {
    path: 'objective',
    component: ObjectiveComponent
  },
  {
	  path: '',
	  redirectTo: '/objective',
	  pathMatch: 'full'
	},
	{
    path: 'feedback',
    component: FeedbackComponent
  },


];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
