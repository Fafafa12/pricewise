
"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react"

const isValidAmazonProductURL = (url: string) => {
  try {
    const parseURL = new URL(url);
    const hostName = parseURL.hostname;

    // check if hostname is amazon
    if(
      hostName.includes('amazon.com') || 
      hostName.includes('amazon.') || 
      hostName.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false
  }

  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt); 

    if(!isValidLink) return alert('Please provide a valid Amazon product link')

    try {
      setIsLoading(true);

      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }finally {
      setIsLoading(false);
    }
  }
  return (
    <form 
      className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >
      <input 
        type="text" 
        placeholder="Enter product link"
        className="searchbar-input"  
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === '' || isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar