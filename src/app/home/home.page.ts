import { CommonModule } from '@angular/common'; 
import { IonicModule,PopoverController  } from '@ionic/angular';  
import { Component, OnInit } from '@angular/core';
import { PokeapiService } from '../services/pokeapi.service';
import { Router } from '@angular/router';
import { FavoritesListComponent } from '../favorites-list/favorites-list.component';
import { FavoritesService } from '../services/favorites.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FavoritesListComponent
  ]
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  offset = 0;
  limit = 10;
  searchTerm: string = ''; 
  filteredPokemons: any[] = [];
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
      this.filteredPokemons = this.pokemons; 
    });
  }

  filterPokemons() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPokemons = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(term)
    );
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.filterPokemons();
  }

  getIdFromUrl(url: string): number {
    return +url.split('/').filter(Boolean).pop()!;
  }

  getFavoritePokemons() {
    return this.pokemons.filter(pokemon => this.favorites.has(pokemon.id));
  }

  async openFavorites(ev: any) {
    
    const favIds = new Set(this.favoritesService.getFavorites());
    const favoritosComStatusAtualizado = this.pokemons
      .filter(pokemon => favIds.has(pokemon.id))
      .map(pokemon => ({ ...pokemon, favorite: true }));
    const popover = await this.popoverCtrl.create({
      component: FavoritesListComponent,
      event: ev,
      translucent: true,
      componentProps: {
        favorites: favoritosComStatusAtualizado,
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
