import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// You registered the HeroService as the provider of its service at the root level so that it can be injected anywhere in the app.
@Injectable({
    providedIn: 'root'
})
export class HeroService {

    private heroesUrl = 'api/heroes';  // URL to web api

    // Angular will inject the singleton MessageService into that property when it creates the HeroService.
    // Typical "service-in-service" scenario: you inject the MessageService into the HeroService which is injected into the HeroesComponent.
    // Inject HttpClient into the constructor in a private property called http.
    constructor(
        private http: HttpClient,
        private messageService: MessageService) { }

    // You gave the HeroService get data method an asynchronous signature.
    // You used RxJS of() to return an observable of mock heroes (Observable<Hero[]>).
    // HttpClient.get returns untyped JSON object by default. Applying the optional type specifier, <Hero[]> , returns an object.
    /** GET heroes from the server */
    getHeroes (): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
                catchError(this.handleError('getHeroes', []))
            );
    }

    // Like getHeroes(), getHero() has an asynchronous signature. It returns a mock hero as an Observable, using the RxJS of() function.
    getHero(id: number): Observable<Hero> {
        // TODO: send the message _after_ fetching the hero
        this.messageService.add(`HeroService: fetched hero id=${id}`);
        return of(HEROES.find(hero => hero.id === id));
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
