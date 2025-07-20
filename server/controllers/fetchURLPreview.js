import {getLinkPreview} from "link-preview-js";
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperUrl from 'metascraper-url';
import metascraperPublisher from 'metascraper-publisher';
import got from "got";

const scraper = metascraper([
    metascraperTitle(),
    metascraperDescription(),
    metascraperImage(),
    metascraperUrl(),
    metascraperPublisher()
]);

const urlFetchLinkPreview = async (req, res) => {
    const {url} = req.query;

    if(!url){
        return res.status(400).json({success: 0, error: "URL is required!"});
    }

    try{
        // Fetch HTML content from req.query
        const {body: html, url: resolvedUrl} = await got(url);
        // Scrape metadata with metascraper
        const metadata = await scraper({html, url:resolvedUrl});
        // Format response for @editorjs/link
        const response = {
            success: 1,
            meta: {
                title: metadata.title || "",
                description: metadata.description || "",
                image: metadata.image ? {url: metadata.image} : null,
                site_name: metadata.publisher || "",
                url: metadata.url || resolvedUrl
            }
        };
        res.json(response);
        console.log(response);
    } catch (err){
        console.error('Error fetching metadata: ', err.message);
        res.status(500).json({success: 0, error: 'Failed to fetch metadata'});
    }

    /*try{
        const data = await getLinkPreview(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
            },
            timeout: 5000,
        });

        // Format response for @editorjs/link
        const response = {
            success: 1,
            meta: {
                title: data.title || 'No title available',
                description: data.description || 'No description available!',
                image: data.images && data.images.length ? {url: data.images[0]} : {url: ''},
                site_name: data.siteName || data.url,
            }
        };
        res.json(response);
        console.log(response);
    } catch (err){
        console.error('Error fetching link metadata:', error.message);
        res.status(500).json({ success: 0, error: 'Failed to fetch metadata' });
    }*/
}

export default urlFetchLinkPreview;