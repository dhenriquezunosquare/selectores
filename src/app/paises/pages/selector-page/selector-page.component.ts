import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { Pais } from '../../Interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  cargando: boolean = false;

  //Llenar selectores
  regiones: string[] = [];
  paises: Pais[] = [];
  fronteras:  Pais[] = [];
  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((r) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
          // this.miFormulario.get('frontera')?.reset('');
        })
      )
      .subscribe((region) => {
        this.seleccionarRegion(region);
        setTimeout(() => {
          this.cargando = false;
        }, 600);
      });

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((p) => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        })
      )
      .subscribe((pais) => {
        this.seleccionarFrontera(pais);
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }

  seleccionarRegion(region: string) {
    this.paisesService.getPaisesXRegion(region).subscribe((paises) => {
      this.paises = paises;
    });
  }

  seleccionarFrontera(pais: string) {
    if (pais) {
      this.paisesService.getPaisesXCodigo(pais).subscribe((paises: any) => {
        console.log(paises);
        const data= paises?.borders;
        this.formatearFronteras(data);
      });
    }
  }

  formatearFronteras(data: any) {
    if(data){
      this.paisesService.getPaisesXFrontera(data).subscribe((paises) => {
        this.fronteras= paises
      })
    }
  }


}
