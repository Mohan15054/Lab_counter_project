import React, { useState, useEffect } from 'react';
import './Kpi_card.css';

const KpiCard = () => {
  const [forwardCount, setForwardCount] = useState(0);
  const [reverseCount, setReverseCount] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
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

    fetchData();
  }, [startTime, endTime]);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
  };

  const handleEndTimeChange = (date) => {
    setEndTime(date);
  };

  return (
    <div className="kpi-card">
      <div className="kpi-card-container">
        <h3>Forward Count</h3>
        <p>{forwardCount}</p>
      </div>
      <div className="kpi-card-container">
        <h3>Reverse Count</h3>
        <p>{reverseCount}</p>
      </div>
      <div className="date-picker-container">
        <label htmlFor="start-time">Start Time:</label>
        <input type="datetime-local" id="start-time" value={startTime.toISOString().slice(0, -8)} onChange={(e) => handleStartTimeChange(new Date(e.target.value))} />
      </div>
      <div className="date-picker-container">
        <label htmlFor="end-time">End Time:</label>
        <input type="datetime-local" id="end-time" value={endTime.toISOString().slice(0, -8)} onChange={(e) => handleEndTimeChange(new Date(e.target.value))} />
      </div>
    </div>
  );
};

export default KpiCard;
