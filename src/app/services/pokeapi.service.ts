 /** Importações **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}
/** Busca uma lista de Poke **/
  getPokemonList(offset: number = 0, limit: number = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`);
  }
/** Busca um poke especifico **/
  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  getPokemonSpecies(id: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  }

  getEvolutionChainByUrl(url: string) {
    return this.http.get(url);
  }

  getPokemonByName(name: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}
