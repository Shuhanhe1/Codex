import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as xml2js from 'xml2js';
import { PaginationOptions } from '../../common/dto/pagination.dto';
import {
  PaginatedResponse,
  PubMedESearchResponse,
  PubMedEFetchResponse,
  PubMedArticle,
  SearchArticleParams,
  SearchAuthorsParams,
  ScientistSearchResult,
  Author,
  Journal,
  PublicationDate,
} from 'shared';

interface ScientistSearchParams {
  keywords?: string;
  keywordsArray?: string[];
  affiliation?: string;
  affiliationArray?: string[];
}

@Injectable()
export class ScientistService {
  private readonly logger = new Logger(ScientistService.name);
  private readonly baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Private method to search for article IDs using PubMed eSearch API with Boolean operators
   * Supports multiple keywords and affiliations with OR operators
   */
  private async searchArticleIds(
    params: SearchArticleParams & {
      affiliation?: string;
      keywordsArray?: string[];
      affiliationArray?: string[];
    }
  ): Promise<string[]> {
    try {
      const {
        keywords,
        keywordsArray,
        affiliation,
        affiliationArray,
        retmax = 20,
        retstart = 0,
      } = params;

      const url = `${this.baseUrl}/esearch.fcgi`;

      // Build search term with Boolean operators
      let searchTerm = '';

      // Combine all keywords (single and array)
      const allKeywords = [
        ...(keywords ? [keywords] : []),
        ...(keywordsArray || []),
      ].filter(Boolean);

      // Combine all affiliations (single and array)
      const allAffiliations = [
        ...(affiliation ? [affiliation] : []),
        ...(affiliationArray || []),
      ].filter(Boolean);

      if (allKeywords.length > 0 && allAffiliations.length > 0) {
        // Combine keywords with affiliations using AND operator
        const keywordsTerm =
          allKeywords.length === 1
            ? allKeywords[0]
            : `(${allKeywords.join(' OR ')})`;

        const affiliationTerm =
          allAffiliations.length === 1
            ? `${allAffiliations[0]}[AD]`
            : `(${allAffiliations.map((aff) => `${aff}[AD]`).join(' OR ')})`;

        searchTerm = `(${keywordsTerm}) AND (${affiliationTerm})`;
      } else if (allKeywords.length > 0) {
        // Just keywords search
        searchTerm =
          allKeywords.length === 1
            ? allKeywords[0]
            : `(${allKeywords.join(' OR ')})`;
      } else if (allAffiliations.length > 0) {
        // Just affiliation search in author address field
        searchTerm =
          allAffiliations.length === 1
            ? `${allAffiliations[0]}[AD]`
            : `(${allAffiliations.map((aff) => `${aff}[AD]`).join(' OR ')})`;
      } else {
        // No search terms provided
        searchTerm = '';
      }

      const searchParams = new URLSearchParams({
        db: 'pubmed',
        term: searchTerm,
        retmax: retmax.toString(),
        retstart: retstart.toString(),
        retmode: 'json',
      });

      this.logger.log(`Searching for articles with term: ${searchTerm}`);

      const response = await firstValueFrom(
        this.httpService.get<PubMedESearchResponse>(`${url}?${searchParams}`)
      );

      const result = response.data;
      this.logger.log(
        `Found ${result.esearchresult.idlist.length} article IDs`
      );

      return result.esearchresult.idlist;
    } catch (error) {
      this.logger.error('Error searching for article IDs:', error);
      throw new Error('Failed to search for articles');
    }
  }

  /**
   * Public method to search for articles and get detailed information
   */
  async searchArticles(
    params: SearchArticleParams & {
      affiliation?: string;
      keywordsArray?: string[];
      affiliationArray?: string[];
    }
  ): Promise<PubMedArticle[]> {
    try {
      const articleIds = await this.searchArticleIds(params);

      if (articleIds.length === 0) {
        return [];
      }

      const articles = await this.fetchArticleDetails(articleIds);
      return articles;
    } catch (error) {
      this.logger.error('Error searching articles:', error);
      throw new Error('Failed to search articles');
    }
  }

  /**
   * Fetch detailed article information using PubMed eFetch API
   */
  private async fetchArticleDetails(
    articleIds: string[]
  ): Promise<PubMedArticle[]> {
    try {
      const url = `${this.baseUrl}/efetch.fcgi`;
      const params = new URLSearchParams({
        db: 'pubmed',
        id: articleIds.join(','),
        retmode: 'xml',
        rettype: 'abstract',
      });

      this.logger.log(`Fetching details for ${articleIds.length} articles`);

      const response = await firstValueFrom(
        this.httpService.get(`${url}?${params}`, {
          responseType: 'text',
        })
      );

      const xmlData = response.data;
      const articles = await this.parseXmlToArticles(xmlData);

      this.logger.log(`Successfully parsed ${articles.length} articles`);
      return articles;
    } catch (error) {
      this.logger.error('Error fetching article details:', error);
      throw new Error('Failed to fetch article details');
    }
  }

  /**
   * Convert XML response to JSON and parse article data
   */
  private async parseXmlToArticles(xmlData: string): Promise<PubMedArticle[]> {
    try {
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(xmlData);

      const pubmedArticleSet = result.PubmedArticleSet;
      if (!pubmedArticleSet || !pubmedArticleSet.PubmedArticle) {
        return [];
      }

      const articles = Array.isArray(pubmedArticleSet.PubmedArticle)
        ? pubmedArticleSet.PubmedArticle
        : [pubmedArticleSet.PubmedArticle];

      return articles.map((article: any) => this.parseArticle(article));
    } catch (error) {
      this.logger.error('Error parsing XML:', error);
      throw new Error('Failed to parse article data');
    }
  }

