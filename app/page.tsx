"use client"
import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');
  const [alarm, setAlarm] = useState('');

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://192.168.4.1/control?cmd=Status,G,21');
      if (response.ok) {
        const data = await response.json();
        if (data.state == '0') {
          setStatus('1');
        } else if (data.state == '1') {
          setStatus('0');
        } else {
          setStatus('Nieznany status');
        }
      } else {
        console.error('Błąd podczas pobierania danych');
      }
    } catch (error) {
      console.error('Błąd podczas pobierania statusu:', error);
    }
  };

  const fetchAlarm = async () => {
    try {
      const response = await fetch('http://192.168.4.1/control?cmd=Status,G,1');
      if (response.ok) {
        const data = await response.json();
        if (data.state == '1') {
          setAlarm('1');
        } else if (data.state == '0') {
          setAlarm('0');
        } else {
          setAlarm('Nieznany status');
        }
      } else {
        console.error('Błąd podczas pobierania danych');
      }
    } catch (error) {
      console.error('Błąd podczas pobierania alarmu:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus();
      fetchAlarm();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // renderowanie





  let statusColorClass = ''; 
  let statusText = '';
  switch (status) {
    case '1':
      statusColorClass = 'text-red-500';
      statusText = ' wykrycie';
      break;
    case '0':
      statusColorClass = 'text-green-500';
      statusText = ' brak';
      break;
    default:
      statusColorClass = 'text-yellow-500';
      statusText = ' Nieznany status';
  }

  let alarmColorClass = '';
  let alarmText = '';
  switch (alarm) {
    case '1':
      alarmColorClass = 'text-green-500';
      alarmText = ' Alarm uzbrojony';
      break;
    case '0':
      alarmColorClass = 'text-red-500';
      alarmText = ' Alarm rozbrojony';
      break;
    default:
      alarmColorClass = 'text-yellow-500';
      alarmText = ' Nieznany status alarmu';
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full justify-between font-mono text-sm ">
        <h1 className="flex justify-center text-lg">Witaj na stronie konfiguracji alarmu</h1>
        <div className="flex justify-between pt-2 mt-10">
          <div>
            Status alarmu:
            <span className={alarmColorClass}>{alarmText}</span>
            <br />
            Ruch: 
            <span className={statusColorClass}>{statusText}</span>
          </div>
          <div>
            <h2>Uzbrajanie/rozbrajanie alarmu</h2>
            <br />
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-gray-400 p-4">1</button>
              <button className="bg-gray-400 p-4">2</button>
              <button className="bg-gray-400 p-4">3</button>
              <button className="bg-gray-400 p-4">4</button>
              <button className="bg-gray-400 p-4">5</button>
              <button className="bg-gray-400 p-4">6</button>
              <button className="bg-gray-400 p-4">7</button>
              <button className="bg-gray-400 p-4">8</button>
              <button className="bg-gray-400 p-4">9</button>
              <button className="bg-gray-400 p-4">*</button>
              <button className="bg-gray-400 p-4">0</button>
              <button className="bg-gray-400 p-4">#</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
