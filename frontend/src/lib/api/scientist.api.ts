import { ScientistSearchResult, PaginatedResponse } from 'shared';
import { ApiClient } from './api';

class ScientistApiClient extends ApiClient {
  /**
   * Search scientists by keywords and optionally by affiliation with pagination
   * Supports both single values and arrays for multiple keywords/affiliations
   * GET /scientists/search?keywords=Boston&affiliation=Harvard&page=1&limit=20
   * GET /scientists/search?keywordsArray=cancer&keywordsArray=diabetes&affiliationArray=Harvard&affiliationArray=MIT&page=1&limit=20
   */
  async searchScientists(
    searchParams: {
      keywords?: string;
      keywordsArray?: string[];
      affiliation?: string;
      affiliationArray?: string[];
    },
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<ScientistSearchResult>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchParams.keywords) {
      params.append('keywords', searchParams.keywords);
    }

    if (searchParams.keywordsArray && searchParams.keywordsArray.length > 0) {
      searchParams.keywordsArray.forEach((keyword) => {
        params.append('keywordsArray', keyword);
      });
    }

    if (searchParams.affiliation) {
      params.append('affiliation', searchParams.affiliation);
    }

    if (
      searchParams.affiliationArray &&
      searchParams.affiliationArray.length > 0
    ) {
      searchParams.affiliationArray.forEach((affiliation) => {
        params.append('affiliationArray', affiliation);
      });
    }

    const response = await this.request<
      PaginatedResponse<ScientistSearchResult>
    >(`/scientists/search?${params.toString()}`);
    return response.data!;
  }
}

export const scientistApiClient = new ScientistApiClient();
