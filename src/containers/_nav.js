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
          // {
          //   _tag: 'CSidebarNavItem',
          //   name: 'Manutenção',
          //   to: '/administrativo/process/maintenance',
          //   icon:  <CIcon/>
          // }
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
            name: 'Relatório Geral',
            to: '/reports/process/list',
            icon:  <CIcon/>,
          },
        ]
      },
    ]
  },
  
]

export default _nav