  /**
   * Parse individual article from XML structure
   */
  private parseArticle(articleData: any): PubMedArticle {
    const medlineCitation = articleData.MedlineCitation;
    const article = medlineCitation.Article;
    const authors = this.parseAuthors(article.AuthorList?.Author);
    const journal = this.parseJournal(article.Journal);
    const publicationDate = this.parsePublicationDate(
      article.ArticleDate || article.Journal?.JournalIssue?.PubDate
    );

    return {
      pmid: medlineCitation.PMID?._ || medlineCitation.PMID,
      title: article.ArticleTitle || '',
      abstract: article.Abstract?.AbstractText || '',
      authors,
      journal,
      publicationDate,
      doi: article.ELocationID?._ || article.ELocationID,
      language: article.Language || 'eng',
      publicationTypes: this.parsePublicationTypes(
        article.PublicationTypeList?.PublicationType
      ),
    };
  }

  /**
   * Parse authors from XML structure
   */
  private parseAuthors(authorsData: any): Author[] {
    if (!authorsData) return [];

    const authors = Array.isArray(authorsData) ? authorsData : [authorsData];

    return authors.map((author: any) => ({
      lastName: author.LastName || '',
      foreName: author.ForeName || '',
      initials: author.Initials || '',
      orcid: author.Identifier?._ || author.Identifier,
      affiliation: author.AffiliationInfo?.Affiliation || '',
    }));
  }

  /**
   * Parse journal information from XML structure
   */
  private parseJournal(journalData: any): Journal {
    if (!journalData) {
      return {
        title: '',
        isoAbbreviation: '',
        country: '',
      };
    }

    return {
      title: journalData.Title || '',
      isoAbbreviation: journalData.ISOAbbreviation || '',
      issn: journalData.ISSN?._ || journalData.ISSN,
      country: journalData.MedlineJournalInfo?.Country || '',
    };
  }

  /**
   * Parse publication date from XML structure
   */
  private parsePublicationDate(dateData: any): PublicationDate {
    if (!dateData) {
      return { year: 0, month: 0, day: 0 };
    }

    return {
      year: parseInt(dateData.Year) || 0,
      month: this.parseMonth(dateData.Month),
      day: parseInt(dateData.Day) || 0,
    };
  }

  /**
   * Parse month from various formats
   */
  private parseMonth(month: any): number {
    if (typeof month === 'number') return month;
    if (typeof month === 'string') {
      const monthMap: { [key: string]: number } = {
        'Jan': 1,
        'Feb': 2,
        'Mar': 3,
        'Apr': 4,
        'May': 5,
        'Jun': 6,
        'Jul': 7,
        'Aug': 8,
        'Sep': 9,
        'Oct': 10,
        'Nov': 11,
        'Dec': 12,
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12,
      };
      return monthMap[month] || parseInt(month) || 0;
    }
    return 0;
  }

  /**
   * Parse publication types from XML structure
   */
  private parsePublicationTypes(typesData: any): string[] {
    if (!typesData) return [];

    const types = Array.isArray(typesData) ? typesData : [typesData];
    return types.map((type: any) => type._ || type);
  }

  /**
   * Abstract method to get authors by keywords and optionally affiliation
   */
  async searchAuthors(
    params: SearchAuthorsParams & {
      affiliation?: string;
      keywordsArray?: string[];
      affiliationArray?: string[];
    }
  ): Promise<ScientistSearchResult[]> {
    try {
      const articles = await this.searchArticles(params);

      // Group articles by author and extract unique scientists
      const scientistMap = new Map<string, ScientistSearchResult>();

      articles.forEach((article) => {
        article.authors.forEach((author) => {
          const key = `${author.lastName}, ${author.foreName}`;

          if (!scientistMap.has(key)) {
            scientistMap.set(key, {
              name: key,
              affiliation: author.affiliation,
              orcid: author.orcid,
            });
          }
        });
      });

      // Get unique scientists
      const scientists = Array.from(scientistMap.values());

      this.logger.log(`Found ${scientists.length} unique scientists`);
      return scientists;
    } catch (error) {
      this.logger.error('Error searching authors:', error);
      throw new Error('Failed to search authors');
    }
  }

  /**
   * Search scientists by keywords and optionally by affiliation with pagination
   * Uses NCBI E-utilities Boolean operators for efficient server-side filtering
   */
  async searchScientists(
    params: ScientistSearchParams,
    options: PaginationOptions
  ): Promise<PaginatedResponse<ScientistSearchResult>> {
    try {
      const { keywords, affiliation } = params;
      const { page, limit } = options;
      const retmax = limit;
      const retstart = (page - 1) * limit;

      this.logger.log(
        `Searching scientists with keywords: ${keywords || 'none'}${affiliation ? ` and affiliation: ${affiliation}` : ''}`
      );

      // Use the Boolean operator approach for efficient server-side filtering
      const scientists = await this.searchAuthors({
        keywords: keywords || '',
        keywordsArray: params.keywordsArray,
        affiliation,
        affiliationArray: params.affiliationArray,
        retmax,
        retstart,
      });

      // Calculate total pages based on the number of results returned
      // Note: PubMed doesn't provide total count in a single request,
      // so we estimate based on the current page results
      const totalPages = scientists.length === limit ? page + 1 : page;
      const total =
        scientists.length === limit
          ? (page - 1) * limit + scientists.length + 1
          : (page - 1) * limit + scientists.length;

      this.logger.log(
        `Returning ${scientists.length} scientists for page ${page} (estimated total: ${total})`
      );

      return {
        data: scientists,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: scientists.length === limit,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      this.logger.error('Error searching scientists:', error);
      throw new Error('Failed to search scientists');
    }
  }
}
