/**
 * Example usage of the ScientistService
 * This file demonstrates how to use the scientist module in your application
 */

import { ScientistService } from '../scientist.service';

export class ScientistUsageExample {
  constructor(private readonly scientistService: ScientistService) {}

  /**
   * Example: Search for scientists in Boston
   */
  async searchScientistsInBoston() {
    try {
      const result = await this.scientistService.searchScientists(
        'Boston[AD]', // Affiliation field search
        { page: 1, limit: 10, skip: 0, sortOrder: 'desc' } // PaginationOptions
      );

      console.log(`Found ${result.data.length} scientists in Boston`);
      console.log(
        `Total: ${result.pagination.total}, Page: ${result.pagination.page}`
      );

      result.data.forEach((scientist) => {
        console.log(`- ${scientist.name}`);
        console.log(`  Affiliation: ${scientist.affiliation}`);
        if (scientist.orcid) {
          console.log(`  ORCID: ${scientist.orcid}`);
        }
      });

      return result;
    } catch (error) {
      console.error('Error searching scientists:', error);
      throw error;
    }
  }

  /**
   * Example: Search for articles about machine learning
   */
  async searchMachineLearningArticles() {
    try {
      const articles = await this.scientistService.searchArticles({
        keywords: 'machine learning',
        retmax: 5,
      });

      console.log(`Found ${articles.length} articles about machine learning`);

      articles.forEach((article) => {
        console.log(`- ${article.title}`);
        console.log(
          `  Authors: ${article.authors.map((a) => a.lastName).join(', ')}`
        );
        console.log(`  Journal: ${article.journal.title}`);
        console.log(`  Year: ${article.publicationDate.year}`);
      });

      return articles;
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }

  /**
   * Example: Search for authors by research field
   */
  async searchAuthorsByField() {
    try {
      const authors = await this.scientistService.searchAuthors({
        keywords: 'cancer research',
        retmax: 10,
      });

      console.log(`Found ${authors.length} authors in cancer research`);

      authors.forEach((author) => {
        console.log(`- ${author.name}`);
        console.log(`  Affiliation: ${author.affiliation}`);
        if (author.orcid) {
          console.log(`  ORCID: ${author.orcid}`);
        }
      });

      return authors;
    } catch (error) {
      console.error('Error searching authors:', error);
      throw error;
    }
  }
}

/**
 * Example API endpoint usage:
 *
 * GET /scientists/search?keywords=Boston[AD]&page=1&limit=20
 *
 * This will search for scientists affiliated with Boston and return:
 * - List of scientists with their names, affiliations, and publication counts
 * - Recent articles for each scientist
 * - Total count of results
 * - Pagination support
 */
