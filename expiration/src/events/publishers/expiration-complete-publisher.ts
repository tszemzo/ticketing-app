import { Subjects, Publisher, ExpirationCompleteEvent } from "@ts-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subjects: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}