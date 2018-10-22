import {Component, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {
    debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
    selector: 'app-hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css']
})

// Remember that the component class does not subscribe to the heroes$ observable. That's the job of the AsyncPipe in the template.
export class HeroSearchComponent implements OnInit {
    // declaration of heroes$ as an Observable
    heroes$: Observable<Hero[]>;
    // searchTerms property is declared as an RxJS Subject.
    // A Subject is both a source of observable values and an Observable itself
    private searchTerms = new Subject<string>();

    constructor(private heroService: HeroService) {
    }

    // Push a search term into the observable stream.
    // Every time the user types in the textbox, the binding calls search() with the textbox value, a "search term". The searchTerms becomes an Observable emitting a steady stream of search terms.
    search(term: string): void {
        this.searchTerms.next(term);
    }

    // ngOnInit() method pipes the searchTerms observable through a sequence of RxJS operators that reduce the number of calls to the searchHeroes(), ultimately returning an observable of timely hero search results (each a Hero[]).
    ngOnInit(): void {
        this.heroes$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            // preserves the original request order while returning only the observable from the most recent HTTP method call. Results from prior calls are canceled and discarded.
            // Note that canceling a previous searchHeroes() Observable doesn't actually abort a pending HTTP request. Unwanted results are simply discarded before they reach your application code.
            switchMap((term: string) => this.heroService.searchHeroes(term)),
        );
    }
}
