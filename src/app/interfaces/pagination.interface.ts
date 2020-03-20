import { User } from './user.interface';

export interface Pagination {
    "docs": [User]
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

 