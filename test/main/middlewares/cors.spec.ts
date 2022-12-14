import request from "supertest";
import app from "../../../src/main/config/app";

describe('Corse Middleware', () => {
  test('Should enable CORS', async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    })
    await request(app)
      .get("/test_body_parser")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-methods", "*")
      .expect("access-control-allow-headers", "*");
  });
});
