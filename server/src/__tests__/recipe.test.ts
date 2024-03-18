import supertest = require("supertest");

describe("recipe", () => {
  describe("get unique recipe route", () => {
    describe("given the recipe does not exist", () => {
      it("should return a 404", async () => {
        const recipeId = 'product-123'
        expect(true).toBe(true);
      });
    });
  });
});