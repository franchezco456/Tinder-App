import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './components/input/input.component';
import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { Images } from './services/images/images';

@NgModule({
  declarations: [InputComponent, CardComponent, ButtonComponent],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [InputComponent, CardComponent, ButtonComponent]
})
export class SharedModule { }
