export interface BabysittingRequest {
  id: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  date_needed: string;
  time_needed: string;
  num_kids: number;
  kids_names: string;
  kids_ages: string;
  special_instructions: string;
  status: "pending" | "accepted" | "declined" | "completed";
  rating_token: string;
  rating_stars: number | null;
  rating_comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface BabysittingStats {
  total_completed: number;
  average_rating: number;
  total_reviews: number;
}

export interface RatingInfo {
  id: number;
  parent_name: string;
  date_needed: string;
  time_needed: string;
  status: string;
}
