import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HeroesComponent} from './heroes/heroes.component';
import {DashboardComponent} from './dashboard/dashboard.component';

// path: a string that matches the URL in the browser address bar.
// component: the component that the router should create when navigating to this route.
const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'heroes', component: HeroesComponent},
    {path: 'dashboard', component: DashboardComponent},
];

// Exporting RouterModule makes router directives available for use in the AppModule components that will need them.
// The method is called forRoot() because you configure the router at the application's root level.
// The RouterOutlet is one of the router directives that became available to the AppComponent because AppModule imports AppRoutingModule which exported RouterModule.
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
