import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PokeapiService } from '../services/pokeapi.service';
import { Router } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';


@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.page.html',
  styleUrls: ['./pokemon-details.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule]
})
export class PokemonDetailsPage implements OnInit {

  pokemonId!: number;
  pokemonDetails: any;
  loading = true;
  typesText = '';
  abilitiesText = '';
  movesText = '';
  previousForm: string | null = null; 
  previousFormData: any = null;
  isFavorite = false;
  backgroundColor: string = 'white';

  
  constructor(private route: ActivatedRoute, private pokeapi: PokeapiService,private router: Router,private favoritesService: FavoritesService) {}

  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pokemonId = +id;
        this.loadPokemonDetails();
      }
    });
  }


  loadPokemonDetails() {
    this.loading = true;

    this.isFavorite = this.favoritesService.isFavorite(this.pokemonId);
  
    this.pokeapi.getPokemonDetails(this.pokemonId.toString()).subscribe(data => {
      console.log('Detalhes do Pokémon:', data);
      this.pokemonDetails = data;
  
      this.typesText = data.types.map((t: any) => t.type.name).join(', ');
      this.abilitiesText = data.abilities.map((a: any) => a.ability.name).join(', ');
      this.movesText = data.moves.slice(0, 5).map((m: any) => m.move.name).join(', ');
    });
  
    this.pokeapi.getPokemonSpecies(this.pokemonId.toString()).subscribe((species: any) => {
      console.log('Dados da espécie:', species);
      const colorName = species.color?.name || 'white';
      this.backgroundColor = this.mapColor(colorName);
  
      const evolutionUrl = species.evolution_chain?.url;
      if (evolutionUrl) {
        this.pokeapi.getEvolutionChainByUrl(evolutionUrl).subscribe((chain: any) => {
          console.log('Evolução anterior:', chain);
  
          const currentName = species.name;
  
          const findPrevious = (node: any, prev: string | null = null): string | null => {
            if (node.species.name === currentName) {
              return prev;
            }
            for (const evo of node.evolves_to) {
              const found = findPrevious(evo, node.species.name);
              if (found) return found;
            }
            return null;
          };
  
          this.previousForm = findPrevious(chain.chain);
          console.log('Forma anterior:', this.previousForm);
  
          if (this.previousForm) {
            this.pokeapi.getPokemonByName(this.previousForm).subscribe((prevData: any) => {
              this.previousFormData = prevData;
              console.log('Dados da forma anterior:', prevData);
              this.loading = false; 
            });
          } else {
            this.loading = false; 
          }
        });
      } else {
        this.loading = false; 
      }
    });
  }

  toggleFavorite() {
    this.favoritesService.toggleFavorite(this.pokemonId);
    this.isFavorite = this.favoritesService.isFavorite(this.pokemonId);
  }
  
  mapColor(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      red: '#f28b82',
      blue: '#a3c2f0',
      green: '#a8e6cf',
      yellow: '#fff176',
      purple: '#d1c4e9',
      brown: '#bcaaa4',
      pink: '#f8bbd0',
      gray: '#e0e0e0',
      white: '#ffffff',
      black: '#bdbdbd'
    };
    return colorMap[colorName] || 'white';
  }

  goToDetails(id: number) {
    this.router.navigate(['/pokemon-details', id]);
  }

}
