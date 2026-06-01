export type Env = {
  DB: D1Database;
  BABYSITTING_ADMIN_PASS: string;
};

export interface BabysittingRequestCreate {
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  date_needed: string;
  time_needed: string;
  num_kids: number;
  kids_names?: string;
  kids_ages: string;
  special_instructions?: string;
}

export interface StatusUpdate {
  status: string;
  passphrase: string;
}

export interface RatingSubmit {
  stars: number;
  comment?: string;
}
