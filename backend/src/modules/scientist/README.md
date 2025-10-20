# Scientist Module

This module provides functionality to search for scientists and their publications using the PubMed eutils API.

## Features

- Search for articles by keywords using PubMed eSearch API
- Fetch detailed article information using PubMed eFetch API
- Convert XML responses to JSON format
- Extract and group authors from search results
- Search for scientists by keywords with pagination

## API Endpoints

### Search Scientists

```
GET /scientists/search?keywords=Boston&page=1&limit=20
```

**Query Parameters:**

- `keywords` (required): Search keywords for scientists
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 20, max: 100)

**Response:**

```json
{
  "data": [
    {
      "name": "Last, First",
      "affiliation": "Department of Chemistry, Boston University",
      "orcid": "0000-0003-1244-2407"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

## Implementation Details

### Private Methods

1. **searchArticleIds(params)**: Uses PubMed eSearch API to get article IDs
2. **fetchArticleDetails(articleIds)**: Uses PubMed eFetch API to get detailed article information
3. **parseXmlToArticles(xmlData)**: Converts XML response to JSON
4. **parseArticle(articleData)**: Parses individual article from XML structure

### Public Methods

1. **searchArticles(params)**: Public method to search for articles
2. **searchAuthors(params)**: Abstract method to get authors by keywords
3. **searchScientists(keywords, page, limit)**: Main endpoint method with pagination

## Dependencies

- `@nestjs/axios`: For HTTP requests to PubMed API
- `xml2js`: For XML to JSON conversion
- `rxjs`: For reactive programming with HTTP requests

## Error Handling

The module includes comprehensive error handling for:

- Invalid search parameters
- Network request failures
- XML parsing errors
- API rate limiting

## Usage Example

```typescript
// Search for scientists in Boston
const result = await scientistService.searchScientists('Boston', 1, 20);

// Search for articles about machine learning
const articles = await scientistService.searchArticles({
  keywords: 'machine learning',
  retmax: 10,
});
```
