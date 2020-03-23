export interface Task {
    _id: number;
    name: string;
    time: number;
    createdAt: Date;
    updatedAt: Date;
    detail: [{_id: number, seconds: number, timestamp: Date}]
}