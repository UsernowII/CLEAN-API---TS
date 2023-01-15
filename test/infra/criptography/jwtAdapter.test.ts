import jwt from "jsonwebtoken";
import { JwtAdapter } from "../../../src/infra/criptography/jwt-adapter/jwtAdapter";

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter("any_secret");
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id")
    expect(signSpy).toHaveBeenCalledWith({id: 'any_id'}, "any_secret");
  });
});
