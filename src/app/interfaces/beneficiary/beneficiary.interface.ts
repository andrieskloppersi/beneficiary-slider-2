import { IBankingDetail } from "../banking-detail/banking-detail.interface";

export interface IBeneficiary {
  Id?: string;
  Name: string;
  Email: string;
  PhoneNumber: string;
  Percentage: number;
  PersonalRelation: string;
  BankingDetailId?: string;
  RsaIdNumber: string;
  DateOfBirth: string;
  BankingDetails?: IBankingDetail;
}

export interface IBeneficiariesPagePostRequest {
  Beneficiaries: IBeneficiary[];
}