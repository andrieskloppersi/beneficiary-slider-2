import { IBeneficiary } from "../interfaces/beneficiary/beneficiary.interface";

export namespace BeneficiariesActions {
	export class Add {
		static readonly type = '[Beneficiaries] Add';
		constructor(public beneficiary: IBeneficiary) {}
	}

    export class AddWithPayoutLogic {
		static readonly type = '[Beneficiaries] AddWithPayoutLogic';
		constructor(public beneficiary: IBeneficiary) {}
	}

	export class SaveEdit {
		static readonly type = '[Beneficiaries] Save Edit';
		constructor(public index: number, public beneficiary: IBeneficiary) {}
	}

	export class Persist {
		static readonly type = '[Beneficiaries] Persist';
		constructor() {}
	}

    export class Remove {
		static readonly type = '[Beneficiaries] Remove';
		constructor(public index: number) {}
	}

	export class Load {
		static readonly type = '[Beneficiaries] Load';
		constructor() {}
	}

    export class Update {
		static readonly type = '[Beneficiaries] Update';
		constructor(public index: number) {}
	}

    export class UpdatePayout {
        static readonly type = '[Beneficiaries] Update Payout';
        constructor(public index: number, public percentage: number, public cb: () => void) {}
    }

	export class SortBeneficiaries {
		static readonly type = '[Beneficiaries] Sort Beneficiaries';
		constructor() {}
	}

    export class Set {
        static readonly type = '[Beneficiaries] Set';
        constructor(public beneficiaries: Array<IBeneficiary>) {}
    }

	export class PostPage {
		static readonly type = '[Beneficiaries] Post Page';
		constructor() {}
	}

	export class PostPageAgent {
		static readonly type = '[Beneficiaries] Post Page Agent';
		constructor() {}
	}
}
