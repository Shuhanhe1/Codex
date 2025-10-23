import { ScientistSearchResult, PaginatedResponse } from 'shared';
import { ApiClient } from './api';

class ScientistApiClient extends ApiClient {
  /**
   * Search scientists by keywords and optionally by affiliation with pagination
   * Uses arrays for multiple keywords and affiliations
   * GET /scientists/search?keywords[]=cancer&keywords[]=diabetes&affiliations[]=Harvard&affiliations[]=MIT&page=1&limit=20
   */
  async searchScientists(
    searchParams: {
      keywords?: string[];
      affiliations?: string[];
    },
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<ScientistSearchResult>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchParams.keywords && searchParams.keywords.length > 0) {
      searchParams.keywords.forEach((keyword) => {
        params.append('keywords[]', keyword);
      });
    }

    if (searchParams.affiliations && searchParams.affiliations.length > 0) {
      searchParams.affiliations.forEach((affiliation) => {
        params.append('affiliations[]', affiliation);
      });
    }

    const response = await this.request<
      PaginatedResponse<ScientistSearchResult>
    >(`/scientists/search?${params.toString()}`);

    return response.data!;
  }
}

export const scientistApiClient = new ScientistApiClient();
