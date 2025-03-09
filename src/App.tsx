import React, { ReactElement } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import packageInfo from "../package.json";
import Dashboard from "pages/Dashboard";
import NotFound from "pages/Page404";
import Login from "pages/Login";
import * as routes from "constants/routes";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
	const user = localStorage.getItem("username");
	return user ? children : <Navigate to={routes.LOGIN} />;
};

const AppComponent = (): ReactElement => {
  return (
    <BrowserRouter basename={packageInfo.homepage}>
		<Routes>
			<Route path={routes.LOGIN} element={<Login />} />
			<Route path={routes.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
			<Route path={routes.NOT_FOUND} element={<NotFound />} />
		</Routes>
    </BrowserRouter>
  );
};

export const App = AppComponent;
