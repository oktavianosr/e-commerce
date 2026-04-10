import { type RequestHandler } from "express";
import { prismaClient } from "../index.js";

export const createProduct: RequestHandler = async (req, res) => {
  // ["key",""]

  // Create a validator to for this request
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};
