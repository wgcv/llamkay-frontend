export interface Pagination {
    "docs": [any]
    "totalDocs": number,
    "offset": number,
    "limit": number,
    "totalPages": number,
    "page": number,
    "pagingCounter": number,
    "hasPrevPage": boolean,
    "hasNextPage": boolean,
    "prevPage": string,
    "nextPage": string
}

 