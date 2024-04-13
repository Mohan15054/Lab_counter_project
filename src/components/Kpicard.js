import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './Kpi_card.css';


const KpiCard = () => {
  const [forwardCount, setForwardCount] = useState(0);
  const [reverseCount, setReverseCount] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const fetchData = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'j8y2yILCpgmMWXrhOoXuSmGVYSZTj0P4yv8lqKYRS26JkefufLXzPZlHkEIsUaTS'
      },
      body: JSON.stringify({
        query: `
            query MyQuery($startTime: timestamptz!, $endTime: timestamptz!) @cached {
              forward_count: counter_count_aggregate(
                where: {
                  direction: { _eq: "forward" }
                  time: { _gt: $startTime, _lt: $endTime }
                }
              ) {
                aggregate {
                  count
                }
              }
              
              reverse_count: counter_count_aggregate(
                where: {
                  direction: { _eq: "reverse" }
                  time: { _gt: $startTime, _lt: $endTime }
                }
              ) {
                aggregate {
                  count
                }
              }
            }
          `,
        variables: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        }
      })
    };

    try {
      const response = await fetch('https://cunning-weasel-75.hasura.app/v1/graphql', requestOptions);
      const data = await response.json();

      setForwardCount(data.data.forward_count.aggregate.count);
      setReverseCount(data.data.reverse_count.aggregate.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStartTimeChange = (date) => {
    setStartTime(date);
  };

  const handleEndTimeChange = (date) => {
    setEndTime(date);
  };

  const handlefetchApi = () => {
    fetchData();
  };

  const formatDateForInput = (date) => {
    const timezoneOffset = date.getTimezoneOffset();
    const adjustedDate = new Date(date);
    adjustedDate.setMinutes(adjustedDate.getMinutes() - timezoneOffset);
    const utcString = adjustedDate.toISOString();
    const dateString = utcString.slice(0, 16);
    return dateString.replace('T', ' ');
  };

  const handleReset = () => {
    setForwardCount(0);
    setReverseCount(0);
    setEndTime(new Date());
    setStartTime(new Date());
  };

  return (
    <React.Fragment>
      <div className="date-picker-container">
        <div className='datepicker_child'>
          <label htmlFor="start-time" className='label-text'>Start Time:</label>
          <input type="datetime-local" id="start-time" value={formatDateForInput(startTime)} onChange={(e) => handleStartTimeChange(new Date(e.target.value))} />
        </div>
        <div className='datepicker_child'>
          <label htmlFor="end-time" className='label-text'>End Time:</label>
          <input type="datetime-local" id="end-time" value={formatDateForInput(endTime)} onChange={(e) => handleEndTimeChange(new Date(e.target.value))} />
        </div>
        <div className='btnParent'>
          <button className='btnstyle' onClick={handlefetchApi}>Go</button>
        </div>
      </div>
      <br />
      <div className="kpi-card">
        <div>
          <div className="kpi-card-container">
            <h3 className="kpi-title">👩🏽 In Count</h3>
            <p className="kpi-value">{forwardCount}</p>
          </div>
        </div>
        <div className="kpi-card-container">
          <h3 className="kpi-title">👩🏽 Out Count</h3>
          <p className="kpi-value">{reverseCount}</p>
        </div>
        <div className="kpi-card-container">
          <h3 className="kpi-title">👩🏽 Available count</h3>
          <p className="kpi-value">{forwardCount - reverseCount}</p>
        </div>
      </div>
      {
        (forwardCount > 0 || reverseCount > 0) &&
        <div className='btnParentReset'>
          <button className='btnstyle' onClick={handleReset}>Reset</button>
        </div>
      }
    </React.Fragment>
  );
};





export default KpiCard;
