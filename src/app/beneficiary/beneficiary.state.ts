import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBeneficiariesPagePostRequest, IBeneficiary } from '../interfaces/beneficiary/beneficiary.interface';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BeneficiariesService } from '../services/beneficiaries/beneficiaries.service';
import { firstValueFrom, map } from 'rxjs';
import { BeneficiariesActions } from './beneficiaries.actions';

export interface BeneficiariesStateModel {
  submitting: boolean;
  loading: boolean;
  loadingPolicyDone: boolean;
  beneficiaryLoader: boolean;
  beneficiaries: Array<IBeneficiary>;
  policyNumber: string | null;
  firstName: string | null;
}

@State<BeneficiariesStateModel>({
  name: 'beneficiaries',
  defaults: {
    submitting: false,
    loading: false,
    loadingPolicyDone: false,
    beneficiaryLoader: false,
    beneficiaries: [],
    policyNumber: null,
    firstName: null,
  },
})
@Injectable()
export class BeneficiariesState {
  public constructor(
    private readonly beneficiariesService: BeneficiariesService,
    private ngZone: NgZone,
    // private router: Router,
    // private route: ActivatedRoute
  ) {}

  @Selector()
  static beneficiaries(state: BeneficiariesStateModel) {
    return state.beneficiaries;
  }

  @Selector()
  static submitting(state: BeneficiariesStateModel) {
    return state.submitting;
  }

  @Selector()
  static loading(state: BeneficiariesStateModel) {
    return state.loading;
  }

  @Selector()
  static loadingPolicyDone(state: BeneficiariesStateModel) {
    return state.loadingPolicyDone;
  }

  @Selector()
  static beneficiaryLoader(state: BeneficiariesStateModel) {
    return state.beneficiaryLoader;
  }

  @Selector()
  static policyNumber(state: BeneficiariesStateModel) {
    return state.policyNumber;
  }

  @Action(BeneficiariesActions.Add)
  addBeneficiary(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.Add
  ) {
    const state = ctx.getState();
    ctx.patchState({
      beneficiaries: [...state.beneficiaries, action.beneficiary],
    });
  }

  @Action(BeneficiariesActions.Load)
  async load(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.Load
  ) {
    const state = ctx.getState();

    ctx.patchState({
      loading: true,
    });

    try {
      const beneficiariesPageResponse = this.beneficiariesService
        .getPage();

      const response = await firstValueFrom(beneficiariesPageResponse);
      if (response) {
        ctx.patchState({
          beneficiaries: response.Beneficiaries ? response?.Beneficiaries : [],
        });
      }
    } finally {
      ctx.patchState({
        loading: false,
      });
    }
  }

  @Action(BeneficiariesActions.Remove)
  removeBeneficiary(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.Remove
  ) {
    const state = ctx.getState();
    let lowestIndex = 0;
    // Lets keep this action specific to beneficiares payout page.
    // There should always be atleast 1 beneficiary
    // TODO: If you remove the last beneficiary, with this logic then it doesn't actually remove the last one and ups it's percentage to 200%.
    // Not a problem since as mentioned there should always be 1 beneficiary but something to note or fix if have the leisure.
    if (state.beneficiaries.length > 1) {
      for (let i = 0; i < state.beneficiaries.length; i++) {
        if (i != action.index) {
          lowestIndex = i;
          break;
        }
      }

      const beneficiaries: Array<IBeneficiary> = state.beneficiaries.reduce<
        Array<IBeneficiary>
      >((bens, ben, idx) => {
        let percentageToAdd = 0;
        // Get lowest index that wasn't removed

        if (idx == lowestIndex) {
          return [
            ...bens,
            {
              ...ben,
              Percentage:
                ben.Percentage + state.beneficiaries[action.index].Percentage,
            },
          ];
        } else if (idx !== action.index) {
          return [...bens, ben];
        } else {
          return [...bens];
        }
      }, []);

      ctx.patchState({
        beneficiaries,
      });
    }

    // this.router.navigate(['/quote/beneficiaries/payout']);
  }

