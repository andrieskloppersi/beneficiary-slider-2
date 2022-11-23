import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// import { HelloComponent } from './hello.component';
import { BeneficiariesPayoutComponent } from './beneficiary/beneficiary.component';
import { NgxsModule } from '@ngxs/store';
import { BeneficiariesState } from './beneficiary/beneficiary.state';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([BeneficiariesState], {
      developmentMode: true,
    }),
  ],
  declarations: [AppComponent, BeneficiariesPayoutComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
