import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Pais } from '../Interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones:string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(){
    return [...this._regiones];
  }

  constructor(private http:HttpClient) { }

  getPaisesXRegion(region:string){
    return this.http.get<Pais[]>(`https://restcountries.com/v2/region/${region}?fields=name,alpha3Code`);
  }

  getPaisesXCodigo(pais:string){
    return this.http.get(`https://restcountries.com/v2/alpha/${pais}`);
  }

  getPaisXCodigo(codigo:string){
    return this.http.get<Pais>(`https://restcountries.com/v2/alpha/${codigo}?fields=name,alpha3Code`)
  }

  getPaisesXFrontera(borders:string[]){
    const peticiones:Observable<Pais>[]=[];

    borders.forEach(element => {
      const peticion= this.getPaisXCodigo(element);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);

  }
}
