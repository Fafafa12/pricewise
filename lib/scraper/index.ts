import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';


export async function scrapeAmazonProduct(url: string) {
  if(!url) throw new Error("Product URL is required");

  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_74ccdd50-zone-unblocker:h4uofnt7gfkb -k https://lumtest.com/myip.json

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password: password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    // fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();
    const currentPrice = extractPrice(
      $('.priceToPay span.a-offscreen'),
      $('.apexPriceToPay span.a-offscreen'),
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
    );
    
    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen').first(),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );

    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const images = 
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}';

    const imageUrls = Object.keys(JSON.parse(images));

    const discountRate = $('.savingsPercentage').first().text().replace(/[-%]/g, "");

    const currency = extractCurrency($('.a-price-symbol'))

    const stars = $('#acrPopover span a span.a-size-base.a-color-base').first().text().trim() || '0';

    const reviewsCount = $('#acrCustomerReviewText').first().text().replace(/\D/g, '') || '0';

    const description = extractDescription($)

    const data = {
      url,
      currency,
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      outOfStock,
      category: 'category',
      reviewsCount: Number(reviewsCount),
      stars: Number(stars),
      isOutOfStock: outOfStock,
      description,
      lowerPrice : Number(currentPrice) || Number(originalPrice),
      highestPrice : Number(originalPrice) || Number(currentPrice),
      average: Number(currentPrice) || Number(originalPrice),
    }
    
    return data;
    // console.log(data);
  } catch (error: any) {
    throw new Error(`Failed to scrape Amazon product: ${error.message}`)
  }
}

