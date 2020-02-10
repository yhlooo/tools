import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/index/Index'
import Base64Codec from '@/components/base64-codec/Base64Codec'
import { Fate, Draw, FlipACoin } from '@/components/fate'
import Divination from '../components/divination/Divination'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/base64-codec',
      name: 'Base64Codec',
      component: Base64Codec,
      meta: {
        title: 'Base64 编解码器'
      }
    }, {
      path: '/fate',
      name: 'Fate',
      component: Fate,
      redirect: '/fate/flip-a-coin',
      meta: {
        title: '命运'
      },
      children: [
        {
          path: 'draw/:importBase64Text?',
          name: 'Draw',
          component: Draw,
          props: true
        }, {
          path: 'flip-a-coin',
          name: 'FlipACoin',
          component: FlipACoin
        }
      ]
    }, {
      path: '/divination',
      name: 'Divination',
      component: Divination,
      meta: {
        title: '知命'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = `${to.meta.title} - KeybrL's Tools`
  } else {
    document.title = 'KeybrL\'s Tools'
  }
  next()
})

export default router
