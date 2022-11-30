import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "./Header";
import { SideNavigation } from "./SideNavigation";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../action/useraction";
import { LOader } from "./LOader";
import { Pagination } from "./Pagination";
export const Filtershg = () => {
  const [data, setData] = useState([]);
  const { slf, district, ulb, tlfname, years } = useParams();
  const [year, setYear] = useState(years);
  const [uploadblank, setuploadblank] = useState(false);

  // console.log(year);
  const dispatch = useDispatch;
  const navigate = useNavigate();
  const { user, isAuthenticated, error, loading, success, isUpdated } =
    useSelector((state) => state.user);
  const [newloading, setnewloading] = useState(false);

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
  const [filterdata, setfilterdata] = useState([]);
  const [notuplod, setNotuplod] = useState(false);

  // console.log(slf);

  const searchdistrict = async (event) => {
    setnewloading(true);
    setuploadblank(false);
    setCurrentPage(1);
    const res = await axios
      .post("/api/auth/searchall", {
        "SLF Name": slf,
        year: year,
      })
      .then(
        (res) => (
          setfilterdata(res.data),
          setnewloading(false),
          setnPages(Math.ceil(res.data.length / recordsPerPage)),
          setNotuplod(false)
        )
      );
  };
  const searchdis = async (event) => {
    let year;
    if (event) {
      year = event.target.value;
    } else if (!event) {
      year = getCurrentFinancialYear();
    }
    setYear(year);
    // console.log(event.target.value);
    const res = await axios.post("/api/auth/searchall", {
      "SLF Name": slf,
      year: year,
    });
    // console.log(res.data);
    if (uploadblank === false) {
      setfilterdata(res.data);
    }
  };
  useEffect(() => {
    searchdistrict();
  }, []);

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
  let datas;
  const fmap = () => {
    if (notuplod === true) {
      datas = filterdata[0].slice(indexOfFirstRecord, indexOfLastRecord);
    } else if (notuplod === false) {
      datas = filterdata.slice(indexOfFirstRecord, indexOfLastRecord);
    } else if (uploadblank === true) {
      datas = filterdata.slice(indexOfFirstRecord, indexOfLastRecord);
    }

    try {
      const ffmap = datas.map((row, indexs) => {
        return (
          // {Object}.key(datas),
          <tr>
            <td>{indexs + 1}</td>
            {Object.keys(datas[0])
              .filter((item, index) => {
                return item !== "_id";
              })
              .map((key, index) => {
                // console.log(row["SHG ID"]);
                const rooo = Object.keys(datas).filter((item, index) => {
                  // console. log(item);
                });
                return (
                  <>
                    <td>{row[key]}</td>
                  </>
                );
              })}
          </tr>
        );
      });
      return ffmap;
    } catch (error) {
      console.log(error);
    }
  };

  const hmap = () => {
    let datas;
    if (notuplod === true) {
      datas = filterdata[0];
    } else if (notuplod === false) {
      datas = filterdata;
    } else if (uploadblank === true) {
      datas = filterdata;
    }
    try {
      const hhmap = Object.keys(datas[0])
        .filter((item, index) => {
          return item !== "_id";
        })
        .map((heading, index) => {
          return (
            <>
              <th>{heading}</th>
            </>
          );
        });
      <th>s.no</th>;
      return hhmap;
    } catch (error) {
      console.log(error);
    }
  };
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const downloadExcel = () => {
    let datas;
    if (notuplod === true) {
      datas = filterdata[0];
    } else if (notuplod === false) {
      datas = filterdata;
    } else if (uploadblank === true) {
      datas = filterdata;
    }
    const ws = XLSX.utils.json_to_sheet(datas);
    // console.log(ws);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "excel" + fileExtension);
  };
  let ids;
  let cars1;
  const notuploadshgid = async () => {
    setnewloading(true);
    setuploadblank(true);

    const res = await axios
      .post("/api/auth/getxlsxfile", {
        "SLF Name": slf,
      })
      .then((res) =>
        filterdata.length >= 1
          ? ((ids = filterdata.map((items) => items["SHGID"])),
            (cars1 = res.data.filter((item) => !ids.includes(item["SHG Id"]))),
            console.log(cars1),
            setfilterdata([cars1]),
            setNotuplod(true),
            setnPages(Math.ceil(res.data.length / recordsPerPage)),
            setnewloading(false))
          : // console.log("test2")
            (setfilterdata(res.data),
            setNotuplod(false),
            setnewloading(false),
            setuploadblank(true),
            setnPages(Math.ceil(res.data.length / recordsPerPage)))
      );
  };
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const [nPages, setnPages] = useState();
  // const [indexOfFirstRecord, setindexOfFirstRecord ] = useState(indexOfLastRecord - recordsPerPage);

  // const nPages = Math.ceil(filterdata.length / recordsPerPage);
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  return (
    <>
      <div className="viewlisttop">
        <div className="viewlistboarder">
          <SideNavigation />
          <Header />
          <div className="AddFlex">
            <div style={{ width: "70%", marginLeft: "30%" }}>
              <div style={{ width: "100%" }}>
                <button className="btn" onClick={downloadExcel}>
                  <i class="fa fa-download" aria-hidden="true"></i>
                </button>

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

                    <li class="breadcrumb-item active" aria-current="page">
                      {tlfname}
                    </li>

                    <li class="breadcrumb-item active" aria-current="page">
                      {slf}
                    </li>
                  </ol>
                  <Link to={`/filter/${district}/${ulb}/${tlfname}/${years}`}>
                    <li class="breadcrumb-item active" aria-current="page">
                      <button className="btn btn-outline-dark">back</button>
                    </li>
                  </Link>
                </div>
                <label>Financial Year:</label>
                <select
                  className="form-select-bg"
                  value={year}
                  required
                  onChange={searchdis}
                >
                  <option selected value={getCurrentFinancialYear()}>
                    Current year:
                    <br />
                    {getCurrentFinancialYear()}
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
              </div>

              <button className="btn btn-primary ml-1" onClick={searchdistrict}>
                {" "}
                Uploaded
              </button>
              <button className="btn btn-primary ml-1" onClick={notuploadshgid}>
                notuploaded
              </button>
              {loading ? (
                <LOader />
              ) : filterdata.length >= 1 ? (
                <>
                  {newloading === true ? (
                    <LOader />
                  ) : (
                    <div
                      style={{ overflow: "scroll", overflowY: "hidden" }}
                      className="table-responsive"
                    >
                      <table className="table" responsive="true">
                        <thead>
                          <tr>
                            <th>S.no</th>
                            {hmap()}
                          </tr>
                        </thead>
                        <tbody>{fmap()}</tbody>
                      </table>
                      <Pagination
                        nPages={nPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  )}
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
    </>
  );
};
