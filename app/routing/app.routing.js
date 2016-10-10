"use strict";
var router_1 = require('@angular/router');
var objective_component_1 = require('../components/objective/objective.component');
var feedback_component_1 = require('../components/feedback/feedback.component');
var appRoutes = [
    {
        path: 'objective',
        component: objective_component_1.ObjectiveComponent
    },
    {
        path: '',
        redirectTo: '/objective',
        pathMatch: 'full'
    },
    {
        path: 'feedback',
        component: feedback_component_1.FeedbackComponent
    },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map