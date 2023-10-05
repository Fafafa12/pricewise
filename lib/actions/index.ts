"use server"

import { connect } from "http2"
import { scrapeAmazonProduct } from "../scraper"

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) throw new Error("Product URL is required")

  try {
    connectToDB();
    const scrapedProduct = await scrapeAmazonProduct(productUrl)
    if (!scrapedProduct) throw new Error("Failed to scrape product")


  } catch (error: any) {
    throw new Error(`Failed to scrape and store product: ${error.message}`)
  }
} 