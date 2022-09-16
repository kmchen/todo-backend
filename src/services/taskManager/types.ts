export interface Task {
    id: string
    text: string
    lastEdit?: number
    createdAt?: number
    deleted?: boolean
    completed?: boolean
    important?: boolean
}