  @Action(BeneficiariesActions.Update)
  updateBeneficiary(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.Update
  ) {
    const state = ctx.getState();

    const beneficiaries: Array<IBeneficiary> = state.beneficiaries.reduce<
      Array<IBeneficiary>
    >((bens, ben, idx) => {
      if (idx !== action.index) {
        return [...bens, ben];
      } else {
        return [...bens];
      }
    }, []);

    ctx.patchState({
      beneficiaries,
    });
  }

  @Action(BeneficiariesActions.SaveEdit)
  async saveEdit(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.SaveEdit
  ) {
    const state = ctx.getState();

    ctx.patchState({
      loading: true,
    });

    let beneficiaries = state.beneficiaries.reduce<Array<IBeneficiary>>(
      (bens, ben, idx) => {
        if (idx == action.index) {
          return [
            ...bens,
            {
              ...ben,
              ...action.beneficiary,
            },
          ];
        } else {
          return [...bens, ben];
        }
      },
      []
    );

    try {
      const body: IBeneficiariesPagePostRequest = {
        Beneficiaries: beneficiaries,
      };

      // await firstValueFrom(this.beneficiariesService.updatePage(body));
    } finally {
      ctx.patchState({
        loading: false,
      });
    }

    ctx.patchState({
      beneficiaries,
    });
  }

  @Action(BeneficiariesActions.Persist)
  async persist(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.Persist
  ) {
    const state = ctx.getState();

    const body: IBeneficiariesPagePostRequest = {
      Beneficiaries: state.beneficiaries,
    };

    // await firstValueFrom(this.beneficiariesService.updatePage(body));
  }

