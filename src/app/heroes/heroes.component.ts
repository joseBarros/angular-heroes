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
