export class VoterDto {
  name!: string;
  email!: string;
  location!: string;
}

export class BusinessVoteDto {
  businessName!: string;
  votes!: number;
  voters!: VoterDto[];
}

export class QuestionResponseDto {
  message?: string;
  question?: string;
  city?: string;
  aiResponse?: string;
  aiSummarizedQuestion?: string;
  businessList?: any[];
  matchedBusinesses?: any[];
  surveyResults?: {
    businessName: string;
    full_address: string;
    google_maps_url: string;
    votes: number;
    voters: {
      name: string;
      email: string;
      location: string;
    }[];
  }[];
}