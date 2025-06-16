import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private storageKey = 'favoritePokemons';
  private favoritesSet: Set<number>;
  private favoritesSubject: BehaviorSubject<Set<number>>;

 
  favorites$;

  constructor() {
    const stored = localStorage.getItem(this.storageKey);
    const initialFavorites = stored ? JSON.parse(stored) : [];
    this.favoritesSet = new Set<number>(initialFavorites);

    this.favoritesSubject = new BehaviorSubject(this.favoritesSet);
    this.favorites$ = this.favoritesSubject.asObservable();
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.favoritesSet)));
  }

  getFavorites(): number[] {
    return Array.from(this.favoritesSet);
  }

  isFavorite(id: number): boolean {
    return this.favoritesSet.has(id);
  }

  addFavorite(id: number): void {
    if (!this.favoritesSet.has(id)) {
      this.favoritesSet.add(id);
      this.save();
      this.favoritesSubject.next(this.favoritesSet);
    }
  }

  removeFavorite(id: number): void {
    if (this.favoritesSet.has(id)) {
      this.favoritesSet.delete(id);
      this.save();
      this.favoritesSubject.next(this.favoritesSet);
    }
  }

  toggleFavorite(id: number): void {
    if (this.isFavorite(id)) {
      this.removeFavorite(id);
    } else {
      this.addFavorite(id);
    }
  }
}
