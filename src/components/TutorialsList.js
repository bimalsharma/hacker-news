import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import TutorialDataService from "../services/TutorialService";
import { useTable } from "react-table";
import moment from "moment";
import MyCharts from './Charts';

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

      const handlePageChange = (event, value) => {
        setPage(value);
      };

      const handleClick = (event, param) => {
        const items = JSON.parse(localStorage.getItem('items'));
        const newState = items.map(obj => {
          if (obj.objectID === param) {
            return {...obj, points: obj.points+1};
          }
          return obj;
        });
        console.log(newState);
        localStorage.setItem('items', JSON.stringify(newState));
        const data = JSON.parse(localStorage.getItem('items'));
        setTutorials(data);
      };

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
                  <div onClick={event => handleClick(event, cell.row.original.objectID)} className="text-center"><i className="arrow up"></i></div>
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
                  <div>{cell.row.original.title} <small className="small-title">({cell.row.original.url})  by</small> <small className="small-title2">{cell.row.original.author}</small> <small className="small-title">{cell.row.original.url}  by</small> <small className="small-title">{moment(cell.row.original.created_at).startOf('hour').fromNow()}</small><small className="small-title2"> [hide] </small></div>
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
              <Pagination
                className="my-3 float-right"
                count={count}
                page={page}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
              />
            </div>
            <MyCharts data={tutorials} />
          </div>
        </div>
      );
};

export default TutorialsList;