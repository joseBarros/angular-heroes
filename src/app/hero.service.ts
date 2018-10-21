import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
    private messageService: MessageService) {
  }

  // You gave the HeroService get data method an asynchronous signature.
  // You used RxJS of() to return an observable of mock heroes (Observable<Hero[]>).
  // HttpClient.get returns untyped JSON object by default. Applying the optional type specifier, <Hero[]> , returns an object.
  // The catchError() operator intercepts an Observable that failed. It passes the error an error handler that can do what it wants with the error.
  //The following handleError() method reports the error and then returns an innocuous result so that the application keeps working.
  //The HeroService methods will tap into the flow of observable values and send a message (via log()) with the RxJS tap operator, which looks at the observable values, does something with those values, and passes them along.
  // The tap call back doesn't touch the values themselves.
  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError('getHeroes', []))
      );
  }

  // Like getHeroes(), getHero() has an asynchronous signature. It returns a mock hero as an Observable, using the RxJS of() function.
  // returns an Observable<Hero> ("an observable of Hero objects")
  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  // It returns an error handler function to catchError that it has configured with both the name of the operation that failed and a safe return value
  // Because each service method returns a different kind of Observable result, handleError() takes a type parameter so it can return the safe value as the type that the app expects.
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //uses http.put() to persist the changed hero on the server.
  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  //it expects the server to generates an id for the new hero, which it returns in the Observable<Hero> to the caller.
  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  //you don't send data as you did with put and post.
  // you still send the httpOptions.
  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  // The method returns immediately with an empty array if there is no search term. Resembles getHeroes(.
  // The only significant difference is the URL, which includes a query string with the search term.
  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
