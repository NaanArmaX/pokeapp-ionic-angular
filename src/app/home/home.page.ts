import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';  
import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../services/pokeapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 10;
  favorites: Set<number> = new Set();

  constructor(private pokeapi: PokeapiService,private router: Router) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokeapi.getPokemonList(this.offset, this.limit).subscribe((res) => {
      this.pokemons = res.results.map((poke: any) => {
        const id = this.getIdFromUrl(poke.url);
        return {
          name: poke.name,
          id,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          favorite: this.favorites.has(+id)
        };
      });
    });
  }

  getIdFromUrl(url: string): number {
    return +url.split('/').filter(Boolean).pop()!;
  }

/** Passar pra proxima pagina e anterior **/

  nextPage() {
    this.offset += this.limit;
    this.loadPokemons();
  }

  prevPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }


  goToDetails(pokemonId: number) {
    this.router.navigate(['/pokemon-details', pokemonId]);
  }
}
