import React from "react";
import "./SideNavigation.css";
import { Link, Outlet } from "react-router-dom";

export const SideNavigation = () => {
  return (
    <>
      <div className="navbox">
        <Link to="/addlist" className="nav-link navbar-link">
          <div className="flex">
            <h4>Add SHG Details</h4>
            <h5>{`>`}</h5>
          </div>
        </Link>
        <Link to="/viewlist" className="nav-link navbar-link">
          <div className="flexA">
            <h4>Edit SHG Details</h4>
            <h5>{`>`}</h5>
          </div>
        </Link>

        <Link to="/checkgrade" className="nav-link navbar-link">

        <div className="flexA">
          <h4>Search Grade by SHG</h4>
          <h5>{`>`}</h5>
        </div>
        </Link>
        <Link to="/filter" className="nav-link navbar-link">
          <div className="flexA">
            <h4>Dashboard</h4>
            <h5>{`>`}</h5>
          </div>
        </Link>
        <Link to="/bankform" className="nav-link navbar-link">
          <div className="flexA">
            <h4>Enter Grade Details</h4>
            <h5>{`>`}</h5>
          </div>
        </Link>
      </div>
    </>
  );
};
