import { CommonModule } from '@angular/common'; 
import { IonicModule,PopoverController  } from '@ionic/angular';  
import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../services/pokeapi.service';
import { Router } from '@angular/router';
import { FavoritesListComponent } from '../favorites-list/favorites-list.component';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FavoritesListComponent
  ]
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 10;
  favorites: Set<number> = new Set();

  constructor(private pokeapi: PokeapiService,private router: Router,private popoverCtrl: PopoverController,private favoritesService: FavoritesService) {}

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
          favorite: this.favoritesService.isFavorite(id)
        };
      });
    });
  }

  getIdFromUrl(url: string): number {
    return +url.split('/').filter(Boolean).pop()!;
  }

  getFavoritePokemons() {
    return this.pokemons.filter(pokemon => this.favorites.has(pokemon.id));
  }

  async openFavorites(ev: any) {
    const favoritePokemons = this.pokemons.filter(p => this.favoritesService.isFavorite(p.id));
    const popover = await this.popoverCtrl.create({
      component: FavoritesListComponent,
      event: ev,
      translucent: true,
      componentProps: {
        favorites: favoritePokemons,
        toggleFavorite: this.toggleFavorite.bind(this)
      }
    });
    await popover.present();
  }

  toggleFavorite(pokemonId: number) {
    this.favoritesService.toggleFavorite(pokemonId);
    this.loadPokemons();
  }

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
