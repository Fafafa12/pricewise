"use server"

import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper"
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) throw new Error("Product URL is required")

  try {
    connectToDB();
    const scrapedProduct = await scrapeAmazonProduct(productUrl)
    if (!scrapedProduct) throw new Error("Failed to scrape product")

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: product.url })

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        {price : scrapedProduct.currentPrice}
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: product.url },
      product,
      { new: true, upsert: true }
    );

    revalidatePath(`/products/${newProduct._id}`); // revalidate the product page
  } catch (error: any) {
    throw new Error(`Failed to scrape and store product: ${error.message}`)
  }
} 

export async function getProductById(id: string) {
  try {
    connectToDB();
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  } catch (error: any) {
    throw new Error(`Failed to get product by id: ${error.message}`);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}