import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

//You registered the HeroService as the provider of its service at the root level so that it can be injected anywhere in the app.
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  //Angular will inject the singleton MessageService into that property when it creates the HeroService.
  //This is a typical "service-in-service" scenario: you inject the MessageService into the HeroService which is injected into the HeroesComponent.
  constructor(private messageService: MessageService) { }

  //You gave the HeroService get data method an asynchronous signature.
  //You used RxJS of() to return an observable of mock heroes (Observable<Hero[]>).
  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }
}
