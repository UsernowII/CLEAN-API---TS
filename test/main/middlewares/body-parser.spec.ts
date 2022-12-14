import request from "supertest";
import app from "../../../src/main/config/app";

describe('Body Parser Middleware', () => {
  test('Should parse body as Json', async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body);
    })
    await request(app)
      .post("/test_body_parser")
      .send({ name: "any_name"})
      .expect({ name: "any_name"});
  });
});
