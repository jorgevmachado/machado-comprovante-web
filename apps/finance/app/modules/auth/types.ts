export type StatusEnum = 'ACTIVE' | 'INACTIVE';
export type RoleEnum = 'USER' | 'ADMIN';

export type TUserInfo = {
  total: number;
  total_success: number;
  total_failures: number;
  failed_attempts: number;
  last_authentication_at?: Date;
}

export type TUser = {
  id: string;
  role: RoleEnum;
  name: string;
  info?: TUserInfo;
  email: string;
  status: StatusEnum;
  username: string;
  created_at: string;
}