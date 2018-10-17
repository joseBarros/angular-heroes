import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HeroesComponent} from './heroes/heroes.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';

// path: a string that matches the URL in the browser address bar.
// component: the component that the router should create when navigating to this route.
const routes: Routes = [
    // To make the app navigate to the dashboard automatically, add the following route to the AppRoutingModule.Routes array.
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'heroes', component: HeroesComponent},
    {path: 'dashboard', component: DashboardComponent},
    // The colon (:) in the path indicates that :id is a placeholder for a specific hero id.
    // Now the router creates the HeroDetailComponent in response to a URL such as ~/detail/11.
    { path: 'detail/:id', component: HeroDetailComponent },
];

// Exporting RouterModule makes router directives available for use in the AppModule components that will need them.
// The method is called forRoot() because you configure the router at the application's root level.
// The RouterOutlet is one of the router directives that became available to the AppComponent,
// because AppModule imports AppRoutingModule which exported RouterModule.
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
