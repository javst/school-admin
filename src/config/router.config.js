// eslint-disable-next-line
import { BasicLayout, PageView, BlankLayout } from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard'),
        meta: { title: '总览', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false }
      },
      // Order
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/views/orders/Order'),
        meta: { title: '订单管理', icon: 'unordered-list', hiddenHeaderContent: false, keepAlive: false }
      },

      // posts
      {
        path: '/posts',
        name: 'Posts',
        component: BlankLayout,
        redirect: '/posts/list',
        meta: { title: '器件', icon: 'form' },
        children: [
          {
            path: '/posts/list',
            name: 'PostList',
            component: () => import('@/views/post/PostList'),
            meta: { title: '所有器件', hiddenHeaderContent: false }
          },
          {
            path: '/posts/inStock',
            name: 'InStock',
            component: () => import('@/views/post/InStock'),
            meta: { title: '器件入库', hiddenHeaderContent: false, keepAlive: false }
          },
          {
            path: '/posts/write',
            name: 'PostWrite',
            component: () => import('@/views/post/PostEdit'),
            meta: { title: '发布器件', hiddenHeaderContent: false, keepAlive: false }
          },
          {
            path: '/posts/edit',
            name: 'PostEdit',
            hidden: true,
            component: () => import('@/views/post/PostEdit'),
            meta: { title: '编辑器件', hiddenHeaderContent: false, keepAlive: false }
          },
          {
            path: '/categories',
            name: 'CategoryList',
            component: () => import('@/views/post/CategoryList'),
            meta: { title: '分类目录', hiddenHeaderContent: false }
          },
          {
            path: '/tags',
            name: 'TagList',
            component: () => import('@/views/post/TagList'),
            meta: { title: '标签', hiddenHeaderContent: false }
          }
        ]
      },

      // sheets
      {
        path: '/sheets',
        name: 'Sheets',
        component: BlankLayout,
        redirect: '/sheets/list',
        meta: { title: '页面', icon: 'read' },
        children: [
          {
            path: '/sheets/list',
            name: 'SheetList',
            component: () => import('@/views/sheet/SheetList'),
            meta: { title: '所有页面', hiddenHeaderContent: false }
          },
          {
            path: '/sheets/write',
            name: 'SheetWrite',
            component: () => import('@/views/sheet/SheetEdit'),
            meta: { title: '新建页面', hiddenHeaderContent: false, keepAlive: false }
          },
          {
            path: '/sheets/edit',
            name: 'SheetEdit',
            hidden: true,
            component: () => import('@/views/sheet/SheetEdit'),
            meta: { title: '编辑页面', hiddenHeaderContent: false, keepAlive: false }
          },
          {
            path: '/sheets/links',
            name: 'LinkList',
            hidden: true,
            component: () => import('@/views/sheet/independent/LinkList'),
            meta: { title: '友情链接', hiddenHeaderContent: false }
          },
          {
            path: '/sheets/photos',
            name: 'PhotoList',
            hidden: true,
            component: () => import('@/views/sheet/independent/PhotoList'),
            meta: { title: '图库', hiddenHeaderContent: false }
          },
          {
            path: '/sheets/journals',
            name: 'JournalList',
            hidden: true,
            component: () => import('@/views/sheet/independent/JournalList'),
            meta: { title: '日志', hiddenHeaderContent: false }
          }
        ]
      },

      // attachments
      {
        path: '/attachments',
        name: 'Attachments',
        component: () => import('@/views/attachment/AttachmentList'),
        meta: { title: '附件', icon: 'picture', hiddenHeaderContent: false }
      },

      // comments
      {
        path: '/comments',
        name: 'Comments',
        component: () => import('@/views/comment/CommentList'),
        meta: { title: '评论', icon: 'message', hiddenHeaderContent: false }
      },

      // interface
      {
        path: '/interface',
        name: 'Interface',
        component: BlankLayout,
        redirect: '/interface/themes',
        meta: { title: '外观', icon: 'skin' },
        children: [
          // {
          //   path: '/interface/themes',
          //   name: 'ThemeList',
          //   component: () => import('@/views/interface/ThemeList'),
          //   meta: { title: '主题', hiddenHeaderContent: false }
          // },
          {
            path: '/interface/menus',
            name: 'MenuList',
            component: () => import('@/views/interface/MenuList'),
            meta: { title: '菜单', hiddenHeaderContent: false }
          },
          {
            path: '/interface/themes/edit',
            name: 'ThemeEdit',
            component: () => import('@/views/interface/ThemeEdit'),
            meta: { title: '样式快速修改', hiddenHeaderContent: false }
          }
        ]
      },
      // report
      {
        path: '/report',
        name: 'Report',
        component: BlankLayout,
        meta: { title: '报表', icon: 'unordered-list' },
        children: [
          {
            path: '/report/Order.vue',
            name: 'order',
            component: () => import('@/views/report/Order'),
            meta: { title: '订单报表', hiddenHeaderContent: false }
          },
          {
            path: '/report/InStock.vue',
            name: 'inStock',
            component: () => import('@/views/report/InStock'),
            meta: { title: '入库报表', hiddenHeaderContent: false }
          },
          {
            path: '/report/s.vue',
            name: 'InStockList',
            component: () => import('@/views/report/InStockList'),
            meta: { title: '库存报表', hiddenHeaderContent: false }
          },
          {
            path: '/report/Apply.vue',
            name: 'apply',
            component: () => import('@/views/report/Apply'),
            meta: { title: '竞赛申购', hiddenHeaderContent: false }
          },
          {
            path: '/report/Hero.vue',
            name: 'hero',
            component: () => import('@/views/report/Hero'),
            meta: { title: '荣誉额度', hiddenHeaderContent: false }
          }
        ]
      },

      // user
      {
        path: '/user',
        name: 'User',
        component: PageView,
        redirect: '/user/profile',
        meta: { title: '用户', icon: 'user' },
        children: [
          {
            path: '/user/profile',
            name: 'Profile',
            component: () => import('@/views/user/Profile'),
            meta: { title: '个人资料', hiddenHeaderContent: false }
          },
          {
            path: '/user/manager',
            name: 'Manager',
            component: () => import('@/views/user/Manager'),
            meta: { title: '用户管理', hiddenHeaderContent: false }
          }
        ]
      },

      // system
      {
        path: '/system',
        name: 'System',
        component: BlankLayout,
        redirect: '/system/options',
        meta: { title: '系统', icon: 'setting' },
        children: [
          {
            path: '/system/developer/options',
            name: 'DeveloperOptions',
            hidden: true,
            component: () => import('@/views/system/developer/DeveloperOptions'),
            meta: { title: '开发者选项', hiddenHeaderContent: false }
          },
          {
            path: '/system/options',
            name: 'SystemOptions',
            component: () => import('@/views/system/SystemOptions'),
            meta: { title: '系统设置', hiddenHeaderContent: false }
          },
          {
            path: '/system/tools',
            name: 'ToolList',
            component: () => import('@/views/system/ToolList'),
            meta: { title: '小工具', hiddenHeaderContent: false }
          },
          {
            path: '/system/about',
            name: 'About',
            component: () => import('@/views/system/About'),
            meta: { title: '关于', hiddenHeaderContent: false }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const constantRouterMap = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/views/user/Login')
  },
  {
    path: '/install',
    name: 'Install',
    meta: { title: '安装向导' },
    component: () => import('@/views/system/Installation')
  },
  {
    path: '/password/reset',
    name: 'ResetPassword',
    meta: { title: '重置密码' },
    component: () => import('@/views/user/ResetPassword')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/exception/404')
  }
]
