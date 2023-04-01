export interface IUrl {
  url_id: number;
  url: string;
  user_id: string;
  created_at?: Date;
  warning_th: string;
  danger_th: string;
  sms_whatsapp?: string;
}
