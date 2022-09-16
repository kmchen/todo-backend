import fs from 'fs'
import { Express } from 'express'
import { Route } from './types'

export const getRoutes = (routePath: string): string[] => {
    let routes: string[] = []
    fs.readdirSync(routePath).forEach((file) => {
        const filepath = `${routePath}/${file}`
        const stat = fs.statSync(filepath)

        if (stat.isDirectory()) {
            const tempRoutes = getRoutes(filepath)
            routes = [...tempRoutes, ...routes]
        } else if (filepath.endsWith('.ts') || filepath.endsWith('.js')) routes.push(filepath)
    })

    return routes
}

export const processRoutePath = (baseApi: string, routePath: string, app: Express) =>
    new Promise<string>((resolve, reject) => {
        const routes = getRoutes(routePath)

        routes.forEach(async (curr) => {
            try {
                const imported: any = await import(curr)
                const route: Route = imported.default

                app.use(baseApi + route.path, route.router)

                if (routes.length - 1 === routes.indexOf(curr)) resolve('')
            } catch (error) {
                reject(error)
            }
        })
    })
