import { JwtPayload } from "jsonwebtoken";

export interface JwtTokenData extends JwtPayload {
  userId: number,
}