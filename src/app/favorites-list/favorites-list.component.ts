import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../services/favorites.service';  

@Component({
  standalone: true,
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class FavoritesListComponent {
  @Input() favorites: any[] = [];
  @Input() toggleFavorite!: (id: number) => void;

  constructor(private favoritesService: FavoritesService) {}

  onToggleFavorite(id: number) {
    this.toggleFavorite(id);
   
    this.favorites = this.favorites.map(p => {
      if (p.id === id) {
        return { ...p, favorite: !p.favorite };
      }
      return p;
    });
  }
}
