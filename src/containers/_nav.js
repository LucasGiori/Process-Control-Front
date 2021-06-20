import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      text: '+',
    }
  },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Theme']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: 'cil-drop',
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: 'cil-pencil',
  // },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Gestão']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Gestão',
    route: '/gestao',
    icon: 'cil-calculator',
    _children: [
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Usuário',
        route: '/gestao/user',
        
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Salvar',
            to: '/gestao/user/salvar',
            icon:  <CIcon/>,
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Listar',
            to: '/gestao/user/list',
            icon:  <CIcon/>,
          },
        ]
      }
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Funcionalidades']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Administrativo',
    route: '/administrativo',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Estados',
        to: '/administrativo/state',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Cidades',
        to: '/administrativo/city',
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Empresa',
        route: '/administrativo/company',
        
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Salvar',
            to: '/administrativo/company/salvar',
            icon:  <CIcon/>,
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Listar',
            to: '/administrativo/company/list',
            icon:  <CIcon/>,
          },
        ]
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Advogado',
        route: '/administrativo/attorney',
        
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Salvar',
            to: '/administrativo/attorney/salvar',
            icon:  <CIcon/>,
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Listar',
            to: '/administrativo/attorney/list',
            icon:  <CIcon/>,
          },
        ]
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Ação',
        route: '/administrativo/action',
        
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Salvar',
            to: '/administrativo/action/salvar',
            icon:  <CIcon/>,
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Listar',
            to: '/administrativo/action/list',
            icon:  <CIcon/>,
          },
        ]
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Processo',
        route: '/administrativo/process',
        
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Salvar',
            to: '/administrativo/process/salvar',
            icon:  <CIcon/>,
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Listar',
            to: '/administrativo/process/list',
            icon:  <CIcon/>,
          },
        ]
      },
    ]
  },

  {
    _tag: 'CSidebarNavTitle',
    _children: ['Relatórios']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Relatórios Gerenciais',
    route: '/reports',
    icon: 'cil-chart-pie',
    _children: [
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Empresas',
        route: '/reports/company',
        
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Relatório Geral',
            to: '/reports/company/list',
            icon:  <CIcon/>,
          }
        ]
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Advogados',
        route: '/administrativo/action',
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Relatório Geral',
            to: '/reports/attorney/list',
            icon:  <CIcon/>,
          }
        ]
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Processos',
        route: '/administrativo/process',
        
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Salvar',
            to: '/administrativo/process/salvar',
            icon:  <CIcon/>,
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Listar',
            to: '/administrativo/process/list',
            icon:  <CIcon/>,
          },
        ]
      },
    ]
  },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Base',
  //   route: '/base',
  //   icon: 'cil-puzzle',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Company',
  //       to: '/base/company',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Carousel',
  //       to: '/base/carousels',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Collapse',
  //       to: '/base/collapses',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Forms',
  //       to: '/base/forms',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Jumbotron',
  //       to: '/base/jumbotrons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'List group',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Navs',
  //       to: '/base/navs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Navbars',
  //       to: '/base/navbars',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Pagination',
  //       to: '/base/paginations',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Progress',
  //       to: '/base/progress-bar',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Switches',
  //       to: '/base/switches',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tabs',
  //       to: '/base/tabs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Buttons',
  //   route: '/buttons',
  //   icon: 'cil-cursor',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Brand buttons',
  //       to: '/buttons/brand-buttons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Dropdowns',
  //       to: '/buttons/button-dropdowns',
  //     }
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: 'cil-chart-pie'
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Icons',
  //   route: '/icons',
  //   icon: 'cil-star',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Notifications',
  //   route: '/notifications',
  //   icon: 'cil-bell',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Toaster',
  //       to: '/notifications/toaster'
  //     }
  //   ]
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: 'cil-calculator',
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   _tag: 'CSidebarNavDivider'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Extras'],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Pages',
  //   route: '/pages',
  //   icon: 'cil-star',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Disabled',
  //   icon: 'cil-ban',
  //   badge: {
  //     color: 'secondary',
  //     text: 'NEW',
  //   },
  //   addLinkClass: 'c-disabled',
  //   'disabled': true
  // },
  // {
  //   _tag: 'CSidebarNavDivider',
  //   className: 'm-2'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Labels']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label danger',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-danger'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label info',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-info'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label warning',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-warning'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavDivider',
  //   className: 'm-2'
  // }
]

export default _nav
