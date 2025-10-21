// PubMed eSearch API response types
export interface PubMedESearchResponse {
  header: {
    type: string;
    version: string;
  };
  esearchresult: {
    count: string;
    retmax: string;
    retstart: string;
    idlist: string[];
    translationset: any[];
    querytranslation: string;
  };
}

// PubMed eFetch API response types (converted from XML)
export interface PubMedArticle {
  pmid: string;
  title: string;
  abstract?: string;
  authors: Author[];
  journal: Journal;
  publicationDate: PublicationDate;
  doi?: string;
  language: string;
  publicationTypes: string[];
}

export interface Author {
  lastName: string;
  foreName: string;
  initials: string;
  orcid?: string;
  affiliation: string;
}

export interface Journal {
  title: string;
  isoAbbreviation: string;
  issn?: string;
  country: string;
}

export interface PublicationDate {
  year: number;
  month: number;
  day: number;
}

export interface PubMedEFetchResponse {
  articles: PubMedArticle[];
}

// Search parameters
export interface SearchArticleParams {
  keywords: string;
  retmax?: number;
  retstart?: number;
}

export interface SearchAuthorsParams {
  keywords: string;
  retmax?: number;
  retstart?: number;
}

// Response DTOs
export interface ScientistSearchResult {
  name: string;
  affiliation: string;
  orcid?: string;
}
