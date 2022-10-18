export type Task = TaskProperty & {
    id: string
    text: string
    lastEdit?: number
    createdAt?: number
}

export type TaskProperty = {
    completed?: boolean
    important?: boolean
}
