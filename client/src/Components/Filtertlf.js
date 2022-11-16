import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { logout } from "../action/useraction";
import { Header } from "./Header";
import { LOader } from "./LOader";
import { SideNavigation } from "./SideNavigation";
export const Filtertlf = () => {
  const { loading, filedata } = useSelector((state) => state.apidata);
  const dispatch = useDispatch;
  const navigate = useNavigate();
  const { user, isAuthenticated, error, success, isUpdated } = useSelector(
    (state) => state.user
  );
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
  const { ulb, district,years} = useParams();
  // console.log(ulb);
  const getUniqueBy = (arr, prop) => {
    const set = new Set();
    return arr.filter((o) => !set.has(o[prop]) && set.add(o[prop]));
  };

  const [year, setYear] = useState(years);

  const [data, setData] = useState([]);
  const [filterdata, setfilterdata] = useState([]);

  const searchdistrict = async (year) => {
    if(years){
      year= years
    }
    else if (year === undefined) {
      year = getCurrentFinancialYear();
    }
    setNewloading(true)
    searchdistrictcount(year)

    const res = await axios.post("/api/auth/getxlsxfile", {
      "ULB Name": ulb,
      year: year,
    });
    
    // console.log(res.data);
    setfilterdata(res.data);
    setNewloading(false);

    // console.log(res.data);
  };
  useEffect(() => {
    searchdistrict();
  }, []);
  const [uploadcount, setUploadcount] = useState([]);
  const searchdistrictcount = async (year) => {
    if(year!==undefined){
      year = year
    }
    else if (year === undefined) {
      year = getCurrentFinancialYear();
    }
    const res = await axios.post("/api/auth/searchall",{
      "ULB Name": ulb,
      year: year,
    });
    setUploadcount(res.data);
    // console.log(res.data.length);
  };
  let obj = {};

  uploadcount.forEach((item) => {
    //console.log(obj[item.name]) this return as undefined
    if (!obj[item["TLF Name"]]) {
      obj[item["TLF Name"]] = 1;
    } else {
      obj[item["TLF Name"]] += 1;
    }
  });

  // console.log(obj);
  let loanobj = {};

  filedata.forEach((item) => {
    // console.log(loanobj[item.name])
    if (!loanobj[item["TLF Name"]]) {
      loanobj[item["TLF Name"]] = 1;
    } else {
      loanobj[item["TLF Name"]] += 1;
    }
  });

  // console.log(loanobj);

  // console.log(filterdata);
  const fmap = () => {
    try {
      const ffmap = getUniqueBy(filterdata, "TLF Name").map((row, index) => {
        // console.log(obj[row]);
        // console.log(obj[row["TLF Name"]]);
        if (obj[row["TLF Name"]] === undefined) {
          obj[row["TLF Name"]] = 0;
        }
        return (
          // {Object}.key(filterdata[0]),
          <tr>
            <td>{index + 1}</td>

              <td>
            <Link to={`/filter/${district}/${ulb}/${row["TLF Name"]}/${year}`}>
                {row["TLF Name"]}
            </Link>
              </td>
            <td>{loanobj[row["TLF Name"]]}</td>
            <td>{obj[row["TLF Name"]]}</td>
            <td>{loanobj[row["TLF Name"]] - obj[row["TLF Name"]]}</td>
          </tr>
        );
      });
      return ffmap;
    } catch (error) {
      console.log(error);
    }
  };

  const searchdis = async (event) => {
    // console.log(event.target.value);
    let year;
    if (event) {
      year = event.target.value;
    } else if (!event) {
      year = getCurrentFinancialYear();
    }
    searchdistrictcount(year);
    setYear(year)
    setNewloading(true)

    // const res = await axios.post("/api/auth/getxlsxfile", {
    //   "ULB Name": ulb,
    //   year: year,
    // });
    // console.log(res.data);
    setNewloading(false)

    // setfilterdata(res.data);
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
  return (
    <div className="viewlisttop">
      <div className="viewlistboarder">
        <SideNavigation />
        <Header />
        <div className="AddFlex">
          <div style={{ width: "70%", marginLeft: "30%" }}>
            <div style={{ width: "90%" }}>
              <div className="breadcum">
                <ol class="breadcrumb">
                <Link to={`/filter`}>
                      <li class="breadcrumb-item active" aria-current="page">
                        Home
                      </li>
                    </Link>

                  <li class="breadcrumb-item active" aria-current="page">
                    {district}
                  </li>

                  <li class="breadcrumb-item active" aria-current="page">
                    {ulb}
                  </li>
                </ol>
                <Link to={`/filter/${district}/${years}`}>
                  <li class="breadcrumb-item active" aria-current="page">
                    <button className="btn btn-outline-dark">back</button>
                  </li>
                </Link>
              </div>
              <div
                style={{ overflow: "scroll", overflowY: "hidden" }}
                className="table-responsive"
              >
                <select  value={year} required onChange={searchdis}>
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
                {loading || newloading === true ? (
                  <LOader />
                ) : filedata.length >= 1 ? (
                  <>
                    <table className="table" responsive="true">
                      <thead>
                        <tr>
                          <th> S No </th>
                          <td>TLF Name</td>
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
