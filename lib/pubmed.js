import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { logger } from './logger.js';

/**
 * PubMed API Client for Scientific Research Papers
 */

export async function fetchPubMedResearch(supplementName, maxResults = 20) {
  const apiKey = process.env.PUBMED_API_KEY || '';

  logger.info({ supplementName, maxResults }, 'Fetching PubMed research');

  try {
    // Step 1: Search PubMed for paper IDs
    const searchResponse = await axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi', {
      params: {
        db: 'pubmed',
        term: supplementName,
        retmax: maxResults,
        retmode: 'json',
        ...(apiKey && { api_key: apiKey })
      }
    });

    const paperIds = searchResponse.data.esearchresult?.idlist || [];
    logger.info({ supplementName, foundPapers: paperIds.length }, 'PubMed search completed');

    if (paperIds.length === 0) {
      return {
        supplement_name: supplementName,
        research_papers: [],
        paper_count: 0,
        recent_papers_count: 0
      };
    }

    // Step 2: Fetch paper details
    const fetchResponse = await axios.get('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi', {
      params: {
        db: 'pubmed',
        id: paperIds.join(','),
        retmode: 'xml',
        ...(apiKey && { api_key: apiKey })
      }
    });

    // Step 3: Parse XML
    const xmlData = await parseStringPromise(fetchResponse.data);

    // Step 4: Extract paper data
    let papers = [];

    if (xmlData.PubmedArticleSet?.PubmedArticle) {
      const articles = Array.isArray(xmlData.PubmedArticleSet.PubmedArticle)
        ? xmlData.PubmedArticleSet.PubmedArticle
        : [xmlData.PubmedArticleSet.PubmedArticle];

      papers = articles.map((article) => {
        const citation = article.MedlineCitation?.[0] || article.MedlineCitation;
        const articleInfo = citation?.Article?.[0] || citation?.Article;

        const pmid = Array.isArray(citation?.PMID)
          ? (citation.PMID[0]?._ || citation.PMID[0])
          : (citation?.PMID?._ || citation?.PMID || 'Unknown');

        const title = Array.isArray(articleInfo?.ArticleTitle)
          ? articleInfo.ArticleTitle[0]
          : (articleInfo?.ArticleTitle || 'No title');

        let abstract = 'No abstract';
        if (articleInfo?.Abstract) {
          const abstractData = Array.isArray(articleInfo.Abstract)
            ? articleInfo.Abstract[0]
            : articleInfo.Abstract;

          if (abstractData?.AbstractText) {
            if (Array.isArray(abstractData.AbstractText)) {
              abstract = abstractData.AbstractText.map((text) =>
                typeof text === 'string' ? text : (text._ || '')
              ).join(' ');
            } else {
              abstract = typeof abstractData.AbstractText === 'string'
                ? abstractData.AbstractText
                : (abstractData.AbstractText?._ || 'No abstract');
            }
          }
        }

        let authors = ['Unknown'];
        if (articleInfo?.AuthorList) {
          const authorList = Array.isArray(articleInfo.AuthorList)
            ? articleInfo.AuthorList[0]
            : articleInfo.AuthorList;

          if (authorList?.Author) {
            const authorArray = Array.isArray(authorList.Author)
              ? authorList.Author
              : [authorList.Author];

            authors = authorArray.slice(0, 3).map((a) => {
              const foreName = Array.isArray(a.ForeName) ? a.ForeName[0] : a.ForeName;
              const lastName = Array.isArray(a.LastName) ? a.LastName[0] : a.LastName;
              return `${foreName || ''} ${lastName || ''}`.trim();
            }).filter(Boolean);

            if (authors.length === 0) authors = ['Unknown'];
          }
        }

        const journal = Array.isArray(articleInfo?.Journal)
          ? (articleInfo.Journal[0]?.Title?.[0] || articleInfo.Journal[0]?.Title || 'Unknown journal')
          : (articleInfo?.Journal?.Title?.[0] || articleInfo?.Journal?.Title || 'Unknown journal');

        let year = 'Unknown';
        const dateCompleted = citation?.DateCompleted;
        const dateCreated = citation?.DateCreated;

        if (dateCompleted) {
          const dateData = Array.isArray(dateCompleted) ? dateCompleted[0] : dateCompleted;
          year = Array.isArray(dateData?.Year) ? dateData.Year[0] : (dateData?.Year || year);
        } else if (dateCreated) {
          const dateData = Array.isArray(dateCreated) ? dateCreated[0] : dateCreated;
          year = Array.isArray(dateData?.Year) ? dateData.Year[0] : (dateData?.Year || year);
        }

        return {
          pmid: String(pmid),
          title: String(title),
          abstract: String(abstract),
          authors,
          journal: String(journal),
          year: String(year),
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
        };
      });
    }

    const recentPapersCount = papers.filter(p => {
      const paperYear = parseInt(p.year);
      return !isNaN(paperYear) && paperYear >= 2020;
    }).length;

    logger.info({
      supplementName,
      paperCount: papers.length,
      recentPapersCount
    }, 'PubMed research completed');

    return {
      supplement_name: supplementName,
      research_papers: papers,
      paper_count: papers.length,
      recent_papers_count: recentPapersCount
    };

  } catch (error) {
    logger.error({ error, supplementName }, 'PubMed API failed');
    throw new Error(`PubMed API failed: ${error.message}`);
  }
}
