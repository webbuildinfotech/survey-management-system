
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
  message!: string;
  question!: string;
  city!: string;
  aiResponse!: string;
  surveyResults!: BusinessVoteDto[];
}