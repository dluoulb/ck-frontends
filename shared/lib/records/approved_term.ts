import { removeNulls } from "@lib/utils/record_utils";

export default class ApprovedTermRecord {
  available: boolean;
  term: number;
  term_period: string;

  constructor(data) {
    Object.assign(this, removeNulls(data));
  }
};
