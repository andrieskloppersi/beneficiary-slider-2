import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBeneficiary } from '../../interfaces/beneficiary/beneficiary.interface';
import { ITextValue } from '../../interfaces/text-value/text-value.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface GetBeneficiariesPageResponse {
  Beneficiaries: IBeneficiary[];
}

// export interface PostPaymentPageRequest {
// 	Disclosures: IDisclosure[];
// 	AuthenticationType?: boolean;
// }

@Injectable({
  providedIn: 'root',
})
export class BeneficiariesService {
  /** @description Access environment variables */
  // private readonly environment = environment;

  constructor(private readonly httpClient: HttpClient) {}

  public getPage(): Observable<GetBeneficiariesPageResponse> {
    const beneficiaries: GetBeneficiariesPageResponse = {
      Beneficiaries: [
        {
          Name: 'Sarah Walker',
          DateOfBirth: '1990/01/01',
          Email: 'sarah.walker@cia.gov',
          Percentage: 25,
          PersonalRelation: 'spouse',
          PhoneNumber: '0843134455',
          RsaIdNumber: '8803065759085',
          BankingDetailId: '1',
          Id: '1',
          BankingDetails: {
            BranchCode: '250655',
            AccountHolder: 'MRS SARAH WALKER',
            AccountNumber: '62847411808',
            AccountType: 'cheque',
            BankName: 'First National Bank (South Africa)',
            Name: "Mrs Sarah Walker's Bank Account",
            Id: '1',
          },
        },
        {
          Name: 'John Casey',
          DateOfBirth: '1990/01/01',
          Email: 'john.walker@cia.gov',
          Percentage: 25,
          PersonalRelation: 'child',
          PhoneNumber: '0743134455',
          RsaIdNumber: '8703065759085',
          BankingDetailId: '2',
          Id: '2',
          BankingDetails: {
            BranchCode: '240655',
            AccountHolder: 'MR JOHN CASEY',
            AccountNumber: '62847411807',
            AccountType: 'cheque',
            BankName: 'First National Bank (South Africa)',
            Name: "Mrs Sarah Walker's Bank Account",
            Id: '2',
          },
        },
        {
          Name: 'Chuck Bartowski',
          DateOfBirth: '1990/01/01',
          Email: 'chuck.bartowski@nerdherd.com',
          Percentage: 25,
          PersonalRelation: 'spouse',
          PhoneNumber: '0643134455',
          RsaIdNumber: '8203065759085',
          BankingDetailId: '3',
          Id: '3',
          BankingDetails: {
            BranchCode: '250655',
            AccountHolder: 'MR CHUCK BARTOWSKI',
            AccountNumber: '62847411808',
            AccountType: 'cheque',
            BankName: 'First National Bank (South Africa)',
            Name: "Mrs Sarah Walker's Bank Account",
            Id: '3',
          },
        },
        {
          Name: 'Captain Awesome',
          DateOfBirth: '1990/01/01',
          Email: 'captain.awesome@awesome.gov',
          Percentage: 25,
          PersonalRelation: 'spouse',
          PhoneNumber: '0833134455',
          RsaIdNumber: '8433065759085',
          BankingDetailId: '1',
          Id: '1',
          BankingDetails: {
            BranchCode: '250655',
            AccountHolder: 'MRS SARAH WALKER',
            AccountNumber: '61847411808',
            AccountType: 'cheque',
            BankName: 'First National Bank (South Africa)',
            Name: "Mrs Sarah Walker's Bank Account",
            Id: '1',
          },
        },
      ],
    };
    return of(beneficiaries);
  }

  // public updatePage(body: IBeneficiariesPagePostRequest): Observable<void> {
  // 	// return this.httpClient.put<void>(`${this.environment.HOST}/sales-process/${this.sharedService.quoteSubject$.value.salesProcessId}/web/beneficiaries`, body);
  // }

  // public postPage(
  // 	body: IBeneficiariesPagePostRequest
  // ): Observable<IBeneficiariesPagePostResponse> {
  // 	// return this.httpClient.post<IBeneficiariesPagePostResponse>(
  // 	// 	`${this.environment.HOST}/sales-process/${this.sharedService.quoteSubject$.value.salesProcessId}/web/beneficiaries`,
  // 	// 	body
  // 	// );
  // }
}
