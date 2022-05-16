import React from 'react'
import { Navigate, Route, Routes as ReactRoutes } from 'react-router-dom'
import Login from '../pages/login/login'
import Register from '../pages/register/register'
import Welcome from '../pages/welcome/welcome'
import RouteCodes from './route-codes'

const Routes = () => {
  return (
    <>
      <ReactRoutes>
        <Route path={RouteCodes.welcome} element={<Welcome />} />
        <Route path={RouteCodes.login} element={<Login />} />
        <Route path={RouteCodes.register} element={<Register />} />
        <Route path="/" element={<Navigate replace to={RouteCodes.welcome} />} />
      </ReactRoutes>
    </>
  )
}

export default Routes
