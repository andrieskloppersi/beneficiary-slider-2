import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import { map, Observable, tap } from "rxjs";
import { IBeneficiary } from "../interfaces/beneficiary/beneficiary.interface";
import { BeneficiariesActions } from "./beneficiaries.actions";
import { BeneficiariesState } from "./beneficiary.state";

@Component({
  selector: 'livin-beneficiaries-payout',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss'],
})
export class BeneficiariesPayoutComponent implements OnInit {
  beneficiaries$!: Observable<Array<IBeneficiary>>;

  // orig = {
  // 	beneficiaries: {
  // 		beneficiaries: [
  // 			{

  // 				DateOfBirth: 'ads',
  // 				Email: 'andries@idealsolution.co.za',
  // 				Name: 'Andries Kloppers',
  // 				Percentage: 20,
  // 				PersonalRelation: 'spouse',
  // 				PhoneNumber: '0613852367',
  // 				RsaIdNumber: 'asd',
  // 			},
  // 			{
  // 				DateOfBirth: 'asdsada',
  // 				Email: 'dasdas',
  // 				Name: 'Rhenier Kloppers',
  // 				Percentage: 20,
  // 				PersonalRelation: 'spouse',
  // 				PhoneNumber: 'asdasda',
  // 				RsaIdNumber: 'dasdsad',
  // 			},
  // 			{
  // 				DateOfBirth: 'qweassd',
  // 				Email: 'asdasda',
  // 				Name: 'Ma Kloppers',
  // 				Percentage: 20,
  // 				PersonalRelation: 'parent',
  // 				PhoneNumber: 'asdasd',
  // 				RsaIdNumber: 'adasd',
  // 			},
  // 			{
  // 				DateOfBirth: 'asdsadsad',
  // 				Email: 'dasdasdasd',
  // 				Name: 'Pa Kloppers',
  // 				Percentage: 20,
  // 				PersonalRelation: 'spouse',
  // 				PhoneNumber: 'asdasdasda',
  // 				RsaIdNumber: 'sadsadas',
  // 			},
  // 			{
  // 				DateOfBirth: 'sdasdas',
  // 				Email: 'asdas',
  // 				Name: 'Jaco Kloppers',
  // 				Percentage: 20,
  // 				PersonalRelation: 'spouse',
  // 				PhoneNumber: 'dasdasdasd',
  // 				RsaIdNumber: 'dsadsadas',
  // 			},
  // 		],
  // 	},
  // };

  // TODO: Is this even helping? point of this is for store to fire the callback that allows a change only when its done with its change
  // To prevent a possibility of UI mismatching what is currently being executed at the store and then dispatching new actions based on bad state..
  allowChange = true;
  @Select(BeneficiariesState.loading) loading$!: Observable<boolean>;
  loading = false;

  constructor(
    private store: Store,
    // private router: Router,
    // private activatedRoute: ActivatedRoute
  ) {}

  trackBeneficiaries(index: number, beneficiary: IBeneficiary) {
    return beneficiary.DateOfBirth + beneficiary.Name;
  }

  // reset() {
  // 	const action = new BeneficiariesActions.Set(
  // 		this.orig['beneficiaries']['beneficiaries']
  // 	);
  // 	this.store.dispatch(action);
  // }

  async ngOnInit() {

    
    this.store.dispatch(new BeneficiariesActions.Load());

    const sortBeneficiariesAction =
      new BeneficiariesActions.SortBeneficiaries();

    // this.store.subscribe((store) => {
    //   console.log('store', store);
    // });

    this.store.dispatch(sortBeneficiariesAction); 
    this.beneficiaries$ = this.store
      .select((state) => state.beneficiaries)
      .pipe(
        map((v) => v.beneficiaries),
        tap((v) => {
          this.allowChange = false;
          for (let i = 0; i < v.length; i++) {
            const inputRef: HTMLInputElement | null = document.querySelector(
              `input[data-beneficiary-input="beneficiary-${i}"]`
            );
            if (inputRef) {
              inputRef.value = v[i].Percentage.toString();
            }
            if (i === v.length - 1) {
              this.allowChange = true;
            }
          }
        })
      );

    // this.loading$ = this.store.select((state) => state.beneficiaries.loading);

    this.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  async change(idx: number, event: any) {
    console.log(this.allowChange);
    if (this.allowChange) {
      const action = new BeneficiariesActions.UpdatePayout(
        idx,
        parseInt(event.target.value, 10),
        () => {
          this.allowChange = true;
        }
      );
      this.allowChange = false;
      await this.store.dispatch(action);
    }
  }

  continue() {
    const sortBeneficiariesAction =
      new BeneficiariesActions.SortBeneficiaries();
    this.store.dispatch(sortBeneficiariesAction);
    // this.router.navigate(['../entry'], {
    //   relativeTo: this.activatedRoute,
    // });

    const persistAction = new BeneficiariesActions.Persist();
    this.store.dispatch(persistAction);
  }
}
