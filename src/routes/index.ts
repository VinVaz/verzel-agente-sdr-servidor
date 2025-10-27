import { Router } from 'express'

import app from '.././config/config';
import healthRoute from './health'
import home from './home'

const {environment} = app
interface IRoute {
  path: string
  route: Router
}

const router: Router = Router();

const defaultRoutes: IRoute[] = [
  {
    path: '/',
    route: home
  },
  {
    path: '/health',
    route: healthRoute
  }
]

const devRoutes: IRoute[] = [...defaultRoutes]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

if (environment === 'development' && devRoutes.length) {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route)
  })
}

export default router
