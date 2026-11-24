export interface CurrentUserDto {
  userId: number;
  email: string;
  isAdmin: boolean;
  isOrganizer: boolean;
  isScanner: boolean;
  tokenVersion: number;
}
