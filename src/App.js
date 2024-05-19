import React, { useState } from 'react';
import data from './salaries.json';
import LineGraph from './LineGraph';
import './App.css';

export default function App() {
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const getYearlyData = () => {
    const yearlyData = data.reduce((acc, item) => {
      const { work_year, salary_in_usd } = item;
      if (!acc[work_year]) {
        acc[work_year] = { year: work_year, totalJobs: 0, totalSalary: 0 };
      }
      acc[work_year].totalJobs += 1;
      acc[work_year].totalSalary += salary_in_usd;
      return acc;
    }, {});

    return Object.values(yearlyData).map(item => ({
      year: item.year,
      totalJobs: item.totalJobs,
      avgSalary: item.totalSalary / item.totalJobs
    }));
  };

  const getJobTitlesByYear = (year) => {
    return data
      .filter(item => item.work_year === year)
      .reduce((acc, item) => {
        if (!acc[item.job_title]) {
          acc[item.job_title] = 0;
        }
        acc[item.job_title] += 1;
        return acc;
      }, {});
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...getYearlyData()];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="table-container">


      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('year')}>Year</th>
            <th onClick={() => requestSort('totalJobs')}>Number of Total Jobs</th>
            <th onClick={() => requestSort('avgSalary')}>Average Salary in USD</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} onClick={() => handleRowClick(item.year)}>
              <td>{item.year}</td>
              <td>{item.totalJobs}</td>
              <td>{item.avgSalary.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <LineGraph data={data.reduce((acc, item) => {
        const { work_year } = item;
        if (!acc[work_year]) {
          acc[work_year] = { totalJobs: 0 };
        }
        acc[work_year].totalJobs += 1;
        return acc;
      }, {})} />

      {selectedYear && (
        <div className="secondary-table">
          <h2>Job Titles for {selectedYear}</h2>
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Number of Jobs</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(getJobTitlesByYear(selectedYear)).map(([jobTitle, count], index) => (
                <tr key={index}>
                  <td>{jobTitle}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

