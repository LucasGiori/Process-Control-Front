import React from 'react';

const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));
const Company = React.lazy(() => import('./views/base/company/Company'));

const UserSave = React.lazy(() => import('./views/gestao/user/UserSave'));
const UserList = React.lazy(() => import('./views/gestao/user/UserList'));

const State = React.lazy(() => import('./views/administrativo/state/State'));
const CityList = React.lazy(() => import('./views/administrativo/city/City'));

const CompanySave = React.lazy(() => import('./views/administrativo/company/CompanySave'));
const CompanyList = React.lazy(() => import('./views/administrativo/company/CompanyList'));

const AttorneySave = React.lazy(() => import('./views/administrativo/attorney/AttorneySave'));
const AttorneyList = React.lazy(() => import('./views/administrativo/attorney/AttorneyList'));

const ActionSave = React.lazy(() => import('./views/administrativo/action/ActionSave'));
const ActionList = React.lazy(() => import('./views/administrativo/action/ActionList'));

const ProcessSave = React.lazy(() => import('./views/administrativo/process/ProcessSave'));
const ProcessList = React.lazy(() => import('./views/administrativo/process/ProcessList'));
const ProcessTabs = React.lazy(() => import('./views/administrativo/process/ProcessTabs'));


const CompanyReport = React.lazy(() => import('./views/reports/company/CompanyReport'));
const AttorneyReport = React.lazy(() => import('./views/reports/attorney/AttorneyReport'));
const ProcessReport = React.lazy(() => import('./views/reports/process/ProcessReport'));


const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/company', name: 'Company', component: Company},

  { path: '/gestao/user/salvar/:id?', name: 'Salvar Usu??rio', component: UserSave},
  { path: '/gestao/user/list', name: 'Lista Usu??rio', component: UserList},

  { path: '/administrativo/state', name: 'Estados', component: State},

  { path: '/administrativo/company/salvar/:id?', name: 'Salvar Empresa', component: CompanySave},
  { path: '/administrativo/company/list', name: 'Lista Empresas', component: CompanyList},

  { path: '/administrativo/attorney/salvar/:id?', name: 'Salvar Advogado', component: AttorneySave},
  { path: '/administrativo/attorney/list', name: 'Lista Advogados', component: AttorneyList},

  { path: '/administrativo/action/salvar/:id?', name: 'Salvar A????o', component: ActionSave},
  { path: '/administrativo/action/list', name: 'Lista A????o', component: ActionList},

  { path: '/administrativo/process/salvar/:id?', name: 'Salvar Processo', component: ProcessSave},
  { path: '/administrativo/process/list', name: 'Lista Processos', component: ProcessList},
  { path: '/administrativo/process/maintenance/:id?', name: 'Processo', component: ProcessTabs},

  { path: '/reports/company/list', name: 'Relat??rio Empresas', component: CompanyReport},
  { path: '/reports/attorney/list', name: 'Relat??rio Advogados', component: AttorneyReport},
  { path: '/reports/process/list', name: 'Relat??rio Processos', component: ProcessReport},
  
  { path: '/administrativo/city', name: "Cidades", component: CityList},
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User }
];

export default routes;
