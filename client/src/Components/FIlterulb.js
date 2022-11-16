import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { logout } from "../action/useraction";
import { Header } from "./Header";
import { LOader } from "./LOader";
import { SideNavigation } from "./SideNavigation";

export const FIlterulb = () => {
  const { loading, filedata } = useSelector((state) => state.apidata);
  const { user, isAuthenticated ,  error, success, isUpdated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { district,years } = useParams();
  const [year, setYear] = useState(years);
  const [filterdata, setfilterdata] = useState([]);
  // console.log(district);
  const [newloading, setNewloading] = useState(false);
  
  useEffect(() => {
    if (user) {
      if (user.role === "user") {
        dispatch(logout());
        navigate("/employeelogin");
      }
    } else {
      navigate("/");
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const searchdistrict = async (year) => {
    if(years){
      year= years
    }
    else if (year === undefined) {
      year = getCurrentFinancialYear();
    }
    setNewloading(true)

    const res = await axios.post("/api/auth/getxlsxfile", {
      District: district,
      year: year,
    });
    console.log(res.data.length);

    setfilterdata(res.data);
    setNewloading(false);
    searchdistrictcount(year)

  };
  const [uploadcount, setUploadcount] = useState([]);
  const searchdistrictcount = async (year) => {
    // let year
    console.log(year);
    if(year!==undefined){
      year = year
    }
    else if (year === undefined) {
      year = getCurrentFinancialYear();
    }
    console.log(year);
    const res = await axios.post("/api/auth/searchall", {
      District: district,
      year: year,
    });
    setUploadcount(res.data);
  };
  let obj = {};

  uploadcount.forEach((item) => {
    //console.log(obj[item.name]) this return as undefined
    if (!obj[item["ULB Name"]]) {
      obj[item["ULB Name"]] = 1;
    } else {
      obj[item["ULB Name"]] += 1;
    }
  });
  useEffect(() => {
    searchdistrict();
  }, []);
  const getUniqueBy = (arr, prop) => {
    const set = new Set();
    return arr.filter((o) => !set.has(o[prop]) && set.add(o[prop]));
  };
  const fmap = () => {
    try {
      // console.log(data);
      const ffmap = getUniqueBy(filterdata, "ULB Name").map((row, index) => {
        if (obj[row["ULB Name"]] === undefined) {
          obj[row["ULB Name"]] = 0;
        }

        return (
          <tr>
            <td>{index + 1}</td>
              <td>
            <Link to={`/filter/${district}/${row["ULB Name"]}/${year}`}>
                {row["ULB Name"]}
            </Link>
              </td>
            <td>{loanobj[row["ULB Name"]]}</td>
            <td>{obj[row["ULB Name"]]}</td>
            <td>{loanobj[row["ULB Name"]] - obj[row["ULB Name"]]}</td>
          </tr>
        );
      });
      return ffmap;
    } catch (error) {
      console.log(error);
    }
  };
  let loanobj = {};

  filedata.forEach((item) => {
    //console.log(loanobj[item.name]) this return as undefined
    if (!loanobj[item["ULB Name"]]) {
      loanobj[item["ULB Name"]] = 1;
    } else {
      loanobj[item["ULB Name"]] += 1;
    }
  });

  // console.log(loanobj);

  // console.log(obj);
  const searchdis = async (event) => {
    console.log(event.target.value);
    let year;
    if (event) {
      year = event.target.value;
    } else if (!event) {
      year = getCurrentFinancialYear();
    }
    searchdistrictcount(year)
    setYear(year)

    setNewloading(true)
    console.log(year);
    // const res = await axios.post("/api/auth/getxlsxfile", {
    //   District: district,
    //   year: year,
    // });

    // // console.log(res.data);
    // setfilterdata(res.data);
    setNewloading(false)

  };
  const nsns = new Date().getFullYear().toString();

  function getCurrentFinancialYear() {
    var financial_year = "";
    var today = new Date();
    if (today.getMonth() + 1 <= 3) {
      financial_year =
        (new Date().getFullYear() - 1).toString().slice(2) +
        "-" +
        today.getFullYear();
    } else {
      financial_year =
        nsns + "-" + (today.getFullYear() + 1).toString().slice(2);
    }
    return financial_year;
  }
  console.log(newloading);
  return (
    <div className="viewlisttop">
      <div className="viewlistboarder">
        <SideNavigation />
        <Header />
        <div className="AddFlex">
          <div style={{ width: "70%", marginLeft: "30%" }}>
            <div style={{ width: "90%" }}>
              <div className="breadcum">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <Link to={`/filter`}>
                      <li class="breadcrumb-item active" aria-current="page">
                        Home
                      </li>
                    </Link>

                    <li class="breadcrumb-item active" aria-current="page">
                      {district}
                    </li>
                  </ol>
                </nav>

                <Link to="/filter">
                  <li class="breadcrumb-item active" aria-current="page">
                    <button className="btn btn-outline-dark">back</button>
                  </li>
                </Link>
              </div>
              <div
                style={{ overflow: "scroll", overflowY: "hidden" }}
                className="table-responsive"
              >
                <label>Financial Year:</label>
                <select value={year} required onChange={searchdis}>
                  <option  value={getCurrentFinancialYear()}>
                    Current year:{getCurrentFinancialYear()}
                  </option>

                  <option value="2020-21">2020-21</option>
                  <option value="2021-22">2021-22</option>
                  <option value="2022-23">2022-23</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                  <option value="2028-29">2028-29</option>
                  <option value="2029-30">2029-30</option>
                  <option value="2030-31">2030-31</option>
                </select>
                {loading || newloading === true  ? (
                  <LOader />
                ) : filedata.length >= 1 ? (
                  <>
                    <table className="table" responsive="true">
                      <thead>
                        <tr>
                          <th> S No </th>
                          <th>ULB Name</th>
                          <th>Total SHGs</th>
                          <th>Uploaded SHGs</th>
                          <th>Balance SHGs </th>
                        </tr>
                      </thead>
                      <tbody>{fmap()}</tbody>
                    </table>
                  </>
                ) : (
                  <>
                    <div>
                      {" "}
                      <h1>no data found</h1>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
