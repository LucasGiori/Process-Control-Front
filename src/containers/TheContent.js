import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer } from '@coreui/react'

// routes config
import routes from '../routes'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = () => {

  const infoLogin = JSON.parse(window.localStorage.getItem('data') ?? '{}');
  const TYPE_USER_ORDINARY = 2;

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              if (infoLogin !== {} && route.path.indexOf("/gestao") >= 0 && parseInt(infoLogin.type) === TYPE_USER_ORDINARY) {
                return;
              }
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => 
                    window.localStorage.getItem('token-processcontrol') !== null ? (
                      <route.component {...props} />  ) : (
                      <Redirect to={{ pathname: "/login" }} /> )
                } />
              )
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
