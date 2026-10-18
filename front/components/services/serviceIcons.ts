import {
  BriefcaseBusiness,
  Handshake,
  KeyRound,
  MessageCircleMore,
  Scale,
  Tag,
} from "lucide-react";

export const serviceIcons = {
  purchase: Handshake,
  sale: Tag,
  rental: KeyRound,
  appraisal: Scale,
  administration: BriefcaseBusiness,
  advice: MessageCircleMore,
} as const;
