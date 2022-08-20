import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import TutorialDataService from "../services/TutorialService";
import { useTable } from "react-table";
import moment from "moment";
const TutorialsList = (props) => {
    const [tutorials, setTutorials] = useState([]);
    const tutorialsRef = useRef();
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(30);

    tutorialsRef.current = tutorials;

    const getRequestParams = ( page, pageSize) => {
        let params = {};

        params["tags"] = 'front_page';

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["hitsPerPage"] = pageSize;
        }

        return params;
    };

      const retrieveTutorials = () => {
        const params = getRequestParams(page, pageSize);
        TutorialDataService.getAll(params)
          .then((response) => {
            const tutorials = response.data.hits;
            const totalPages = response.data.nbPages;
            setTutorials(tutorials);
            setCount(totalPages);
            localStorage.setItem('items', JSON.stringify(tutorials));
          })
          .catch((e) => {
            console.log(e);
          });
      };

      useEffect(retrieveTutorials, [page, pageSize]);

 

      const columns = useMemo(
        () => [
          {
            Header: "Comments",
            accessor: "num_comments",
          },
          {
            Header: "Vote Count",
            accessor: "points",
          },
          {
            Header: "UpVote",
            accessor: "",
            Cell: ({ cell }) => {
              return (
                <React.Fragment>
                  <div className="text-center"><i className="arrow up"></i></div>
                </React.Fragment>
                  )
            }
          },
          {
            Header: "News Details",
            accessor: "title",
            Cell: ({ cell }) => {
              return (
                <React.Fragment>
                  <div>{cell.row.original.title} </div>
                </React.Fragment>
                  )
            }
          },
        ],
        []
      );

      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data: tutorials,
      });

      return (
        <div className="list row">
          <div className="col-md-12 list">
            <table
              className="table table-striped table-bordered table-responsive"
              {...getTableProps()}
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-3">
     
            </div>
          </div>
        </div>
      );
};

export default TutorialsList;