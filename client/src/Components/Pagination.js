import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
console.log(nPages);
let pagenum=[]
let text = "";
for (let i = 1; i <= nPages; i++) {
 pagenum.push(i)
}

console.log(pagenum);

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <>
      <nav style={{ display: "flex", justifyContent: "center" }}>
      {pagenum.length >1?(        
        <>
        {/* {currentPage === 1 ? (
          <ul className="pagination justify-content-center"></ul>
        ) : ( */}
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <Link className="page-link" onClick={prevPage} to="#">
                Previous
              </Link>
            </li>
          </ul>
        {/* )} */}
        {pagenum.length >1&&pagenum.map((item,index)=>{
          console.log(item);
          return(
<button className="btn btn-info ml-1" onClick={()=>{setCurrentPage(item)}}>{item}</button>

          )
        })}
        {/* {currentPage === nPages ? (
          <> </>
        ) : ( */}
          <>
            {" "}
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <Link className="page-link" onClick={nextPage} to="#">
                  Next
                </Link>
              </li>
            </ul>
          </>
        {/* )} */}
        </>

        ):("")}

      </nav>
    </>
  );
};