  @Action(BeneficiariesActions.AddWithPayoutLogic)
  async addBeneficiaryWithPayoutLogic(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.AddWithPayoutLogic
  ) {
    ctx.patchState({
      beneficiaryLoader: true,
    });

    const state = ctx.getState();

    let beneficiaries: Array<IBeneficiary> = [];
    if (state.beneficiaries.length > 0) {
      beneficiaries = state.beneficiaries.reduce<Array<IBeneficiary>>(
        (bens, ben, idx) => {
          if (idx == 0) {
            return [
              ...bens,
              {
                ...ben,
                Percentage: ben.Percentage - 5,
              },
            ];
          } else {
            return [...bens, ben];
          }
        },
        []
      );
      action.beneficiary.Percentage = 5;
      beneficiaries.push(action.beneficiary);
    } else {
      action.beneficiary.Percentage = 100;
      beneficiaries = [...state.beneficiaries, action.beneficiary];
    }

    beneficiaries = beneficiaries.sort((a, b) => {
      if (a.Percentage > b.Percentage) {
        return -1;
      } else if (a.Percentage < b.Percentage) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log('beneficiaries', beneficiaries);

    // const beneficiaries = await firstValueFrom(
    // 	this.store.select((state) => state.beneficiaries.beneficiaries)
    // );

    const body: IBeneficiariesPagePostRequest = {
      Beneficiaries: beneficiaries,
    };

    // await firstValueFrom(this.beneficiariesService.updatePage(body));

    ctx.patchState({
      beneficiaries,
    });
  }

  @Action(BeneficiariesActions.SortBeneficiaries)
  sortBeneficiaries(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.SortBeneficiaries
  ) {
    let beneficiaries = [...ctx.getState().beneficiaries];
    beneficiaries = beneficiaries.sort((a, b) => {
      if (a.Percentage > b.Percentage) {
        return -1;
      } else if (a.Percentage < b.Percentage) {
        return 1;
      } else {
        return 0;
      }
    });
    ctx.patchState({
      beneficiaries,
    });
  }

  @Action(BeneficiariesActions.Set)
  setBeneficiaries(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.Set
  ) {
    const state = ctx.getState();
    ctx.patchState({
      beneficiaries: action.beneficiaries,
    });
  }

  @Action(BeneficiariesActions.PostPage)
  async postPage(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.PostPage
  ) {
    const state = ctx.getState();

    ctx.patchState({
      submitting: true,
    });

    const body: IBeneficiariesPagePostRequest = {
      Beneficiaries: state.beneficiaries,
    };
    let response: any;
    try {
      // response = await firstValueFrom(this.beneficiariesService.postPage(body));
      console.log(response);
      ctx.patchState({
        policyNumber: response.PolicyNumber,
        firstName: response.FirstName,
      });
      // this.ngZone.run(() => {
      // 	this.router.navigate(['/quote/beneficiaries/finish'], {
      // 		relativeTo: this.route,
      // 	});
      // });
    } catch (e) {
      ctx.patchState({
        submitting: false,
      });
      throw e;
    } finally {
      if (response) {
        ctx.patchState({
          loadingPolicyDone: true,
        });
        // setTimeout(() => {
        //   this.dialogService
        //     .open(WelcomeToTheRoyalFamilyComponent, {
        //       styleClass: 'max-w-full max-h-full w-full h-full',
        //       closeOnEscape: false,
        //       data: {
        //         name: response.FirstName,
        //         policyNumber: response.PolicyNumber,
        //         sspUrl: response.SspUrl,
        //       },
        //       showHeader: false,
        //     })
        //     .onClose.subscribe({
        //       next: () => {
        //         this.router.navigate(['/']);
        //       },
        //     });
        //   ctx.patchState({
        //     loadingPolicyDone: false,
        //   });
        //   ctx.patchState({
        //     submitting: false,
        //   });
        // }, 2000);
      }
    }
  }

  @Action(BeneficiariesActions.PostPageAgent)
  async postPageAgent(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.PostPage
  ) {
    const state = ctx.getState();

    ctx.patchState({
      submitting: true,
    });

    const body: IBeneficiariesPagePostRequest = {
      Beneficiaries: state.beneficiaries,
    };
    let response: any;
    try {
      // response = await firstValueFrom(this.beneficiariesService.postPage(body));
      // console.log(response);
      ctx.patchState({
        policyNumber: response.PolicyNumber,
        firstName: response.FirstName,
      });
      // this.ngZone.run(() => {
      // 	this.router.navigate(['/quote/beneficiaries/finish'], {
      // 		relativeTo: this.route,
      // 	});
      // });
    } catch (e) {
      ctx.patchState({
        submitting: false,
      });
      throw e;
    } finally {
      if (response) {
        ctx.patchState({
          loadingPolicyDone: true,
        });
        setTimeout(() => {
          ctx.patchState({
            loadingPolicyDone: false,
          });
          ctx.patchState({
            submitting: false,
          });
          // this.router.navigate(['/quote/welcome-to-the-royal-family'], {
          //   state: {
          //     data: {
          //       firstName: response.FirstName,
          //       policyNumber: response.PolicyNumber,
          //     },
          //   },
          // });
        }, 2000);
      }
    }
  }

  @Action(BeneficiariesActions.UpdatePayout)
  async updateBeneficiaryPayout(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.UpdatePayout
  ) {
    const max = 100;
    const min = 5;

    const constrain = (value: number) => {
      value = Math.max(value, min);
      value = Math.min(value, max);
      return value;
    };

    const state = ctx.getState();

    let beneficiaries: Array<IBeneficiary> = [...state.beneficiaries];

    let diff =
      constrain(action.percentage) -
      state.beneficiaries[action.index].Percentage;

    const step = diff > 0 ? -1 : 1;

    while (diff > 0) {
      let allowChange = false;
      for (let i = 0; i < beneficiaries.length; i++) {
        // && i != beneficiaries.length - 1
        if (
          beneficiaries[i].Percentage > 5 &&
          i != action.index &&
          i > action.index
        ) {
          allowChange = true;
        }
      }
      if (allowChange == false) {
        // Exit
        action.cb();
        return;
      }

      let toChangeIdx = action.index + 1;
      while (beneficiaries[toChangeIdx].Percentage <= min) {
        toChangeIdx += 1;
      }

      beneficiaries = beneficiaries.reduce<Array<IBeneficiary>>(
        (bens, ben, idx) => {
          const curBenPerc = ben.Percentage;
          // If its the active slider

          if (idx == action.index) {
            console.log('[-- Active --]');
            console.log(action.percentage);
            // console.log('[-- Active --]');
            return [
              ...bens,
              {
                ...ben,
                Percentage: action.percentage,
              },
            ];
          } else if (idx == toChangeIdx) {
            console.log('[-- To Change --]');
            console.log('Step: ' + step);
            console.log('change is to change index:', ben.Percentage + step);
            // console.log('[-- To Change Beneficiary --]');
            return [
              ...bens,
              {
                ...ben,
                Percentage: ben.Percentage + step,
              },
            ];
          } else {
            return [
              ...bens,
              {
                ...ben,
              },
            ];
          }
        },
        []
      );
      // END
      diff--;
    }

    // const body: IBeneficiariesPagePostRequest = {
    // 	Beneficiaries: beneficiaries,
    // };

    // await firstValueFrom(this.beneficiariesService.updatePage(body));

    ctx.patchState({
      beneficiaries,
    });
    action.cb();
  }

  @Action(BeneficiariesActions.UpdatePayout)
  updateBeneficiaryPayoutOld(
    ctx: StateContext<BeneficiariesStateModel>,
    action: BeneficiariesActions.UpdatePayout
  ) {
    const state = ctx.getState();

    let beneficiaries: Array<IBeneficiary> = [...state.beneficiaries];

    let pool = state.beneficiaries.filter(
      (b, idx) => b.Percentage > 5 && idx != action.index
    );
    const lowerPool = state.beneficiaries.filter(
      (b, idx) => idx > action.index
    );
    let _max = [...state.beneficiaries].sort(
      (a, b) => b.Percentage - a.Percentage
    );
    let max = _max[0];
    const maxIndex = state.beneficiaries.indexOf(max);

    const maxVal = 100 - (state.beneficiaries.length - 1) * 5;
    const less =
      state.beneficiaries[action.index].Percentage - action.percentage > 0;

    const diff = Math.abs(
      state.beneficiaries[action.index].Percentage - action.percentage
    );
    // Can't change last beneficiary directly. Use different sliders for that.
    if (action.index != beneficiaries.length - 1) {
      for (let i = 0; i < diff; i++) {
        let diffApplied = false;
        beneficiaries = beneficiaries.reduce<Array<IBeneficiary>>(
          (bens, ben, idx) => {
            pool = beneficiaries.filter(
              (b, _idx) => b.Percentage > 5 && _idx != action.index
            );
            // console.log('pool.indexOf(ben)', pool.indexOf(ben));
            // console.log('action.index', action.index);
            // console.log('pool.indexOf(ben) - action.index', pool.indexOf(ben) - action.index);
            // console.log('----------------------------------------------');
            // console.log('lowerPool.indexOf(ben)', lowerPool.indexOf(ben));
            // console.log('action.index - action.index', action.index - action.index);
            // console.log(lowerPool.indexOf(ben) - action.index - action.index);
            // console.log('----------------------------------------------');
            // console.log('----------------------------------------------');
            if (action.percentage <= maxVal) {
              if ((pool.indexOf(ben) > -1 || less) && action.percentage >= 5) {
                if (beneficiaries.indexOf(ben) > action.index) {
                  if (
                    (pool.indexOf(ben) - action.index === 0 ||
                      (less &&
                        lowerPool.indexOf(ben) -
                          (action.index - action.index) ===
                          0)) &&
                    !diffApplied
                  ) {
                    diffApplied = true;
                    return [
                      ...bens,
                      {
                        ...ben,
                        Percentage: less
                          ? ben.Percentage + 1
                          : ben.Percentage - 1,
                      },
                    ];
                  }
                } else if (action.index === idx) {
                  if (action.percentage <= maxVal) {
                    return [
                      ...bens,
                      {
                        ...ben,
                        Percentage: action.percentage,
                      },
                    ];
                  } else {
                  }
                } else {
                  return [...bens, ben];
                }
              } else {
                if (action.index === idx && action.percentage >= 5) {
                  const isBensInPoolLowerThanCur =
                    pool.filter((b, __idx) => __idx >= action.index).length > 0;
                  if (action.percentage <= maxVal && isBensInPoolLowerThanCur) {
                    return [
                      ...bens,
                      {
                        ...ben,
                        Percentage: less
                          ? ben.Percentage - 1
                          : ben.Percentage + 1,
                      },
                    ];
                  } else {
                    return [...bens, ben];
                  }
                }
              }
            }
            return [...bens, ben];
          },
          []
        );
      }
    }

    ctx.patchState({
      beneficiaries,
    });
  }
}
