import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  // This asynchronous approach will work when the HeroService requests heroes from the server.
  // waits for the Observable to emit the array of heroes— which could happen now or several minutes from now.
  // Then subscribe passes the emitted array to the callback, which sets the component's heroes property.
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  //When the given name is non-blank, the handler creates a Hero-like object from the name (it's only missing the id) and passes it to the services addHero() method.
  //When addHero saves successfully, the subscribe callback receives the new hero and pushes it into to the heroes list for display.
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  // Although the component delegates hero deletion to the HeroService, it remains responsible for updating its own list of heroes.
  // The component's delete() method immediately removes the hero-to-delete from that list, anticipating that the HeroService will succeed on the server.
  // There's really nothing for the component to do with the Observable returned by heroService.delete(). It must subscribe anyway.
  // If you neglect to subscribe(), the service will not send the delete request to the server! As a rule, an Observable does nothing until something subscribes!
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  // Reserve the constructor for simple initialization such as wiring constructor parameters to properties.
  // While you could call getHeroes() in the constructor, that's not the best practice.
  // Angular will inject the singleton HeroService into that property when it creates the HeroesComponent.
  // The HeroService injected into a component is created with another injected service, MessageService.
  constructor(private heroService: HeroService) { }

  // Instead, call getHeroes() inside the ngOnInit lifecycle hook and let Angular call ngOnInit at an appropriate time after constructing a HeroesComponent instance.
  // The component's ngOnInit lifecycle hook calls the HeroService method, not the constructor.
  ngOnInit() {
    this.getHeroes();
  }

}
