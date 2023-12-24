import { QuestionSubmitJudgeInfo } from "./QuestionSubmitJudgeInfo";

export type RunCodeResponse = {
  output?: string;
  message?: string;
  status?: number;
  judgeInfo?: QuestionSubmitJudgeInfo;
};
