export type Category =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'accessory'
  | 'underwear'
  | 'sportswear'
  | 'other';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn' | 'all_season';

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
};

export type Clothes = {
  id: string;
  profile_id: string;
  photo_url: string;
  category: Category | string;
  color: string | null;
  season: Season | string | null;
  style: string | null;
  created_at: string;
};

export type Outfit = {
  id: string;
  profile_id: string;
  name: string;
  occasion: string | null;
  season: Season | string | null;
  created_at: string;
  items: Clothes[];
};
